import { Toast, toast } from '@backpackapp-io/react-native-toast'
import { useBoolVariation } from '@launchdarkly/react-native-client-sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions } from 'react-native'

import sampleTrades from '@/assets/sample_trades.json'
import { FriendsTokenPurchaseToast } from '@/components'

interface Trade {
  buyerName: string
  amount: string
  tokenName: string
  backgroundColor: string
  imageColor: string
  textDetailsColor: string
  textColor: string
}

interface ToastConfig {
  minInterval?: number // Minimum time between toasts in ms
  maxInterval?: number // Maximum time between toasts in ms
  widthRatio?: number // Width of toast relative to screen width (0-1)
  height?: number // Height of toast in pixels
  featureFlag?: string // LaunchDarkly feature flag name
  duration?: number // How long each toast should display
}

const DEFAULT_CONFIG: Required<ToastConfig> = {
  minInterval: 1000,
  maxInterval: 20000,
  widthRatio: 0.9,
  height: 50,
  featureFlag: 'show-friends-token-purchase-toast',
  duration: 3000, // 3 seconds
}

const screenWidth = Dimensions.get('screen').width

export const useFriendsTokenPurchaseToast = (config: ToastConfig = {}) => {
  const [isEnabled, setIsEnabled] = useState(true)
  const activeToastRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  const showFriendsTokenPurchaseToast = useBoolVariation(mergedConfig.featureFlag, true)

  const showRandomTrade = useCallback(() => {
    try {
      // If there's already a toast showing, skip this one
      if (activeToastRef.current) {
        return
      }

      if (!sampleTrades.length) {
        console.warn('No sample trades available')
        return
      }

      const trade = sampleTrades[Math.floor(Math.random() * sampleTrades.length)] as Trade

      // Set active flag before showing toast
      activeToastRef.current = true

      toast(`${trade.buyerName},${trade.amount},${trade.tokenName}`, {
        disableShadow: true,
        height: mergedConfig.height,
        width: screenWidth * mergedConfig.widthRatio,
        isSwipeable: false,
        duration: mergedConfig.duration,
        customToast: (toastProps: Toast) => (
          <FriendsTokenPurchaseToast
            toast={toastProps}
            backgroundColor={trade.backgroundColor}
            imageColor={trade.imageColor}
            textDetailsColor={trade.textDetailsColor}
            textColor={trade.textColor}
          />
        ),
      })

      // Clear the active flag after the toast duration
      timeoutRef.current = setTimeout(() => {
        activeToastRef.current = false
      }, mergedConfig.duration)
    } catch (error) {
      console.error('Error showing trade toast:', error)
      setIsEnabled(false)
      activeToastRef.current = false
    }
  }, [mergedConfig.height, mergedConfig.widthRatio, mergedConfig.duration])

  useEffect(() => {
    if (!showFriendsTokenPurchaseToast || !isEnabled) return

    const interval = setInterval(
      showRandomTrade,
      Math.random() * (mergedConfig.maxInterval - mergedConfig.minInterval) + mergedConfig.minInterval
    )

    return () => {
      clearInterval(interval)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      activeToastRef.current = false
    }
  }, [showFriendsTokenPurchaseToast, isEnabled, showRandomTrade, mergedConfig.maxInterval, mergedConfig.minInterval])

  const enable = useCallback(() => setIsEnabled(true), [])
  const disable = useCallback(() => {
    setIsEnabled(false)
    activeToastRef.current = false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    isEnabled,
    isConnected: showFriendsTokenPurchaseToast,
    enable,
    disable,
  }
}
