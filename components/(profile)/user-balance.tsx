import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ImageBackground, StyleSheet, View, Text, useWindowDimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Images } from '@/constants'
import { CText, Icon, Spacer } from '@/components'
import { CButton } from '@/components/common/CustomTags/Button'
import { useBoolVariation } from '@launchdarkly/react-native-client-sdk'
import { FunButton } from '@/components/ui/fun-button'

type UserBalanceProps = {
  handleDeposit: () => void
  handleSend: () => void
  balance: number
  loading: boolean
  error: string | null
}

const UserBalance = ({ balance, loading, error, handleDeposit, handleSend }: UserBalanceProps) => {
  const [usdPrice, setUsdPrice] = useState<number | null>(null)
  const { width } = useWindowDimensions()

  const hasDeposited = balance > 0

  const showCashOutButton = useBoolVariation('show-cash-out-button', false)

  // Fetch SOL price (you might want to use your preferred price feed)
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
        const data = await response.json()
        console.log('SOL price:', JSON.stringify(data, null, 2))
        setUsdPrice(data?.solana?.usd)
      } catch (err) {
        console.error('Failed to fetch SOL price:', err)
      }
    }

    fetchSolPrice()
    // You might want to add a refresh interval here
  }, [])

  if (loading) {
    return <ActivityIndicator size="small" />
  }

  if (error) {
    return <Text>Error loading balance</Text>
  }

  const usdBalance = usdPrice ? balance * usdPrice : null
  const isTablet = width >= 768 // Adjust for iPads

  return (
    <View style={{ width: '100%', paddingHorizontal: isTablet ? 40 : 20 }}>
      <CText isExpanded weight="bold" className="text-lg text-center" style={{ fontFamily: 'SfProRounded' }}>
        TOTAL IN TOPFUN
      </CText>

      <CText
        weight="bold"
        className="text-[#0174E7] text-center"
        style={{
          fontSize: isTablet ? 50 : 40,
          lineHeight: isTablet ? 70 : 60,
          includeFontPadding: false,
          textAlignVertical: 'center',
          fontFamily: 'SfProRounded',
        }}
      >
        {balance.toFixed(3)}
        <CText weight="bold" className="text-[#82B8F3]" style={{ fontFamily: 'SfProRounded' }}>
          {' '}
          SOL
        </CText>
      </CText>

      <CText weight="bold" className="text-base text-[#82B8F3] text-center" style={{ fontFamily: 'SfProRounded' }}>
        ≈{' '}
        <CText className="text-[#0174E7]" style={{ fontFamily: 'SfProRoundedBold' }}>
          ${usdBalance?.toFixed(2)} USD
        </CText>
      </CText>

      <Spacer size={isTablet ? 20 : 15} />
      <View className=" bg-top-orange rounded-[20px] border-none">
        {/* <ImageBackground source={Images.orangeBg} resizeMode="stretch"> */}
        <View className="">
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']}
            className="flex flex-row items-center rounded-t-[20px] justify-center w-full mb-3 py-2"
            style={{
              boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.05)',
              paddingVertical: isTablet ? 10 : 5,
            }}
          >
            <Icon icon="coin" size={isTablet ? 35 : 30} />
            <CText
              className="ml-2 text-white"
              weight="bold"
              style={{ fontSize: isTablet ? 18 : 16, fontFamily: 'SfProRounded' }}
            >
              CASH
            </CText>
          </LinearGradient>

          {/* <View className="mx-4 border-b border-white border-solid opacity-30"></View> */}
          <Spacer size={isTablet ? 15 : 10} />

          <View className="flex flex-row items-center justify-between px-5 pb-3">
            <FunButton onPress={handleDeposit} variant="outline" fullWidth>
              Add cash
            </FunButton>

            {showCashOutButton && (
              <CButton
                title="Cash out"
                className="flex-1"
                round
                variant="orange"
                disabled={!hasDeposited}
                onPress={handleSend}
              />
            )}
          </View>
        </View>
        {/* </ImageBackground> */}
      </View>
    </View>
  )
}

export default UserBalance
