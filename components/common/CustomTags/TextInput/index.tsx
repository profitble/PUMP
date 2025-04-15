import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

import { FontWeight, FontStyle } from '@/types'
import { Colors } from '@/constants'

interface CTextInputProps extends TextInputProps {
  weight?: FontWeight
  italic?: boolean
  inputRef?: React.Ref<TextInput>
}

const fontMap: Record<FontWeight, Record<FontStyle, string>> = {
  extralight: {
    normal: 'SatoshiExtraLight',
    italic: 'SatoshiExtraLightItalic',
  },
  light: {
    normal: 'SatoshiLight',
    italic: 'SatoshiLightItalic',
  },
  regular: {
    normal: 'SatoshiRegular',
    italic: 'SatoshiItalic',
  },
  medium: {
    normal: 'SatoshiMedium',
    italic: 'SatoshiMediumItalic',
  },
  semibold: {
    normal: 'SatoshiSemiBold',
    italic: 'SatoshiSemiBoldItalic',
  },
  bold: {
    normal: 'SatoshiBold',
    italic: 'SatoshiBoldItalic',
  },
  black: {
    normal: 'SatoshiBlack',
    italic: 'SatoshiBlackItalic',
  },
  extrabold: {
    normal: 'SatoshiExtraBold',
    italic: 'SatoshiExtraBoldItalic',
  },
}

export const CTextInput: React.FC<CTextInputProps> = ({ weight = 'medium', style, inputRef, ...props }) => {
  return (
    <TextInput
      ref={inputRef}
      style={[style]}
      placeholderTextColor={Colors.inputPlaceholderInnerLight}
      {...props}
      className="bg-input-bg color-placeholder font-sf-bold"
    />
  )
}

// borderRadius: 15.5,
//                     color: Colors.inputPlaceholderLight,
//                     backgroundColor: Colors.inputInnerLight,
//                     fontFamily: 'SfProRounded',
//                     fontSize: 14,
//                     fontWeight: '700',
//                     lineHeight: 14,
//                     letterSpacing: 0.437,
//                     paddingTop: 15,
//                     paddingBottom: 10,
//                     paddingLeft: 15,
//                     height: 45.77,
//                     textAlignVertical: 'center',
//                     width: '100%',
