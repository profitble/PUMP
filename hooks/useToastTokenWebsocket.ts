import { useEffect, useRef, useState } from 'react'

import { WebSocketMessage } from '@/types'

export const useToastTokenWebsocket = (onTrade: (data: WebSocketMessage) => void) => {
  console.log('🚀 Initializing useToastTokenWebsocket hook')
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log('⚡️ useEffect triggered')
    const fetchAndConnect = async () => {
      console.log('🔄 Starting fetchAndConnect')
      try {
        console.log('📡 Fetching trending tokens...')
        const response = await fetch(
          'https://frontend-api-v3.pump.fun/coins/currently-live?limit=10&offset=0&includeNsfw=true',
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
            },
          }
        )
        const coins = await response.json()
        console.log('📦 Raw coins data:', coins)
        const tokenIds = coins.map((coin: any) => coin.mint)
        console.log('🔍 USE TOAST TOKEN WEBSOCKET trending tokens:', tokenIds)

        console.log('🔌 Initializing WebSocket connection...')
        const ws = new WebSocket('wss://pumpportal.fun/api/data')
        wsRef.current = ws

        ws.onopen = () => {
          console.log('✅ WebSocket connection opened')
          setIsConnected(true)
          const payload = {
            method: 'subscribeTokenTrade',
            keys: tokenIds,
          }
          console.log('📤 Sending subscription payload:', payload)
          ws.send(JSON.stringify(payload))
          console.log('📤 Subscription payload sent')
        }

        ws.onmessage = (event) => {
          console.log('📨 Received WebSocket message:', event.data)
          const data = JSON.parse(event.data)
          console.log('🔍 Parsed message data:', data)
          if (data.solAmount >= 0.1) {
            console.log('💰 Trade meets minimum amount, calling onTrade')
            onTrade(data)
          } else {
            console.log('💡 Trade below minimum amount, ignoring')
          }
        }

        ws.onerror = (event) => {
          console.log('🛑 WebSocket error:', event)
        }

        ws.onclose = (event) => {
          console.log('❌ WebSocket connection closed:', event)
          setIsConnected(false)
        }
      } catch (error) {
        console.error('🚨 Error in websocket setup:', error)
        setIsConnected(false)
      }
    }

    fetchAndConnect()

    return () => {
      console.log('🧹 Cleaning up WebSocket connection')
      if (wsRef.current) {
        console.log('🔌 Closing existing WebSocket connection')
        wsRef.current.close()
        setIsConnected(false)
      }
    }
  }, [onTrade])

  return { isConnected }
}
