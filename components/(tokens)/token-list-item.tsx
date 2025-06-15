import { router } from 'expo-router'
import React from 'react'
import { Image, Linking, Pressable, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { customHaptics } from '@/utils'

import { Icon } from '@/components'

import { TokenWithPresale } from '@/hooks/tokens/use-token'
import { StyleSheet } from 'react-native'

import { Colors } from '@/constants'

type Props = {
  token: TokenWithPresale
}

type SocialLink = {
  type: string
  url: string
}

export const TokenListItem = ({ token }: Props) => {
  const handleSocialPress = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error('Error opening URL:', error)
    }
  }

  const parseSocialLinks = (): SocialLink[] => {
    // try {
    //   if (typeof token.socials === 'string') {
    //     return JSON.parse(token.socials)
    //   }
    //   return Array.isArray(token.socials) ? token.socials : []
    // } catch (error) {
    //   console.error('Error parsing social links:', error)
    //   return []
    // }

    return []
  }

  const socialLinks = parseSocialLinks()
  const twitterLink = socialLinks?.find((s) => s?.type === 'twitter')?.url || ''
  const tiktokLink = socialLinks?.find((s) => s?.type === 'tiktok')?.url || ''
  const discordLink = socialLinks?.find((s) => s?.type === 'discord')?.url || ''
  const otherLink = socialLinks?.find((s) => !['twitter', 'telegram', 'discord'].includes(s?.type))?.url || ''

  const hasZeroSocials = socialLinks.length === 0

  return (
    <Pressable
      onPress={() => {
        customHaptics.tap()
        router.push({
          pathname: '/coin/[coin]',
          params: {
            coin: token.id,
            // pairAddress: token.pair_address,
          },
        })
      }}
      style={styles.rowContainer}
    >
      <View style={styles.listItemContainer}>
        <View style={styles.iconContainer}>
          {token?.presale_tokens?.image_url && (
            <Image source={{ uri: token?.presale_tokens?.image_url }} style={styles.icon} />
          )}
        </View>
        <View style={styles.infoOuterRowContainer}>
          <Text numberOfLines={2}>
            <View style={styles.infoInnerColumnContainer}>
              {/* <Text style={styles.username}>@{token.id}</Text> */}
              <Text style={styles.nameText}>
                {token?.name} [{token?.symbol}]
              </Text>
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
                  {token?.presale_tokens?.description}
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
                <Circle cx="18" cy="18" r="8" fill="none" stroke={Colors.valueUp} strokeWidth="3" opacity={0.1} />
                <Circle
                  cx="18"
                  cy="18"
                  r="8"
                  fill="none"
                  stroke={Colors.valueUp}
                  strokeWidth="3"
                  strokeDasharray="110"
                  strokeDashoffset="80"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={styles.marketCapAmountText}>
              <Text style={styles.marketCapAmountText}>67%</Text>
            </View>
            <Text style={styles.marketCapPercentageText}>left</Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export const styles = StyleSheet.create({
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
    gap: 12,
    fontFamily: 'SfProRounded',
    borderRadius: 16,
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
    color: Colors.titleLight2,
    fontSize: 12,
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
    color: Colors.subtitle,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
    lineHeight: 10,
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
    justifyContent: 'center',
    gap: 4,
  },
  marketCapText: {
    color: Colors.lime,
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'SfProRounded',
  },
  marketCapAmount: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: 'SfProRounded',
  },
  marketCapAmountText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: 'SfProRounded',
    color: Colors.valueUp,
  },
  marketCapPercentageText: {
    display: 'flex',
    flexDirection: 'row',
    color: Colors.titleLight,
    opacity: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
  },
})
