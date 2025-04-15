import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import { CText, ParentView } from '@/components'
import { usePresaleToken } from '@/hooks/presale-tokens/use-presale-token'
import { PresaleScreenView } from '@/components/(tokens)/CoinScreenView/Presale'

export default function Presale() {
  const params = useLocalSearchParams()
  const presaleId = typeof params.presale === 'string' ? params.presale : '1'

  const { data: token, refetch, isLoading, isRefetching } = usePresaleToken(presaleId)

  if (isLoading || isRefetching) {
    return (
      <ParentView>
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      </ParentView>
    )
  }

  if (!token) {
    return (
      <ParentView>
        <View className="items-center justify-center flex-1">
          <CText>Token not found</CText>
        </View>
      </ParentView>
    )
  }

  return (
    <ParentView>
      <PresaleScreenView token={token} onClose={() => router.back()} />
    </ParentView>
  )
}
