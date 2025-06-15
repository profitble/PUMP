import { usePrivy } from '@privy-io/expo'
import { Redirect, Stack } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import 'react-native-reanimated'

import { useAuth } from '@/hooks'

import { WalletManagement } from '@/components'

export default function AuthLayout() {
  const { user, isLoading } = useAuth()
  const { user: privyUser, isReady } = usePrivy()

  if (isLoading || !isReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F0F0F',
        }}
      >
        <ActivityIndicator size="small" color="#fff" />
      </View>
    )
  }

  if (!user) {
    console.log('>>>> navigate to onboard cause no user')
    return <Redirect href="/onboard" />
  }

  // if (!privyUser) {
  //   console.log('>>>> navigate to privy-social-auth cause no privy user')
  //   return <Redirect href="/privy-social-auth" />
  //   // return <Redirect href="/signup" />;
  // }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="[coinDetails]"
          options={{
            headerTitleStyle: {
              fontFamily: 'SfProRoundedHeavy',
              fontSize: 20,
            },
            headerBlurEffect: 'regular',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerTitleStyle: {
              fontFamily: 'SfProRoundedHeavy',
              fontSize: 20,
            },
            headerBlurEffect: 'regular',
            headerTransparent: true,
          }}
        />
      </Stack>
      <WalletManagement />
    </>
  )
}
