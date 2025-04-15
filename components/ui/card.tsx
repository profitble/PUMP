import React from 'react'
import { View, Text, ViewProps } from 'react-native'

interface CardProps extends ViewProps {
  title?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ title, children, className, ...props }) => {
  return (
    <View className={`bg-white p-4 rounded-2xl shadow-md ${className}`} {...props}>
      {title && <Text className="mb-2 text-lg font-semibold">{title}</Text>}
      {children}
    </View>
  )
}
