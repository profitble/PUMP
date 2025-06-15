import React from 'react'
import { Stack } from 'expo-router'
import { Toasts } from '@backpackapp-io/react-native-toast'

export default function HomeScreenLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="coin/[coin]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="presale/[presale]"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <Toasts extraInsets={{
        bottom:50
      }} />
    </>
  )
}
