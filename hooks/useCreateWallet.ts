import { Alert } from 'react-native'
import { useMutation } from '@tanstack/react-query'

interface WalletResponse {
  apiKey: string
  walletPublicKey: string
  privateKey: string
}

const createWalletRequest = async (): Promise<WalletResponse> => {
  console.log('[Wallet Creation] Initiating wallet creation request...')
  const response = await fetch('https://pumpportal.fun/api/create-wallet', {
    method: 'GET',
  })

  if (!response.ok) {
    console.error(`[Wallet Creation] HTTP error: ${response.status}`)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('[Wallet Creation] Wallet created successfully')
  console.log('[Wallet Creation] Public key:', data.walletPublicKey)
  return data
}

export const useCreateWallet = () => {
  return useMutation({
    mutationFn: createWalletRequest,
    onError: (error: any) => {
      console.error('[Wallet Creation] Error:', error)
      let errorMessage = 'Error creating wallet. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      Alert.alert('Creation Error', errorMessage)
    },
  })
}
