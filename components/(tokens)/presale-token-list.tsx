import React, { useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native'
// import LinearGradient from 'react-native-linear-gradient'

import { customHaptics } from '@/utils'

import { CText, PresaleListItem } from '@/components'

import { useGetPresales } from '@/hooks/use-get-presales'
import { StyleSheet } from 'react-native'

export const PresaleTokenList = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { data: tokens = [], refetch: refetchTokens, isLoading, isError } = useGetPresales()

  const onRefresh = React.useCallback(() => {
    customHaptics.softTap()
    setRefreshing(true)
    refetchTokens().finally(() => setRefreshing(false))
  }, [refetchTokens])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
        <CText style={styles.message}>Loading tokens...</CText>
      </View>
    )
  }

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <CText style={styles.message}>Failed to load tokens</CText>
      </View>
    )
  }

  if (!tokens.length) {
    return (
      <View style={styles.loadingContainer}>
        <CText style={styles.message}>No tokens found</CText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tokens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PresaleListItem token={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" titleColor="#FFFFFF" />
        }
      />
      {/* <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        style={styles.fadeOut}
        pointerEvents="none"
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    paddingTop: 32,
    alignItems: 'center',
  },
  message: {
    padding: 16,
    textAlign: 'center',
    color: '#000',
  },
  tokenItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tokenImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenSymbol: {
    color: '#666',
  },
  tokenMetrics: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  fadeOut: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60, // Adjust the height of the fade effect
    zIndex: 1,
  },
})
