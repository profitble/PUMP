import { toast } from '@backpackapp-io/react-native-toast'
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Pressable, StyleSheet, View } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import 'react-native-url-polyfill'

import { customHaptics } from '@/utils'

import { Colors, PARENT_VIEW_HORIZONTAL_PADDING } from '@/constants'

import { CText, Icon, ParentView, Spacer, TokenPurchaseToast } from '@/components'

import { Tables } from '@/types/database.types'

type CoinScreenProps = {
  token: Tables<'presale_tokens'>
}

export const CoinScreen = ({ token }: CoinScreenProps) => {
  const { generateUrlForSigning, updateSignature, openWithInAppBrowser } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_UEjqvgTA3o3BCbMZcpwU5E6W0DWgr7TJ',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '100',
        defaultCurrencyCode: 'eth',
      },
    },
    browserOpener: {
      open: async (url: string) => {
        if (await InAppBrowser.isAvailable()) {
          try {
            await InAppBrowser.open(url, {
              // Browser configuration
              showTitle: true,
              toolbarColor: '#2563EB',
              secondaryToolbarColor: 'black',
              enableUrlBarHiding: true,
              enableDefaultShare: false,
              forceCloseOnRedirection: true,
            })
            // temporarily show a toast to simulate a token purchase
            // in reality, we need to confirm whether the purchase was successful
            toast('Token Created', {
              duration: 5000,
              disableShadow: true,
              width: Dimensions.get('screen').width * 0.9,
              isSwipeable: true,
              customToast: () => {
                return <TokenPurchaseToast tokenName="Saad" />
              },
            })
          } catch (error) {
            console.error(error)
          }
        }
      },
    },
  })

  const [isStarred, setIsStarred] = useState(false)

  useEffect(() => {
    // Get signature from backend
    fetch('/api/sign-moonpay-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: generateUrlForSigning({ variant: 'inapp-browser' }),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        updateSignature(data.signature)
      })
  }, [])

  const handleBuy = () => {
    customHaptics.tap()
    openWithInAppBrowser()
  }

  const handleSell = () => {
    console.log('sell')
  }

  const handleRouteBack = () => {
    customHaptics.tap()
    router.back()
  }

  const handlePressStar = () => {
    if (isStarred) {
      customHaptics.softTap()
    } else {
      customHaptics.success()
    }
    setIsStarred((prev) => !prev)
  }

  return (
    <ParentView
      containerStyle={{
        paddingBottom: 20,
      }}
    >
      <View
        className="flex flex-row items-center justify-between w-full"
        style={{
          paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        }}
      >
        <Pressable onPress={handleRouteBack}>
          <View
            style={{
              backgroundColor: '#F5F4EE',
              borderRadius: 500,
              padding: 10,
            }}
          >
            <Icon icon="backArrow" size={14} />
          </View>
        </Pressable>
        <View className="flex flex-row justify-center items-center space-x-0.5">
          <Pressable onPress={handlePressStar} className="p-2">
            {isStarred ? (
              <View
                style={{
                  backgroundColor: '#F5F4EE',
                  borderRadius: 500,
                  padding: 10,
                }}
              >
                <Icon icon="starFilled" size={14} color="#FFD000" />
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: '#F5F4EE',
                  borderRadius: 500,
                  padding: 10,
                }}
              >
                <Icon icon="star" size={14} />
              </View>
            )}
          </Pressable>
          <Pressable className="p-2">
            <View
              style={{
                backgroundColor: '#F5F4EE',
                borderRadius: 500,
                padding: 10,
              }}
            >
              <Icon icon="upload" size={14} />
            </View>
          </Pressable>
        </View>
      </View>

      <Spacer size={16} />
      <View
        className="relative flex flex-row items-center justify-between w-full"
        style={{
          paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        }}
      >
        {token.image_url ? (
          <Image src={token.image_url} className="w-12 h-12 mr-3 rounded-full" />
        ) : (
          <View className="w-12 h-12 mr-3 bg-red-500 rounded-full" />
        )}
        <View className="flex-col items-start justify-start flex-1 w-full">
          <CText
            weight="medium"
            className="text-lg text-gray-400"
            style={{
              color: Colors.inputBorderLight,
              fontFamily: 'SfProRounded',
            }}
          >
            {token.symbol}
          </CText>
          <CText
            className="text-white"
            style={{
              fontSize: 12,
              color: Colors.descLight,
              fontFamily: 'SfProRounded',
            }}
          >
            {token.name}
          </CText>
        </View>
        <View className="flex flex-row items-center justify-center gap-2">
          <View style={styles.iconContainer}>
            <Icon icon="twitter" size={12} color="#FFFFFF" />
          </View>
          <View style={styles.iconContainer}>
            <Icon icon="link" size={12} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <Spacer size={24} />
      <View
        className="flex-col items-start justify-between flex-1 w-full"
        style={{
          paddingHorizontal: PARENT_VIEW_HORIZONTAL_PADDING,
        }}
      >
        {/* <CoinTVFrame pairAddress={token.token_address} /> */}
        <Spacer size={48} />
        <View
          className="flex-row items-center justify-center w-full gap-3"
          style={{
            paddingHorizontal: 20,
          }}
        >
          <Pressable
            onPress={handleBuy}
            className="flex-row items-center justify-center flex-1 py-2"
            style={{
              backgroundColor: '#0061FF',
              borderRadius: 12,
            }}
          >
            <Icon icon="trending" size={16} />
            <CText
              isExpanded
              weight="black"
              className="text-[14px] text-white ml-2"
              style={{ fontFamily: 'SfProRounded' }}
            >
              BUY
            </CText>
          </Pressable>

          <Pressable
            onPress={handleSell}
            className="flex-row items-center justify-center flex-1 py-2"
            style={{
              backgroundColor: '#0061FF',
              borderRadius: 12,
            }}
          >
            <Icon icon="trending" size={16} />
            <CText
              isExpanded
              weight="black"
              className="text-[14px] text-white ml-2"
              style={{ fontFamily: 'SfProRounded' }}
            >
              SELL
            </CText>
          </Pressable>
        </View>
      </View>
    </ParentView>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
})
