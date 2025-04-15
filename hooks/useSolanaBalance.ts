import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/expo'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'

export const useSolanaBalance = () => {
  const { user } = usePrivy()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  const solanaWallet = user?.linked_accounts.find((acc: any) => acc.chainType === 'solana')
  const connection = new Connection('https://api.mainnet-beta.solana.com')

  useEffect(() => {
    const fetchBalance = async () => {
      if (solanaWallet?.address) {
        try {
          const publicKey = new PublicKey(solanaWallet.address)
          const balance = await connection.getBalance(publicKey)
          setBalance(balance / LAMPORTS_PER_SOL)
        } catch (error) {
          console.error('Balance fetch failed:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [solanaWallet?.address])

  return {
    balance: balance.toFixed(2),
    loading,
    publicKey: solanaWallet?.address,
    wallet: solanaWallet,
  }
}
