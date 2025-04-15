import React from 'react'
import { SafeAreaView, StatusBar, StyleProp, ViewStyle } from 'react-native'

import { Colors } from '@/constants'

type ParentViewProps = {
  children: React.ReactNode
  containerStyle?: StyleProp<ViewStyle> | undefined
}

export const ParentView = ({ children, containerStyle }: ParentViewProps) => {
  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor: Colors.backgroundLight,
          },
          containerStyle,
        ]}
      >
        {children}
      </SafeAreaView>
    </>
  )
}
