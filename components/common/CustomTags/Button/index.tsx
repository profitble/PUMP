import React, { ReactNode, useMemo } from 'react'
import {
  ActivityIndicator,
  ButtonProps,
  Dimensions,
  ImageBackground,
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

const { height } = Dimensions.get('window')

interface CButtonProps extends ButtonProps, ViewProps {
  style?: ViewStyle
  isBusy?: boolean
  round?: boolean
  variant?: 'normal' | 'orange' | 'light-orange' | 'short-orange' | 'blue'
  children?: ReactNode
}

export const CButton: React.FC<CButtonProps> = ({
  title,
  style,
  variant = 'normal',
  round,
  isBusy,
  disabled,
  onPress,
  children,
  ...props
}) => {
  const bgImage = useMemo(() => {
    switch (variant) {
      case 'blue':
      // return Images.blueBtnBg
      case 'orange':
      // return Images.orangeBtnBg
      case 'light-orange':
      // return Images.lightOrangeBtnBg
      case 'short-orange':
      // return Images.shortOrangeBtnBg
      default:
      // return round ? Images.orangeRoundBtnBg : null
    }
  }, [round, variant])

  let el = (
    <View style={[styles.textWrapper]}>
      <Text style={styles.buttonText}>{title}</Text>
    </View>
  )

  if (variant !== 'normal' && bgImage) {
    el = (
      <ImageBackground style={styles.imageBackground} resizeMode="stretch" source={bgImage}>
        {el}
      </ImageBackground>
    )
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isBusy}
      style={[styles.button, round && styles.rounded, (disabled || isBusy) && styles.disabled, style]}
      {...props}
    >
      {children || el}
      {isBusy && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#FFF" />
        </View>
      )}
    </Pressable>
  )
}

const scaleFont = (size: number) => PixelRatio.getFontScale() * size

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.07, // Responsive height (~7% of screen height)
    // paddingVertical: height * 0.015, // Responsive padding
    // paddingHorizontal: width * 0.05, // Responsive padding
    position: 'relative',
    overflow: 'hidden',
  },
  rounded: {
    borderRadius: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height * 0.07,
  },
  buttonText: {
    fontSize: scaleFont(16), // Scales based on system font size
    color: '#FFF',
    fontFamily: 'SfProRoundedHeavy',
    lineHeight: scaleFont(23),
  },
  transparentText: {
    color: 'transparent',
  },
  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
