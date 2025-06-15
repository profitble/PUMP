import React, { useEffect } from 'react'
import { useEmbeddedSolanaWallet } from '@privy-io/expo'

export const WalletManagement = () => {
  const wallet = useEmbeddedSolanaWallet()

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        if (wallet.status === 'not-created') {
          console.log('User authenticated, creating Solana wallet...')
          wallet?.create({
            recoveryMethod: 'privy',
          })
        }
      } catch (error) {
        console.error('Error in background wallet creation:', error)
      }
    }

    initializeWallet()
  }, [])

  return <></>
}
