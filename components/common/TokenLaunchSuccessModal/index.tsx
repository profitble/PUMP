import React from 'react'
import { View } from 'react-native'

import { Colors } from '@/constants'

import { CButton, CText, Icon, Spacer } from '@/components'

type TokenLaunchSuccessModalProps = {
  onLaunchAnother: () => void
}

export const TokenLaunchSuccessModal = ({ onLaunchAnother }: TokenLaunchSuccessModalProps) => {
  return (
    <View
      className="flex-1 bg-[#F5F4EE] rounded-3xl p-6"
      style={{
        zIndex: 1000,
        borderWidth: 5,
        borderColor: '#EBEAE4',
        width: '91%',
      }}
    >
      <View className="items-center mb-2">
        <Icon icon="coins" size={120} />
      </View>

      <View className="items-center">
        <CText
          weight="bold"
          className="text-lg text-center"
          style={{
            fontFamily: 'SfProRounded',
            color: Colors.titleLight,
          }}
        >
          Thank you for your
        </CText>
        <CText
          weight="bold"
          className="text-lg text-center"
          style={{
            fontFamily: 'SfProRounded',
            color: Colors.titleLight,
          }}
        >
          submission
        </CText>

        <Spacer size={24} />

        <View className="space-y-1">
          <CText
            className="text-center text-lg"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.titleLight,
            }}
          >
            If approved, your meme
          </CText>
          <CText
            className="text-center text-lg"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.titleLight,
            }}
          >
            will show under
          </CText>
          <CText
            className="text-center text-lg"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.titleLight,
            }}
          >
            presales
          </CText>
        </View>
      </View>

      <Spacer size={20} />

      <View className="mt-auto mb-6">
        <CButton title="Launch another" variant="blue" onPress={onLaunchAnother} />
      </View>
    </View>
  )
}
