import * as React from 'react'
import { ComponentType } from 'react'
import { Image, ImageStyle, StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'

import { iconRegistry } from '@/constants'

export type IconTypes = keyof typeof iconRegistry

interface IconProps {
  icon: IconTypes
  color?: string
  size?: number
  style?: StyleProp<ImageStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPress?: TouchableOpacityProps['onPress']
  aspectRatio?: number
}

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
}

export const Icon: React.FC<IconProps> = (props) => {
  const {
    icon,
    color,
    size,
    aspectRatio,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = isPressable ? TouchableOpacity : View

  return (
    <Wrapper
      accessibilityRole={isPressable ? 'imagebutton' : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image
        style={[
          $imageStyle,
          color ? { tintColor: color } : {},
          size ? { width: 'auto', height: size } : { width: 'auto', height: 30 },
          $imageStyleOverride,
          {
            aspectRatio: aspectRatio ? aspectRatio : 1,
          },
        ]}
        source={iconRegistry[icon]}
        resizeMode="contain"
      />
    </Wrapper>
  )
}

Icon.displayName = 'Icon'
