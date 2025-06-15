import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/constants'

import { CText, Icon, Spacer } from '@/components'
import CoinListItemprofile from './CoinListItemprofile'
import { UserHolding, useUserHoldings } from '@/hooks/user/use-user-holdings'
import EmptyMessage from '../common/empty-message'

const Holdings = () => {
  const { data: holdings, isLoading, error } = useUserHoldings()

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (error) {
    return <Text>Error loading holdings</Text>
  }

  if (!holdings?.length) {
    return <EmptyMessage>You don't have any holdings yet</EmptyMessage>
  }
  const renderItem = ({ item }: { item: UserHolding; index: number }) => {
    return (
      <CoinListItemprofile
        // adjust image_path in component as uri
        image={item?.imageUrl!}
        label={item?.tokenName}
        link_des={`$${item?.tokenSymbol}`}
        description={item?.tokenSymbol}
        value={item?.totalInvested.toFixed(2)}
        percentage={item?.percentageOfTotal.toFixed(2)}
        onPress={() => {
          console.log('pressed')
          // // will work after PR merge of coin Details
          // router.push("/(auth)/[coindDetails]")
        }}
      />
    )
  }

  return (
    <View style={{ height: 200 }}>
      <FlatList
        data={holdings}
        renderItem={renderItem}
        keyExtractor={(item) => item.presaleTokenId}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <>
            <Spacer size={24} />
            <Icon icon="depositPlaceholder" size={36} color="#8E8E8F" />
            <Spacer size={16} />ƒ
            <CText weight="medium" className="text-center opacity-50" style={styles.text}>
              Make your first deposit
            </CText>
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    color: Colors.titleLight,
    fontFamily: 'SfProRounded',
    textAlign: 'center',
    fontStyle: 'normal',
    fontWeight: '700',
  },
})

export default Holdings
