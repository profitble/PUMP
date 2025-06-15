import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { supabase } from '@/utils'

import { TableNames } from '@/types'

import { ParentView } from '@/components'
import { Tables } from '@/types/database.types'
import { CoinScreen } from '@/components/(tokens)/CoinScreenView/CoinScreen'

export default function Coin() {
  const { coin } = useLocalSearchParams<{ coin: string }>()
  const [token, setToken] = useState<Tables<'presale_tokens'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.from(TableNames.PRESALE_TOKENS).select('*').eq('id', coin).single()

        if (error) throw error
        setToken(data)
      } catch (err) {
        console.error('Error fetching token:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [coin])

  return (
    <ParentView>
      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      ) : token ? (
        <CoinScreen token={token} />
      ) : null}
    </ParentView>
  )
}
