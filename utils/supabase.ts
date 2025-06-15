import { Platform } from 'react-native'
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import * as aesjs from 'aes-js'
import * as SecureStore from 'expo-secure-store'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ebaqrryrinmxanbidylq.supabase.co'
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViYXFycnlyaW5teGFuYmlkeWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1OTA0ODgsImV4cCI6MjA1MzE2NjQ4OH0.R-TytYxW2uZIPa00FDU1Stt-IvxfuIQVSRW9wOn6hnI'

// Add URL configuration for auth redirects
export const getAuthRedirectUrl = () => {
  return Platform.select({
    web: 'http://localhost:19006/auth/callback',
    ios: 'fun.top://auth/callback',
    android: 'fun.top://auth/callback',
    default: 'fun.top://auth/callback',
  })
}

class SupabaseStorage {
  async getItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') {
        return null
      }
      const item = localStorage.getItem(key)
      console.log(`Retrieved item (web):`, item)
      return item
    }
    const item = await AsyncStorage.getItem(key)
    return item
  }

  async removeItem(key: string) {
    console.log(`SupabaseStorage.removeItem called for key: ${key}`)
    if (Platform.OS === 'web') {
      return localStorage.removeItem(key)
    }
    return AsyncStorage.removeItem(key)
  }

  async setItem(key: string, value: string) {
    console.log(`SupabaseStorage.setItem called for key: ${key}, value length: ${value?.length}`)
    if (Platform.OS === 'web') {
      return localStorage.setItem(key, value)
    }
    return AsyncStorage.setItem(key, value)
  }
}

// As Expo's SecureStore does not support values larger than 2048
// bytes, an AES-256 key is generated and stored in SecureStore, while
// it is used to encrypt/decrypt values stored in AsyncStorage.
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8))

    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1))
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value))

    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey))

    return aesjs.utils.hex.fromBytes(encryptedBytes)
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key)
    if (!encryptionKeyHex) {
      return encryptionKeyHex
    }

    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1))
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value))

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
  }

  async getItem(key: string) {
    const encrypted = await AsyncStorage.getItem(key)
    if (!encrypted) {
      return encrypted
    }

    return await this._decrypt(key, encrypted)
  }

  async removeItem(key: string) {
    await AsyncStorage.removeItem(key)
    await SecureStore.deleteItemAsync(key)
  }

  async setItem(key: string, value: string) {
    const encrypted = await this._encrypt(key, value)

    await AsyncStorage.setItem(key, encrypted)
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: new SupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
})

export async function storePrivyUserLocally(privyUser: any) {
  const mappedUser = {
    id: privyUser.id ?? 'unknown',
    email: privyUser.email ?? 'unknown@email',
    created_at: new Date().toISOString(),
    pfpUrl: privyUser.linked_accounts?.[0]?.profile_picture_url || null,
    username: privyUser.linked_accounts?.[0]?.username || null,
    name: privyUser.linked_accounts?.[0]?.name || null,
    isVerified: !!privyUser.linked_accounts?.[0]?.verified_at,
  }

  const expirationTime = 60 * 60 * 1000
  const dataToStore = {
    user: mappedUser,
    expiresAt: new Date().getTime() + expirationTime,
  }

  try {
    await AsyncStorage.setItem('@auth_data', JSON.stringify(dataToStore))
    return mappedUser
  } catch (error) {
    console.error('Error storing privy user:', error)
    throw error
  }
}
