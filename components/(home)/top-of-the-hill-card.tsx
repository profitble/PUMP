import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, Linking, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { Colors } from '@/constants' // Assuming constants are set

import { CButton, CText, Icon, Spacer } from '@/components' // Assuming Icon component is defined
import * as Clipboard from 'expo-clipboard';

import { TokenWithPresale } from '@/hooks/tokens/use-token'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'
import { useBoolVariation } from '@launchdarkly/react-native-client-sdk'

type Props = {
  token: TokenWithPresale
}

type SocialLink = {
  type: string
  url: string
}

export const TopOfTheHillCard = ({ token }: Props) => {
  const showTopOfTheHillBuyButton = useBoolVariation('show-top-of-the-hill-buy-button', false)
  if (!token || !token.presale_tokens) return null

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

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(token.mint_address)

      // Hide notification after 2 seconds
      toast(`${token.mint_address} Copied to clipboard`, {
        duration: 2000,
        position: ToastPosition.BOTTOM,
        styles: {
          view: {
            paddingBottom: 30,
          },
        },
      })
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <View className=" bg-top-orange rounded-[20px] border-none mt-4">
      {/* <ImageBackground source={iconRegistry.orangeBg} resizeMode="stretch" className="rounded-[24px] border-none mt-4"> */}
      <View className="rounded-[24px] border-none">
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
          className="flex flex-row items-center rounded-t-[20px] justify-center w-full mb-3"
          style={{
            boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)',
          }}
        >
          <CText
            className="m-2 text-white"
            style={{
              fontSize: 16,
              fontFamily: 'SfProRoundedHeavy',
            }}
          >
            TOP OF THE HILL
          </CText>
        </LinearGradient>

        <Pressable onPress={() => { }} style={styles.rowContainer}>
          <View className="flex flex-row items-center gap-1">
            <View style={styles.iconContainer}>
              {token?.presale_tokens?.image_url && (
                <Image source={{ uri: token.presale_tokens.image_url }} style={styles.icon} />
              )}
            </View>
          </View>
          <View style={styles.infoOuterRowContainer}>
            <View style={styles.infoInnerColumnContainer}>
              <Text style={styles.nameText}>{token.name}</Text>
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
                <View className="flex flex-row items-center justify-center gap-1">
                  <View className="flex flex-row items-center justify-center gap-1">
                    <Icon icon="link" size={12} color={Colors.backgroundLight} />
                  </View>
                  <View className="flex flex-row items-center justify-center gap-1">
                    <CText
                      style={{
                        color: Colors.backgroundLight,
                        fontFamily: 'SfProRounded',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      ${token.symbol}
                    </CText>
                  </View>
                  <View className="flex flex-row items-center justify-center gap-1">
                    <Text style={styles.descriptionText} numberOfLines={1}>
                      {token.presale_tokens.description?.substring(0, 15)}...
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.marketCapContainer}>
              <Text style={[styles.marketCapAmountText, { marginLeft: 'auto' }]}>$0.001</Text>
              <View style={styles.marketCapPercentageText}>
                <Icon icon="upArrowThick" size={12} color={Colors.backgroundLight} />
                <Text style={styles.marketCapPercentageText}>98%</Text>
              </View>
            </View>
          </View>
        </Pressable>

        {/* <View className="mx-4 border-b border-white border-solid opacity-30" /> */}

        <Spacer size={10} />

        {showTopOfTheHillBuyButton && (
          <CButton title="Buy" variant="light-orange" className="mx-4 mb-4" onPress={copyToClipboard} />
        )}
      </View>
      {/* </ImageBackground> */}
    </View>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontFamily: 'SfProRounded',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'SfProRounded',
    borderRadius: 16,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    fontFamily: 'SfProRounded',
  },
  infoOuterRowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontFamily: 'SfProRounded',
    lineHeight: 19.2,
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
    color: Colors.backgroundLight,
    opacity: 0.7,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
    lineHeight: 20,
  },
  marketCapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontFamily: 'SfProRounded',
  },
  marketCapAmountText: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontFamily: 'SfProRounded',
    color: Colors.backgroundLight,
  },
  marketCapPercentageText: {
    display: 'flex',
    flexDirection: 'row',
    color: Colors.backgroundLight,
    opacity: 0.7,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'SfProRounded',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
    gap: 8,
    padding: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 22.983,
    letterSpacing: 0.425,
    fontFamily: 'SfProRounded',
  },
})
