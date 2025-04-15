import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Pressable, Image, Linking } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { router } from 'expo-router'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import Svg from 'react-native-svg'
import { Path } from 'react-native-svg'

import { Colors } from '@/constants'

import { CButton, CText, FunButton, Icon, Spacer } from '@/components'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Database, Tables } from '@/types/database.types'
import { useUserBalance } from '@/hooks/payments/use-user-balance'
import { customHaptics } from '@/utils'

interface PresaleBuyViewProps {
  token: Tables<'presale_tokens'>
  onClose: () => void
}

type SocialLink = {
  type: string
  url: string
}

export const PresaleScreenView: React.FC<PresaleBuyViewProps> = ({ token, onClose }) => {
  const snapPoints = useMemo(() => ['97%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { balance: userBalance = 0, loading: balanceLoading, error, refetch: refetchBalance } = useUserBalance()

  useEffect(() => {
    console.log(token)
    setTimeout(() => {
      bottomSheetRef.current?.expand()
    }, 100)
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const WavyLine = () => (
    <Svg height="18" width="100%" style={{ width: '100%' }}>
      <Path
        d="M0 4 Q 10 0, 20 4 T 40 4 T 60 4 T 80 4 T 100 4 T 120 4 T 140 4 T 160 4 T 180 4 T 200 4 T 220 4 T 240 4 T 260 4 T 280 4 T 300 4 T 320 4 T 340 4 T 360 4 T 380 4 T 400 4 T 420 4 T 440 4 T 460 4 T 480 4 T 500 4 T 520 4 T 540 4 T 560 4 T 580 4 T 600 4 T 620 4 T 640 4 T 660 4 T 680 4 T 700 4"
        stroke="#E0E0E0"
        strokeWidth="1"
        fill="none"
      />
    </Svg>
  )

  const handleSocialPress = async (url: string) => {
    try {
      await Linking.openURL(url)
    } catch (error) {
      console.error('Error opening URL:', error)
    }
  }

  const handleBuy = () => {
    customHaptics.tap()
    console.log('buy2')

    router.push({
      pathname: '/presalebuy/[presalebuy]',
      params: {
        presalebuy: token.id,
      },
    })
    console.log('pushed')
  }
  const handleDeposit = () => {
    customHaptics.success()
    router.navigate('/(auth)/(tabs)/(profile)/')
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

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        onClose={onClose}
        handleComponent={() => (
          <View style={styles.handle}>
            <View style={styles.handleIndicator} />
          </View>
        )}
      >
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <CText style={styles.header}>${token.name}</CText>
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: 'absolute',
                right: 0,
              }}
            >
              <Icon icon="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Conversion Rate */}
          <View style={styles.presaleContainer}>
            {token.image_url && (
              <Image
                source={{ uri: token.image_url }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 14,
                }}
              />
            )}
            <View style={styles.conversionTextRow}>
              <CText style={styles.conversionValue}>{token.name} </CText>
              <CText style={styles.conversionUnit}>Pre-Sale</CText>
            </View>

            <View style={styles.socialsContainer}>
              {socialLinks.some((s) => s?.type === 'tiktok') ? (
                tiktokLink ? (
                  <TouchableOpacity onPress={() => handleSocialPress(tiktokLink)}>
                    <Icon icon="tiktok" size={16} color={Colors.presaleText} />
                  </TouchableOpacity>
                ) : (
                  <Icon icon="tiktok" size={16} color={Colors.presaleText} />
                )
              ) : (
                <></>
              )}
              {socialLinks.some((s) => s?.type === 'twitter') ? (
                twitterLink ? (
                  <TouchableOpacity onPress={() => handleSocialPress(twitterLink)}>
                    <Icon icon="twitter" size={15} color={Colors.presaleText} />
                  </TouchableOpacity>
                ) : (
                  <Icon icon="twitter" size={15} color={Colors.presaleText} />
                )
              ) : (
                <></>
              )}
              {socialLinks.some((s) => s?.type === 'discord') ? (
                discordLink ? (
                  <TouchableOpacity onPress={() => handleSocialPress(discordLink)}>
                    <Icon icon="link" size={14} color={Colors.presaleText} />
                  </TouchableOpacity>
                ) : (
                  <Icon icon="link" size={14} color={Colors.presaleText} />
                )
              ) : (
                <></>
              )}
              {socialLinks.some((s) => !['twitter', 'telegram', 'discord'].includes(s?.type)) ? (
                otherLink ? (
                  <TouchableOpacity onPress={() => handleSocialPress(otherLink)}>
                    <Icon icon="link" size={14} color={Colors.presaleText} />
                  </TouchableOpacity>
                ) : (
                  <Icon icon="link" size={14} color={Colors.presaleText} />
                )
              ) : (
                <></>
              )}
            </View>
          </View>

          <CText
            style={{
              color: Colors.presaleText,
              fontSize: 12,
              fontFamily: 'SfProRounded',
              fontWeight: 'bold',
              textAlign: 'center',
              marginVertical: 20,
            }}
          >
            {token.description}
          </CText>

          <View>
            <WavyLine />
            <View style={{ height: 18 }} />
          </View>

          <View
            className="flex flex-row items-center justify-center w-full"
            style={{
              borderRadius: 12,
              backgroundColor: '#F2F2F2',
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 16,
            }}
          >
            <ProgressBar current={token.accummulated_fund ?? 0} total={token.graduation_target} />
          </View>

          <FunButton classList="my-4" variant="blue" onPress={handleBuy} disabled={userBalance < 0}>
            {userBalance >= 0 ? 'Buy' : 'Low balance'}
          </FunButton>

          {userBalance === 0 && (
            <>
              <CButton title="" onPress={handleDeposit}>
                <CText
                  style={{
                    color: Colors.presaleText,
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'SfProRounded',
                    textAlign: 'center',
                  }}
                >
                  Press to Deposit
                </CText>
                <Icon icon="arrowRightThick" color={'black'} size={24} />
              </CButton>
              <Spacer size={20} />
            </>
          )}

          <CText
            style={{
              color: Colors.presaleText,
              fontWeight: 'bold',
              fontSize: 10,
              fontFamily: 'SfProRounded',
              textAlign: 'center',
            }}
          >
            Available to everyone, for a short time only.
          </CText>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  handle: {
    paddingTop: 8,
    alignItems: 'center',
  },
  handleIndicator: {
    width: 30,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    position: 'relative',
  },
  header: {
    display: 'flex',
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 18,
    color: '#BEBEBE',
  },
  socialsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 7,
  },
  presaleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 77,
  },
  conversionTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  conversionValue: {
    fontWeight: 800,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'SfProRounded',
  },
  conversionUnit: {
    fontWeight: 800,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'SfProRounded',
  },
  conversionRate: {
    fontWeight: 'bold',
    color: '#0174E7',
    fontSize: 16,
    fontFamily: 'SfProRounded',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 40,
    gap: 6,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    width: 145,
    borderRadius: 12,
    padding: 10,
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  paymentText: {
    color: '#010101',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
    justifyContent: 'center',
  },
  numberButton: {
    width: '30%',
    aspectRatio: 1.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  numberBackspace: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  buyButton: {
    borderRadius: 18,
    paddingVertical: 8,
  },
  deposit_button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    paddingVertical: 10,
  },
})
