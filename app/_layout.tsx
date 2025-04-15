import React, { useEffect, useState } from 'react'
import { Linking } from 'react-native'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Slot, Stack } from 'expo-router'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PrivyProvider } from '@privy-io/expo'
import { PrivyElements } from '@privy-io/expo'
import 'fast-text-encoding'
import 'react-native-get-random-values'
import '@ethersproject/shims'
import 'expo-router/entry'
import { AutoEnvAttributes, LDProvider, ReactNativeLDClient } from '@launchdarkly/react-native-client-sdk'

import { supabase } from '@/utils'

import { AuthProvider } from '@/context'

import { LiveTokensProvider } from '@/components/common/LiveTokensContext'

// SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient())
  const [initialUrl, setInitialUrl] = useState<string | null>(null)
  const [loaded, error] = useFonts({
    MonaSansBlack: require('@/assets/fonts/MonaSans-Black.ttf'),
    MonaSansBlackItalic: require('@/assets/fonts/MonaSans-BlackItalic.ttf'),
    MonaSansExtraBold: require('@/assets/fonts/MonaSans-ExtraBold.ttf'),
    MonaSansExtraBoldItalic: require('@/assets/fonts/MonaSans-ExtraBoldItalic.ttf'),
    MonaSansBold: require('@/assets/fonts/MonaSans-Bold.ttf'),
    MonaSansBoldItalic: require('@/assets/fonts/MonaSans-BoldItalic.ttf'),
    MonaSansSemiBold: require('@/assets/fonts/MonaSans-SemiBold.ttf'),
    MonaSansSemiBoldItalic: require('@/assets/fonts/MonaSans-SemiBoldItalic.ttf'),
    MonaSansMedium: require('@/assets/fonts/MonaSans-Medium.ttf'),
    MonaSansMediumItalic: require('@/assets/fonts/MonaSans-MediumItalic.ttf'),
    MonaSansRegular: require('@/assets/fonts/MonaSans-Regular.ttf'),
    MonaSansItalic: require('@/assets/fonts/MonaSans-Italic.ttf'),
    MonaSansLight: require('@/assets/fonts/MonaSans-Light.ttf'),
    MonaSansLightItalic: require('@/assets/fonts/MonaSans-LightItalic.ttf'),
    MonaSansExtraLight: require('@/assets/fonts/MonaSans-ExtraLight.ttf'),
    MonaSansExtraLightItalic: require('@/assets/fonts/MonaSans-ExtraLightItalic.ttf'),
    // MonaSans Expanded
    MonaSansExpandedBlack: require('@/assets/fonts/MonaSans_Expanded-Black.ttf'),
    MonaSansExpandedBlackItalic: require('@/assets/fonts/MonaSans_Expanded-BlackItalic.ttf'),
    MonaSansExpandedExtraBold: require('@/assets/fonts/MonaSans_Expanded-ExtraBold.ttf'),
    MonaSansExpandedExtraBoldItalic: require('@/assets/fonts/MonaSans_Expanded-ExtraBoldItalic.ttf'),
    MonaSansExpandedBold: require('@/assets/fonts/MonaSans_Expanded-Bold.ttf'),
    MonaSansExpandedBoldItalic: require('@/assets/fonts/MonaSans_Expanded-BoldItalic.ttf'),
    MonaSansExpandedSemiBold: require('@/assets/fonts/MonaSans_Expanded-SemiBold.ttf'),
    MonaSansExpandedSemiBoldItalic: require('@/assets/fonts/MonaSans_Expanded-SemiBoldItalic.ttf'),
    MonaSansExpandedMedium: require('@/assets/fonts/MonaSans_Expanded-Medium.ttf'),
    MonaSansExpandedMediumItalic: require('@/assets/fonts/MonaSans_Expanded-MediumItalic.ttf'),
    MonaSansExpandedRegular: require('@/assets/fonts/MonaSans_Expanded-Regular.ttf'),
    MonaSansExpandedItalic: require('@/assets/fonts/MonaSans_Expanded-Italic.ttf'),
    MonaSansExpandedLight: require('@/assets/fonts/MonaSans_Expanded-Light.ttf'),
    MonaSansExpandedLightItalic: require('@/assets/fonts/MonaSans_Expanded-LightItalic.ttf'),
    MonaSansExpandedExtraLight: require('@/assets/fonts/MonaSans_Expanded-ExtraLight.ttf'),
    MonaSansExpandedExtraLightItalic: require('@/assets/fonts/MonaSans_Expanded-ExtraLightItalic.ttf'),

    // poppins fonts

    SfProRounded: require('@/assets/fonts/SF-Pro-Rounded-Black.ttf'),
    SfProRoundedBold: require('@/assets/fonts/SF-Pro-Rounded-Bold.otf'),
    SfProRoundedHeavy: require('@/assets/fonts/SF-Pro-Rounded-Heavy.otf'),
    SfProRoundedLight: require('@/assets/fonts/SF-Pro-Rounded-Light.otf'),
    SfProRoundedMedium: require('@/assets/fonts/SF-Pro-Rounded-Medium.otf'),
    SfProRoundedRegular: require('@/assets/fonts/SF-Pro-Rounded-Regular.otf'),
    SfProRoundedSemibold: require('@/assets/fonts/SF-Pro-Rounded-Semibold.otf'),
    SfProRoundedThin: require('@/assets/fonts/SF-Pro-Rounded-Thin.otf'),
    SfProRoundedUltraLight: require('@/assets/fonts/SF-Pro-Rounded-Ultralight.otf'),
  })

  if (error) {
    console.error('Error loading fonts: ', error)
    SplashScreen.hideAsync()
  }

  const featureClient = new ReactNativeLDClient('mob-9a258250-ccf2-48cf-869b-430ddf6ca3ba', AutoEnvAttributes.Enabled, {
    debug: false,
    applicationInfo: {
      id: 'ld-rn-test-app',
      version: '0.0.1',
    },
  })

  useEffect(() => {
    // Handle initial deep link
    Linking.getInitialURL().then((url) => {
      if (url) setInitialUrl(url)
    })

    // Handle deep links when app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const { params, errorCode } = QueryParams.getQueryParams(url)
      if (errorCode) return

      // Handle auth callback
      if (url.includes('auth/callback')) {
        const { access_token, refresh_token } = params
        if (access_token) {
          supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token,
          })
        }
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  // Handle initial URL auth params
  useEffect(() => {
    if (initialUrl) {
      const { params, errorCode } = QueryParams.getQueryParams(initialUrl)
      if (errorCode) return

      if (initialUrl.includes('auth/callback')) {
        const { access_token, refresh_token } = params
        if (access_token) {
          supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token,
          })
        }
      }
    }
  }, [initialUrl])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    console.log('Fonts not loaded yet')
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LDProvider client={featureClient}>
        <PrivyProvider
          appId="cm6d5lqoy00yuq2ecp060gnlb"
          clientId="client-WY5gEe9vZTPsbFtyTJYapWLKS8FVGBwz9uDHugwJaVp4N"
        >
          <PrivyElements />
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <LiveTokensProvider>
                {/* <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                  }}
                > */}
                <Slot />
                {/* </Stack> */}
              </LiveTokensProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </PrivyProvider>
      </LDProvider>
    </QueryClientProvider>
  )
}
