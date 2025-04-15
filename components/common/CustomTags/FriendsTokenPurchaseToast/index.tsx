import { View } from 'react-native'
import 'react-native-reanimated'
import Animated, { Easing, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated'
import { Toast } from '@backpackapp-io/react-native-toast'

import { CText } from '@/components'

type FriendsTokenPurchaseToastProps = {
  toast: Toast
  backgroundColor: string
  imageColor: string
  textDetailsColor: string
  textColor: string
}

export const FriendsTokenPurchaseToast = ({
  toast,
  backgroundColor,
  imageColor,
  textDetailsColor,
  textColor,
}: FriendsTokenPurchaseToastProps) => {
  const message = toast.message as unknown as string
  const [buyerName, amount, tokenName] = message.split(',')

  const wiggleStyle = useAnimatedStyle(() => {
    const fastWiggle = withSequence(
      withTiming(10, { duration: 30, easing: Easing.linear }),
      withTiming(-10, { duration: 30, easing: Easing.linear }),
      withTiming(10, { duration: 30, easing: Easing.linear }),
      withTiming(0, { duration: 30, easing: Easing.linear })
    )

    const fullSequence = withSequence(withRepeat(fastWiggle, 7, false))

    return {
      transform: [{ translateX: fullSequence }],
    }
  })

  return (
    <Animated.View
      style={[
        {
          height: toast.height,
          width: toast.width,
          backgroundColor: backgroundColor,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingVertical: 8,
          paddingHorizontal: 14,
        },
        wiggleStyle,
      ]}
    >
      <View
        style={{
          backgroundColor: imageColor,
          width: 26,
          height: 26,
          borderRadius: 13,
          marginRight: 8,
          flexShrink: 0,
        }}
      />
      <View className="flex-1 flex-row justify-start items-center flex-wrap gap-1 pt-0.5">
        <CText
          isExpanded
          weight="bold"
          style={{
            color: textDetailsColor,
            lineHeight: 16,
            fontFamily: 'SfProRoundedHeavy',
          }}
          className="text-sm"
          numberOfLines={2}
        >
          {buyerName}
        </CText>
        <CText
          isExpanded
          weight="bold"
          style={{
            color: textColor,
            lineHeight: 16,
            marginHorizontal: 4,
            fontFamily: 'SfProRounded',
          }}
          className="text-sm"
          numberOfLines={2}
        >
          bought
        </CText>
        <CText
          isExpanded
          weight="bold"
          style={{
            color: textDetailsColor,
            lineHeight: 16,
            fontFamily: 'SfProRoundedHeavy',
          }}
          className="text-sm"
          numberOfLines={2}
        >
          {amount} SOL
        </CText>
        <CText
          isExpanded
          weight="bold"
          style={{
            color: textColor,
            lineHeight: 16,
            marginHorizontal: 4,
            fontFamily: 'SfProRounded',
          }}
          className="text-sm"
          numberOfLines={2}
        >
          of
        </CText>
        <CText
          isExpanded
          weight="bold"
          style={{
            color: textDetailsColor,
            lineHeight: 16,
            fontFamily: 'SfProRoundedHeavy',
          }}
          className="text-sm"
          numberOfLines={2}
        >
          {tokenName}
        </CText>
      </View>
    </Animated.View>
  )
}
