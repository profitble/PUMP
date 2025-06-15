import React from 'react'
import { Text, TextProps } from 'react-native'

import { FontWeight, FontStyle } from '@/types'

interface CTextProps extends TextProps {
  weight?: FontWeight
  italic?: boolean
  isExpanded?: boolean
}

const createFontMap = (isExpanded: boolean): Record<FontWeight, Record<FontStyle, string>> => {
  const prefix = isExpanded ? 'MonaSansExpanded' : 'MonaSans'

  return {
    extralight: {
      normal: `${prefix}ExtraLight`,
      italic: `${prefix}ExtraLightItalic`,
    },
    light: {
      normal: `${prefix}Light`,
      italic: `${prefix}LightItalic`,
    },
    regular: {
      normal: `${prefix}Regular`,
      italic: `${prefix}Italic`,
    },
    medium: {
      normal: `${prefix}Medium`,
      italic: `${prefix}MediumItalic`,
    },
    semibold: {
      normal: `${prefix}SemiBold`,
      italic: `${prefix}SemiBoldItalic`,
    },
    bold: {
      normal: `${prefix}Bold`,
      italic: `${prefix}BoldItalic`,
    },
    extrabold: {
      normal: `${prefix}ExtraBold`,
      italic: `${prefix}ExtraBoldItalic`,
    },
    black: {
      normal: `${prefix}Black`,
      italic: `${prefix}BlackItalic`,
    },
  }
}

export const CText: React.FC<CTextProps> = ({
  weight = 'medium',
  italic = false,
  isExpanded = false,
  style,
  className,
  children,
  ...props
}) => {
  const fontStyle = italic ? 'italic' : 'normal'
  const fontMap = createFontMap(isExpanded)

  return (
    <Text style={[{ fontFamily: fontMap[weight][fontStyle] }, style]} {...props} className={className}>
      {children}
    </Text>
  )
}
