import { Pressable, Share, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

import { customHaptics } from '@/utils'

import { NEW_TOKEN_TOAST_HEIGHT, NEW_TOKEN_TOAST_WIDTH } from '@/constants'

import { CText } from '@/components'

type TokenCreatedToastProps = {
  tokenName: string
}

const newTokenToastPanelWidth = NEW_TOKEN_TOAST_WIDTH * 0.97
const newTokenToastPanelHeight = NEW_TOKEN_TOAST_HEIGHT * 0.88

export const TokenCreatedToast = ({ tokenName }: TokenCreatedToastProps) => {
  const combinedAnimationStyle = useAnimatedStyle(() => {
    const initialBounce = withSequence(withSpring(1.1), withDelay(100, withSpring(1)))

    const quickSprings = withSequence(
      withSpring(1.03, { duration: 100 }),
      withSpring(1, { duration: 100 }),
      withSpring(1.03, { duration: 100 }),
      withSpring(1, { duration: 100 })
    )

    const pause = withTiming(1, {
      duration: 1000,
      easing: Easing.linear,
    })

    const fullSequence = withSequence(
      initialBounce,
      withDelay(0, withRepeat(withSequence(quickSprings, pause), -1, false))
    )

    return {
      transform: [{ scale: fullSequence }],
    }
  })

  const handleShare = async () => {
    customHaptics.tap()
    try {
      await Share.share({
        message: `I just launched my new memecoin - ${tokenName}!`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Animated.View
      style={[
        {
          height: NEW_TOKEN_TOAST_HEIGHT,
          width: NEW_TOKEN_TOAST_WIDTH,
          backgroundColor: 'transparent',
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
        },
        combinedAnimationStyle,
      ]}
    >
      <View
        style={{
          height: newTokenToastPanelHeight,
          width: newTokenToastPanelWidth,
          borderRadius: 8,
        }}
        className="absolute right-0 bottom-0 bg-[#802801] z-10"
      />
      <LinearGradient
        colors={['#FE6301', '#FEDA04']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={{
          height: newTokenToastPanelHeight,
          width: newTokenToastPanelWidth,
          borderRadius: 8,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50,
        }}
      />
      <View
        style={{
          height: newTokenToastPanelHeight,
          width: newTokenToastPanelWidth,
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: 12,
          paddingHorizontal: 16,
          zIndex: 100,
        }}
        className="space-x-1"
      >
        <View className="flex-1 flex-col justify-start items-start space">
          <CText
            isExpanded
            weight="bold"
            style={{
              fontSize: 22,
              fontFamily: 'SfProRoundedHeavy',
            }}
            className=" text-white"
          >
            {tokenName}
          </CText>
          <CText
            isExpanded
            weight="bold"
            style={{
              fontSize: 16,
              lineHeight: 18,
              fontFamily: 'SfProRounded',
            }}
            className=" text-black"
          >
            is LIVE
          </CText>
        </View>
        <View className="flex flex-shrink-0 flex-col justify-center items-center">
          <Pressable
            onPress={handleShare}
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.4,
              shadowRadius: 4,
              zIndex: 100,
            }}
            className="h-8 px-2 flex flex-col justify-center items-center rounded bg-white"
          >
            <CText
              isExpanded
              weight="bold"
              className="text-black text-base"
              style={{
                fontFamily: 'SfProRounded',
              }}
            >
              SHARE
            </CText>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  )
}
