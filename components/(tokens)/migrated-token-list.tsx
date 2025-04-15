import { router } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native'

import { CText } from '@/components'
import { useTokens } from '@/hooks/tokens/use-token'
import { TokenListItem } from './token-list-item'

export const MigratedTokenList = () => {
  const { data, isLoading, isError, error } = useTokens()

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
        <CText style={styles.message}>Loading tokens...</CText>
      </View>
    )
  }
  if (isError) return <CText style={styles.message}>Failed to load tokens {error.message}</CText>

  if (!data?.length) {
    return (
      <View style={styles.emptyContainer}>
        <CText style={styles.message}>No tokens found</CText>
        <Pressable
          onPress={() => router.push('/(auth)/(tabs)/add')}
          className="flex flex-col items-center justify-center px-8 bg-white rounded-2xl h-14"
        >
          <CText isExpanded weight="black" className="text-[18px] text-black" style={{ fontFamily: 'SfProRounded' }}>
            CREATE COIN
          </CText>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.mint_address}
        renderItem={({ item }) => <TokenListItem token={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    paddingTop: 32,
    alignItems: 'center',
  },
  message: {
    fontFamily: 'SfProRounded',
    padding: 16,
    textAlign: 'center',
    color: '#9d9d9d',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
