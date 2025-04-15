import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { CText, ParentView } from '@/components'
import { useNavigation } from 'expo-router'

import PresaleBuyView from '@/components/(tokens)/CoinScreenView/PresaleBuy'
import { usePresaleToken } from '@/hooks/presale-tokens/use-presale-token'
import { customHaptics } from '@/utils'

export default function PresaleBuy() {
  const navigation = useNavigation()
  const params = useLocalSearchParams()
  const router = useRouter()
  const presaleId = typeof params.presalebuy === 'string' ? params.presalebuy : '1'

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      tabBarStyle: { display: 'none' },
    }) // ✅ Hide the header
  }, [navigation])

  const { data: token, refetch, isLoading, isRefetching } = usePresaleToken(presaleId)

  const onClose = useCallback(async () => {
    customHaptics.tap()
    router.back()
    await refetch()
  }, [router])

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

  return <PresaleBuyView token={token} onClose={onClose} />
}
