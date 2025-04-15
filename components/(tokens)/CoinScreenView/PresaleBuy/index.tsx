import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Dimensions } from 'react-native'
import { View, StyleSheet, TouchableOpacity, Pressable, Image, Platform, Alert } from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { CButton, CText, Icon, TokenPurchaseToast } from '@/components'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tables } from '@/types/database.types'
import { useUserBalance } from '@/hooks/payments/use-user-balance'
import { usePresaleTokenPurchase } from '@/hooks/presale-tokens/use-presale-token-purchase'
import { useGetSolanaPrice } from '@/hooks/useGetSolanaPrice'
import { toast, ToastPosition } from '@backpackapp-io/react-native-toast'
import { Colors } from '@/constants'
import { customHaptics } from '@/utils'

interface PresaleBuyViewProps {
  token: Tables<'presale_tokens'>
  onClose: () => void
}

const PresaleBuyView: React.FC<PresaleBuyViewProps> = ({ token, onClose }) => {
  const [quantity, setQuantity] = useState<any>('0')
  const snapPoints = useMemo(() => ['96%'], [])
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { price } = useGetSolanaPrice()
  const { balance = 0 } = useUserBalance() // ✅ Ensure balance is never undefined
  const { purchaseTokens, loading: purchasingToken } = usePresaleTokenPurchase()

  useEffect(() => {
    setTimeout(() => {
      bottomSheetRef.current?.expand()
    }, 100)
  }, [])

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  )

  const handleNumberPress = (num: string) => {
    setQuantity((prev: string) => {
      if (num === '<') return prev.slice(0, -1) || '0'
      if (num === '.' && prev.includes('.')) return prev
      return prev === '0' ? num : prev + num
    })
  }

  const handleBuy = async () => {
    customHaptics.success()
    console.log('Attempting to buy', quantity, 'SOL')
    console.log('Current balance:', balance)

    if (Number(quantity) > balance) {
      alert('Insufficient balance')
      return
    }

    try {
      const result = await purchaseTokens(token?.id, Number(quantity))

      if (result.success) {
        onClose()
      }
    } catch (error) {
      toast.error(error instanceof Error ? 'Insufficient balance' : 'Purchase failed', {
        //error.message
        duration: 3000,
        disableShadow: true,
        width: Dimensions.get('screen').width * 0.9,
        isSwipeable: true,
        position: ToastPosition.BOTTOM,
      })
    }
  }

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
            <CText style={styles.header}>BUY ${token?.name} PRE-SALE</CText>
            <TouchableOpacity onPress={onClose}>
              <Icon icon="filledCrossGrey" size={32} />
            </TouchableOpacity>
          </View>

          {/* Conversion Rate */}
          <View style={styles.conversionContainer}>
            {token?.image_url && <Image source={{ uri: token?.image_url }} style={styles.tokenImage} />}
            <CText style={styles.conversionValue}>{quantity} SOL</CText>
            <CText style={styles.conversionRate}>≈ ${price * Number(quantity)} USD</CText>
            <TouchableOpacity onPress={() => setQuantity(balance.toString())} style={styles.maxButton}>
              <CText style={styles.maxButtonText}>max</CText>
            </TouchableOpacity>
          </View>

          {/* Remaining Balance */}
          <CText style={styles.remainingBalance}>Remaining balance: {balance} SOL</CText>

          <View style={styles.numberPad}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '<'].map((num) => (
              <TouchableOpacity key={num} style={styles.numberButton} onPress={() =>{
                customHaptics.success() 
                handleNumberPress(num.toString())
                 }}>
                {num === '<' ? (
                  <MaterialCommunityIcons name="backspace-outline" size={24} color="black" />
                ) : (
                  <CText style={styles.numberText}>{num}</CText>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <CButton
            title={purchasingToken ? 'please wait...' : 'Buy'}
            variant="blue"
            onPress={handleBuy}
            disabled={purchasingToken || Number(quantity) === 0 || Number(quantity) > balance}
          />
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
    borderRadius: 80,
  },
  handleIndicator: {
    width: 30,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#ccc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
  },
  header: {
    fontSize: 16,
    color: '#BEBEBE',
    fontFamily: 'SfProRoundedHeavy',
  },
  tokenImage: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  conversionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  conversionValue: {
    fontSize: 48,
    color: '#0174E7',
    fontFamily: 'SfProRoundedHeavy',
  },
  conversionRate: {
    fontSize: 16,
    color: '#82B8F3',
    fontFamily: 'SfProRoundedHeavy',
  },
  maxButton: {
    backgroundColor: '#E3F2FF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 10,
  },
  maxButtonText: {
    color: Colors.buttonBlue,
    fontSize: 14,
    fontFamily: 'SfProRoundedHeavy',
  },
  remainingBalance: {
    color: Colors.buttonBlue,
    fontSize: 14,
    fontFamily: 'SfProRoundedHeavy',
    marginVertical: 10,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '80%',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  numberButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: 28,
    fontFamily: 'SfProRoundedHeavy',
  },
  buyButton: {
    width: '100%',
    borderRadius: 18,
  },
  buyButtonGradient: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SfProRoundedHeavy',
  },
})

export default PresaleBuyView
