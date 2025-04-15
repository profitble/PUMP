import React from 'react'
import { View } from 'react-native'

import { Colors } from '@/constants'

import { CButton, CText, Icon, Spacer } from '@/components'

type TokenInfoModalProps = {
  onLaunchAnother: () => void
}

export const TokenInfoModal = ({ onLaunchAnother }: TokenInfoModalProps) => {
  return (
    <View
      className="flex-1 p-6 rounded-3xl"
      style={{
        zIndex: 1000,
        // borderWidth: 5,
        // borderColor: "#EBEAE4",

        backgroundColor: Colors.cardBackgroundBlue,
      }}
    >
      <View className="items-center mt-8 mb-2">
        <Icon icon="coins" size={120} />
      </View>

      <View className="items-center space-y-6">
        <CText
          weight="bold"
          className="px-12 text-lg text-center"
          style={{
            fontFamily: 'SfProRounded',
            color: Colors.backgroundLight,
          }}
        >
          Thank you for your submission.
        </CText>

        <View>
          <CText
            className="text-lg text-center"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.backgroundLight,
            }}
          >
            If approved, your meme
          </CText>
          <CText
            className="text-lg text-center"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.backgroundLight,
            }}
          >
            will show under
          </CText>
          <CText
            className="text-lg text-center"
            style={{
              fontFamily: 'SfProRounded',
              color: Colors.backgroundLight,
            }}
          >
            presales
          </CText>
        </View>
      </View>

      <Spacer size={20} />

      <View className="mt-auto mb-6">
        <CButton title="Launch another" round variant="orange" onPress={onLaunchAnother} />
      </View>
    </View>
  )
}
