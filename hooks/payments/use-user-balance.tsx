import { supabase } from '@/utils'
import { useEffect, useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'

interface UserBalance {
  balance: number
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useUserBalance = (): UserBalance => {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('user_wallets').select('balance').single()

      if (error) {
        // Handle "no rows found" case
        if ((error as PostgrestError).code === 'PGRST116') {
          setBalance(0)
          return
        }
        throw error
      }

      setBalance(data?.balance ?? 0)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch balance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  return { balance, loading, error, refetch: fetchBalance }
}
