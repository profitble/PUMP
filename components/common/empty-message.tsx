import React from 'react'
import { Text, View } from 'react-native'

type Props = {
  children: string
}

const EmptyMessage = ({ children }: Props) => {
  return (
    <View className="w-full p-4 mt-2 text-center bg-gray-100 rounded-lg">
      <Text className="text-center">{children}</Text>
    </View>
  )
}

export default EmptyMessage
