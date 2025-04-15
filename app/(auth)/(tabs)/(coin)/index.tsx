import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

import { Colors } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

import { customHaptics } from '@/utils'

import { useFriendsTokenPurchaseToast } from '@/hooks'

import { PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { CText, ParentView, Spacer } from '@/components'

import { useTokens } from '@/hooks/tokens/use-token'
import { FilterCarousel } from '@/components/(home)/filter-carousel'
import { TopOfTheHillCard } from '@/components/(home)/top-of-the-hill-card'
import { MigratedTokenList } from '@/components/(tokens)/migrated-token-list'
import { PresaleTokenList } from '@/components/(tokens)/presale-token-list'

export default function HomeScreenView() {
  useFriendsTokenPurchaseToast()

  const [activeTab, setActiveTab] = useState('1')

  const [refreshing, setRefreshing] = useState(false)

  const { data: tokens = [], refetch: refetchTokens, isLoading, isError } = useTokens()

  const topOfTheHillToken = tokens[0]

  const onRefresh = React.useCallback(() => {
    customHaptics.softTap()
    setRefreshing(true)
    refetchTokens().finally(() => setRefreshing(false))
  }, [refetchTokens])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
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

  return (
    <ParentView>
      <View
        style={{
          paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        }}
      >
        <View className="flex flex-row items-center justify-between w-full pt-2">
          <CText
            isExpanded
            weight="light"
            style={{
              color: Colors.titleLight,
              fontSize: 24,
              fontFamily: 'SfProRoundedBold',
            }}
          >
            Explore
          </CText>
          {/* <View className="flex flex-row items-center gap-2">
            <Pressable onPress={() => {}}>
              <Icon icon="searchCircle" size={20} />
            </Pressable>
            <Pressable onPress={() => {}}>
              <Icon icon="userCircle" size={24} />
            </Pressable>
          </View> */}
        </View>
      </View>

      {topOfTheHillToken ? (
        <View>
          <View className="w-full px-3">
            <TopOfTheHillCard token={topOfTheHillToken} />
          </View>
          <View
            style={{
              height: 1,
              width: '90%',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#F0F0F0',
              marginTop: 16,
              marginBottom: 16,
            }}
          />
        </View>
      ) : (
        <Spacer size={24} />
      )}

      <FilterCarousel activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === '1' ? <PresaleTokenList /> : <MigratedTokenList />}
    </ParentView>
  )
}

export const styles = StyleSheet.create({
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
    color: '#9d9d9d',
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontFamily: 'SfProRounded',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    backgroundColor: Colors.orangeLight,
    fontFamily: 'SfProRounded',
    borderRadius: 16,
    padding: 16,
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#d9d9d9',
    fontFamily: 'SfProRounded',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 21,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    fontFamily: 'SfProRounded',
  },
  infoOuterRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontFamily: 'SfProRounded',
    alignItems: 'center',
    gap: 8,
  },
  infoInnerColumnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'SfProRounded',
    alignItems: 'flex-start',
    gap: 4,
  },
  username: {
    textAlign: 'center',
    color: '#70737d',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SfProRounded',
    lineHeight: 12,
  },
  nameText: {
    color: Colors.backgroundLight,
    fontSize: 14,
    fontFamily: 'SfProRounded',
    lineHeight: 15,
  },
  priceChangeContainer: {
    position: 'absolute',
    right: 0,
    top: 2,
  },
  priceChangeText: {
    color: Colors.valueUp,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
    lineHeight: 10,
  },
  socialsAndDescriptionContainer: {
    flex: 1,
    flexGrow: 1,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 7,
  },
  descriptionText: {
    color: '#EBEAE4',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
  },
  metricsContainer: {
    flexShrink: 0,
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  marketCapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  marketCapText: {
    color: Colors.lime,
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'SfProRounded',
  },
  marketCapAmountText: {
    color: Colors.backgroundLight,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
    paddingVertical: 4,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
  },
  marketCapPercentageText: {
    display: 'flex',
    flexDirection: 'row',
    color: Colors.valueUp,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
  },
})
