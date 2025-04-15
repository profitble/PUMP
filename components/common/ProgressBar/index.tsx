import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '@/constants'
import { LinearGradient } from 'expo-linear-gradient'
import { RadialGradient, Rect, Stop } from 'react-native-svg'
import { Defs } from 'react-native-svg'
import Svg from 'react-native-svg'
import MaskedView from '@react-native-masked-view/masked-view'
type ProgressBarProps = {
  current: number
  total: number
  unit?: string
}

export const ProgressBar = ({ current, total, unit = 'SOL' }: ProgressBarProps) => {
  const progress = (current / total) * 100

  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 8,
          justifyContent: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: '#F26B3A',
              fontWeight: '600',
              marginRight: 4,
              fontFamily: 'SfProRounded',
            }}
          >
            !
          </Text>
          <Text
            style={{
              color: '#000',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'SfProRounded',
            }}
          >
            {current} &nbsp;
          </Text>
          <Text
            style={{
              color: '#999',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: 'SfProRounded',
            }}
          >
            /&nbsp;{total} {unit}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={{
              color: '#999',
              fontSize: 12,
              marginLeft: 4,
              fontWeight: 'bold',
              fontFamily: 'SfProRounded',
            }}
          >
            LEFT
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 24,
          backgroundColor: '#E6E6E6',
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <View
              style={{
                backgroundColor: 'black',
                width: `${progress}%`,
                height: '100%',
                borderRadius: 24,
              }}
            />
          }
        >
          <Svg height="100%" width="100%">
            <Defs>
              <RadialGradient
                id="grad"
                cx="70%"
                cy="70%"
                rx="70%"
                ry="70%"
                fx="70%"
                fy="70%"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="1" stopColor="#FF4D00" stopOpacity="1" />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
          </Svg>
        </MaskedView>
      </View>
    </View>
  )
}
