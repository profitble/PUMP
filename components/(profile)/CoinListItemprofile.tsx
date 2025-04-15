import React from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'
import { CText, Icon } from '@/components/common'
import { FontAwesome6 } from '@expo/vector-icons'

const CoinListItemProfile = ({
  label,
  link_des,
  description,
  value,
  percentage,
  onPress,
  image,
}: {
  label: string
  link_des: string
  description: string
  value: string
  percentage: string
  onPress: () => void
  image: string
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>{image && <Image source={{ uri: image }} style={styles.icon} />}</View>

      {/* Coin Details */}
      <View style={styles.detailsContainer}>
        <CText style={styles.coinName}>{label}</CText>
        <View style={styles.coinInfo}>
          <Icon size={16} icon="link_icon" />
          <CText style={styles.coinSymbol}>{link_des}</CText>
          <CText style={styles.description}>{description}</CText>
        </View>
      </View>

      {/* Coin Price */}
      <View style={styles.priceContainer}>
        <CText style={styles.priceText}>${value}</CText>
        {/* select "caret-down" */}
        <FontAwesome6 name={'caret-up'} color={'#979797'} size={20} />
        <CText style={styles.percentage}> {percentage}%</CText>
      </View>
    </Pressable>
  )
}

export default CoinListItemProfile

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  coinImage: {
    width: 48,
    height: 48,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  coinName: {
    fontFamily: 'SfProRoundedBold',
    fontSize: 16,
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinSymbol: {
    fontFamily: 'SfProRoundedBold',
    color: '#0174E7',
    fontSize: 14,
  },
  description: {
    fontFamily: 'SfProRoundedMedium',
    color: '#979797',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceText: {
    fontFamily: 'SfProRoundedHeavy',
    color: '#010101',
    fontSize: 16,
  },
  percentage: {
    fontFamily: 'SfProRoundedMedium',
    color: '#979797',
    fontSize: 14,
  },

  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'SfProRounded',
    borderRadius: 16,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    fontFamily: 'SfProRounded',
  },
})
