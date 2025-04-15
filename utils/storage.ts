import AsyncStorage from '@react-native-async-storage/async-storage'

export interface UserData {
  id: string
  email: string
  username?: string
  profileImage?: string
  name?: string
  created_at: string
}

const AUTH_KEY = '@auth_data'

export async function storeAuthData(userData: UserData) {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData))
  } catch (error) {
    console.error('Error storing auth data:', error)
  }
}

export async function getStoredAuthData(): Promise<UserData | null> {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting auth data:', error)
    return null
  }
}

export async function removeAuthData() {
  try {
    await AsyncStorage.removeItem(AUTH_KEY)
  } catch (error) {
    console.error('Error removing auth data:', error)
  }
}
