import { router } from 'expo-router'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LoginWithOAuthInput, useLoginWithOAuth, usePrivy } from '@privy-io/expo'
import { supabase, removeAuthData } from '@/utils'
import { useLDClient } from '@launchdarkly/react-native-client-sdk'
import { Session } from '@supabase/supabase-js'

interface User extends PrivyUser {
  supabase: Session
  email: string | undefined
}

interface AuthData {
  user: User | null
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signOut: () => Promise<void>
  login: (input: LoginWithOAuthInput) => void
  isLoading: boolean
  onSuccessAuth: (privyUser: PrivyUser) => Promise<void>
}

type PrivyUser = NonNullable<ReturnType<typeof usePrivy>['user']>

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = '@auth_data'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { getAccessToken, user: currentPrivyUser, logout } = usePrivy()
  const ldc = useLDClient()

  const isAuthenticated = useMemo(() => !!user, [user])

  useEffect(() => {
    if (currentPrivyUser && !user) {
      logout()
    }
  }, [currentPrivyUser])

  useEffect(() => {
    ldc
      .identify({
        kind: 'user',
        key: user ? user.id : 'guest',
        name: user?.email || 'Guest',
      })
      .catch((e) => console.error('LaunchDarkly identify error:', e))
  }, [user, ldc])

  const handleError = (error: unknown, message: string) => {
    console.error(`${message}:`, error)
    Alert.alert('Error', message)
  }

  const storeAuthData = async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }))
    } catch (error) {
      handleError(error, 'Failed to store auth data')
    }
  }

  const getAuthData = async (): Promise<AuthData | null> => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY)
      return storedAuth ? JSON.parse(storedAuth) : null
    } catch (error) {
      handleError(error, 'Error retrieving auth data')
      return null
    }
  }

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const storedAuth = await getAuthData()
      console.info('Stored auth:', storedAuth)
      if (storedAuth?.user) {
        setUser(storedAuth.user)
        router.navigate('/(auth)/(tabs)/(coin)')
      } else {
        setUser(null)
      }
    } catch (error) {
      handleError(error, 'Error checking auth status')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) throw error

        const storedUser = await getAuthData()
        if (sessionData.session?.user && currentPrivyUser) {
          const email = sessionData.session.user.email
          const userData: User = storedUser?.user || {
            ...currentPrivyUser,
            supabase: sessionData.session,
            email,
          }
          router.navigate('/(auth)/(tabs)/(coin)')

          setUser(userData)
          if (!storedUser) {
            await storeAuthData(userData)
          }
        } else {
          await signOut()
        }
      } catch (error) {
        handleError(error, 'Failed to initialize auth')
      }
    }

    initAuth()
  }, [currentPrivyUser])

  const onSuccessAuth = async (privyUser: PrivyUser): Promise<void> => {
    setIsLoading(true)
    try {
      const privyToken = await getAccessToken()
      const { data, error } = await supabase.functions.invoke('authenticate', { body: { privyToken } })

      if (error) {
        throw new Error('Error invoking authenticate function')
      }

      if (!data.email_otp) {
        throw new Error('No Supabase token found')
      }

      const { data: supabaseData, error: verifyError } = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.email_otp,
        type: 'magiclink',
      })
      if (verifyError) throw verifyError

      const session = await supabase.auth.getSession()
      const supUser = await supabase.auth.getUser()
      if (!supUser.data.user?.id) throw new Error('Failed to retrieve user ID')

      ldc
        .identify({
          kind: 'user',
          key: supUser.data.user.id,
          name: supUser.data.user.email || '',
        })
        .catch((e) => console.error('LaunchDarkly identify error:', e))

      const mappedUser: User = {
        ...privyUser,
        supabase: session.data.session!,
        email: data.email,
      }

      await storeAuthData(mappedUser)
      setUser(mappedUser)

      router.navigate('/(auth)/(tabs)/(coin)')
    } catch (error) {
      handleError(error, 'Failed to log in with your account')
    } finally {
      setIsLoading(false)
    }
  }

  const { login, state } = useLoginWithOAuth({
    onSuccess: onSuccessAuth,
    onError: (error) => handleError(error, 'Failed to log in with your social account'),
  })

  const signOut = async (): Promise<void> => {
    try {
      await Promise.all([supabase.auth.signOut(), logout(), removeAuthData()])
      setUser(null)
    } catch (error) {
      handleError(error, 'Sign out failed')
    }
  }

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      signOut,
      login,
      isLoading: isLoading || state.status === 'loading',
      onSuccessAuth,
    }),
    [user, isAuthenticated, isLoading, state.status, login]
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
