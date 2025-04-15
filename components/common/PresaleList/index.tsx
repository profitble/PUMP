import { router } from 'expo-router'
import React, { useMemo } from 'react'
import { Image, Linking, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { customHaptics } from '@/utils'

import { Colors } from '@/constants'

import { Icon } from '@/components'

import { Database, Tables } from '@/types/database.types'
import { styles } from './styles'

type Props = {
  token: Tables<'presale_tokens'>
}

type SocialLink = {
  type: string
  url: string
}

const formatMarketCap = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}b`
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}m`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}k`
  if (!value) return '0'
  return value.toString()
}

export const PresaleListItem = ({ token }: Props) => {
  const handleSocialPress = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error('Error opening URL:', error)
    }
  }

  const parseSocialLinks = (): SocialLink[] => {
    // try {
    //   if (typeof token.socials === "string") {
    //     return JSON.parse(token.socials);
    //   }
    //   return Array.isArray(token.socials) ? token.socials : [];
    // } catch (error) {
    //   console.error("Error parsing social links:", error);
    //   return [];
    // }
    return []
  }

  const socialLinks = parseSocialLinks()
  const twitterLink = socialLinks?.find((s) => s?.type === 'twitter')?.url || ''
  const tiktokLink = socialLinks?.find((s) => s?.type === 'tiktok')?.url || ''
  const discordLink = socialLinks?.find((s) => s?.type === 'discord')?.url || ''
  const otherLink = socialLinks?.find((s) => !['twitter', 'telegram', 'discord'].includes(s?.type))?.url || ''

  const hasZeroSocials = socialLinks.length === 0

  const remaining = token.graduation_target - (token.accummulated_fund ?? 0)
  const remainingPercentage = (remaining / token.graduation_target) * 100

  return (
    <Pressable
      onPress={() => {
        customHaptics.tap()
        router.push({
          pathname: '/presale/[presale]',
          params: {
            presale: token.id,
            // pairAddress: token.pair_address,
          },
        })
      }}
      style={styles.rowContainer}
    >
      <View style={styles.listItemContainer}>
        <View style={styles.iconContainer}>
          {token.image_url && <Image source={{ uri: token.image_url }} style={styles.icon} />}
        </View>
        <View style={styles.infoOuterRowContainer}>
          <Text numberOfLines={2}>
            <View style={styles.infoInnerColumnContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.nameText}>{token.name}</Text>
                <Text style={styles.symbolText}>${token.symbol}</Text>
              </View>
              <View style={styles.priceChangeContainer}>
                {/* TODO: Calculate and format price change */}
                {/* <Text style={styles.priceChangeText}>98%</Text> */}
              </View>
              <View
                style={[
                  styles.socialsAndDescriptionContainer,
                  {
                    gap: hasZeroSocials ? 0 : 10,
                  },
                ]}
              >
                <View style={styles.socialsContainer}>
                  {socialLinks.some((s) => s?.type === 'tiktok') ? (
                    tiktokLink ? (
                      <TouchableOpacity onPress={() => handleSocialPress(tiktokLink)}>
                        <Icon icon="tiktok" size={16} color={Colors.buttonBlue} />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="tiktok" size={16} color={Colors.buttonBlue} />
                    )
                  ) : (
                    <></>
                  )}
                  {socialLinks.some((s) => s?.type === 'twitter') ? (
                    twitterLink ? (
                      <TouchableOpacity onPress={() => handleSocialPress(twitterLink)}>
                        <Icon icon="twitter" size={15} color={Colors.buttonBlue} />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="twitter" size={15} color={Colors.buttonBlue} />
                    )
                  ) : (
                    <></>
                  )}
                  {socialLinks.some((s) => s?.type === 'discord') ? (
                    discordLink ? (
                      <TouchableOpacity onPress={() => handleSocialPress(discordLink)}>
                        <Icon icon="link" size={14} color={Colors.buttonBlue} />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="link" size={14} color={Colors.buttonBlue} />
                    )
                  ) : (
                    <></>
                  )}
                  {socialLinks.some((s) => !['twitter', 'telegram', 'discord'].includes(s?.type)) ? (
                    otherLink ? (
                      <TouchableOpacity onPress={() => handleSocialPress(otherLink)}>
                        <Icon icon="link" size={14} color={Colors.buttonBlue} />
                      </TouchableOpacity>
                    ) : (
                      <Icon icon="link" size={14} color={Colors.buttonBlue} />
                    )
                  ) : (
                    <></>
                  )}
                </View>
                <Text style={styles.descriptionText} numberOfLines={2}>
                  {token.description}
                </Text>
              </View>
            </View>
          </Text>
        </View>
        <View style={styles.metricsContainer}>
          <View style={styles.marketCapContainer}>
            <View style={{ width: 30, height: 30 }}>
              <Svg
                style={{
                  width: '100%',
                  height: '100%',
                  transform: [{ rotate: '-90deg' }],
                }}
                viewBox="0 0 36 36"
              >
                <Circle
                  cx="18"
                  cy="18"
                  r="8"
                  fill="none"
                  stroke={
                    (remainingPercentage ?? 0) < 20
                      ? '#D04030'
                      : (remainingPercentage ?? 0) < 60
                        ? '#DA8B2B'
                        : '#23D515'
                  }
                  strokeWidth="3"
                  opacity={0.1}
                />
                <Circle
                  cx="18"
                  cy="18"
                  r="8"
                  fill="none"
                  stroke={
                    (remainingPercentage ?? 0) < 20
                      ? '#D04030'
                      : (remainingPercentage ?? 0) < 60
                        ? '#DA8B2B'
                        : '#23D515'
                  }
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset={100 - remainingPercentage * 0.5}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={styles.marketCapAmountText}>
              <Text
                style={[
                  styles.marketCapAmountText,
                  {
                    color: remainingPercentage < 20 ? '#D04030' : remainingPercentage < 60 ? '#DA8B2B' : '#23D515',
                  },
                ]}
              >
                {Number(remainingPercentage.toFixed(1))}%
              </Text>
            </View>
            <Text style={styles.marketCapPercentageText}>left</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}
