import { useMemo } from 'react'
import { useEmbeddedSolanaWallet } from '@privy-io/expo'

export const useImportWallet = () => {
  const wallet = useEmbeddedSolanaWallet()

  const walletAddress = useMemo(() => {
    if (
      !wallet ||
      wallet.status === 'disconnected' ||
      wallet.status === 'needs-recovery' ||
      wallet.status === 'not-created' ||
      wallet.status === 'error'
    ) {
      return null
    }

    if (wallet.wallets.length === 0) {
      return null
    }

    return wallet.wallets
  }, [wallet])

  return { walletAddress }
}
