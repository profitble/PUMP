import { Text, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { NEW_TOKEN_TOAST_HEIGHT, NEW_TOKEN_TOAST_WIDTH } from '@/constants'

import { CText } from '@/components'

type TokenPurchaseToastProps = {
  tokenName: string
  amount?: string
}

export const TokenPurchaseToast = ({ tokenName, amount = "0.2" }: TokenPurchaseToastProps) => {
  const colorToggle = useSharedValue(0)

  const combinedStyle = useAnimatedStyle(() => {
    const singleWiggleWithColor = withSequence(
      withTiming(2, { duration: 50, easing: Easing.linear }),
      withTiming(-2, { duration: 50, easing: Easing.linear }),
      withTiming(2, { duration: 50, easing: Easing.linear }),
      withTiming(0, { duration: 50, easing: Easing.linear }, () => {
        colorToggle.value = colorToggle.value === 0 ? 1 : 0
      })
    )

    const wiggleWithDelay = withSequence(singleWiggleWithColor, withTiming(0, { duration: 1800 }))

    return {
      transform: [{ translateX: withRepeat(wiggleWithDelay, -1, false) }],
      backgroundColor: colorToggle.value === 0 ? '#FEDA04' : '#FE6301',
    }
  })

  return (
    <Animated.View
      style={[
        {
          height: NEW_TOKEN_TOAST_HEIGHT,
          width: NEW_TOKEN_TOAST_WIDTH,
          backgroundColor: 'transparent',
          paddingHorizontal: 16,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        },
        combinedStyle,
      ]}
    >
      <View className="flex-1 flex-col justify-start items-start space-y-1">
        <CText
          isExpanded
          weight="extrabold"
          style={{
            fontSize: 22,
          }}
          className=" text-black"
        >
          YOU JUST BOUGHT
        </CText>
        <CText
          isExpanded
          weight="bold"
          numberOfLines={1}
          style={{
            fontSize: 16,
            lineHeight: 18,
          }}
          className="text-white"
        >
          {amount} SOL of {tokenName}
        </CText>
      </View>
      <View className="flex flex-shrink-0 flex-col justify-center items-center">
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            zIndex: 100,
          }}
          className="flex flex-col justify-center items-center"
        >
          <Text
            style={{
              fontSize: 48,
              lineHeight: 56,
            }}
          >
            💊
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}
