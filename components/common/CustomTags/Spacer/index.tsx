import React from 'react'
import { View } from 'react-native'

import { SpacerInputType } from '@/types'

export const Spacer = ({ horizontal, size }: SpacerInputType) => {
  const defaultValue = 'auto'

  return (
    <View
      style={{
        width: horizontal ? size : defaultValue,
        height: !horizontal ? size : defaultValue,
      }}
    />
  )
}
