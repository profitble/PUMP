import { supabase } from '@/utils'
import { useState } from 'react'

interface PurchaseResponse {
  success: boolean
  transaction?: {
    purchaseId: string
    newBalance: number
    tokenAmount: number
    accumulatedFund: number
  }
  error?: string
}

export const usePresaleTokenPurchase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const purchaseTokens = async (presaleTokenId: string, amount: number): Promise<PurchaseResponse> => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke<PurchaseResponse>('purchase-presale-token', {
        body: { presaleTokenId, amount },
      })

      if (error) throw error

      return data!
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    purchaseTokens,
    loading,
    error,
  }
}
