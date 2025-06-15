import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useAuth } from '@/hooks'

import { PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { CText, ParentView, Spacer } from '@/components'
import { FunButton } from '@/components/ui/fun-button'
import { useBoolVariation } from '@launchdarkly/react-native-client-sdk'
import { customHaptics } from '@/utils'

export default function PrivySocialAuth() {
  const router = useRouter()

  const { login, isLoading } = useAuth()

  const showTwitterAuth = useBoolVariation('show-x-auth', true)
  const showEmailAuth = useBoolVariation('show-email-auth', true)
  const showAppleAuth = useBoolVariation('show-apple-auth', true)

  const handleEmailAuth = async () => {
    customHaptics.tap()
    console.log('AUTHENTICATING EMAIL USER')
    router.replace('/signup')
  }

  return (
    <ParentView
      containerStyle={{
        paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        backgroundColor: '#0174E7',
      }}
    >
      <View className="relative flex flex-col items-stretch justify-center flex-1 w-full ">
        <View className="flex-row items-end justify-center flex-1 ">
          <CText
            isExpanded
            weight="bold"
            className="text-xl text-center text-white"
            style={{
              fontFamily: 'SfProRounded',
            }}
          >
            {`Verify your account with\nyour socials`}
          </CText>
        </View>
        {isLoading ? (
          <View className="flex-1">
            <Spacer size={20} />
            <ActivityIndicator size="small" color="#ffffff" />
            <Spacer size={12} />
            <CText weight="regular" className="text-sm text-center text-white">
              Logging in...
            </CText>
          </View>
        ) : (
          <View className="flex items-center flex-1 w-full px-4 ">
            <View className="flex flex-col justify-end flex-1 w-full max-w-xs">
              {showTwitterAuth && (
                <>
                  <FunButton variant="orange" onPress={() => {
                    customHaptics.softTap()
                    login({ provider: 'twitter' })
                    }}>
                    Continue with X
                  </FunButton>
                  <Spacer size={12} />
                </>
              )}

              {showEmailAuth && (
                <>
                  <FunButton variant="outline" onPress={handleEmailAuth}>
                    Continue with Email
                  </FunButton>
                  <Spacer size={12} />
                </>
              )}

              {showAppleAuth && (
                <>
                  <FunButton variant="dark" onPress={() =>{
                     customHaptics.tap()
                     login({ provider: 'apple' })
                     }}>
                    Continue with Apple
                  </FunButton>
                  <Spacer size={12} />
                </>
              )}
            </View>
          </View>
        )}
      </View>
    </ParentView>
  )
}
