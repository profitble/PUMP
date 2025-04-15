import { supabase } from '@/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

interface TokenPurchase {
  id: string
  user_id: string
  presale_token_id: string
  amount: number
  tokens_amount: number
  created_at: string
  presale_tokens: {
    id: string
    name: string
    symbol: string
    description: string
    accummulated_fund: number
    graduation_target: number
    image_url: string
  }
}

export interface UserHolding {
  presaleTokenId: string
  tokenName: string
  tokenSymbol: string
  tokenDescription: string
  imageUrl: string | null
  totalInvested: number
  percentageOfTotal: number
  graduationTarget: number
  accumulatedFund: number
}

export const useUserHoldings = () => {
  const queryClient = useQueryClient()

  // Set up realtime subscription for token purchases
  useEffect(() => {
    const channel = supabase
      .channel('user_holdings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'token_purchases',
        },
        () => {
          // Invalidate and refetch when purchases change
          queryClient.invalidateQueries({ queryKey: ['userHoldings'] })
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [queryClient])

  return useQuery({
    queryKey: ['userHoldings'],
    queryFn: async () => {
      // Fetch all user's purchases with presale token info
      const { data: purchases, error } = await supabase
        .from('token_purchases')
        .select(
          `
          *,
          presale_tokens (
            id,
            name,
            symbol,
            description,
            accummulated_fund,
            graduation_target,
            image_url
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group purchases by presale token and calculate totals
      const holdings = (purchases as TokenPurchase[]).reduce<Record<string, UserHolding>>((acc, purchase) => {
        const tokenId = purchase.presale_token_id

        if (!acc[tokenId]) {
          acc[tokenId] = {
            presaleTokenId: tokenId,
            tokenName: purchase.presale_tokens.name,
            tokenSymbol: purchase.presale_tokens.symbol,
            tokenDescription: purchase.presale_tokens.description,
            imageUrl: purchase.presale_tokens.image_url,
            totalInvested: 0,
            percentageOfTotal: 0,
            graduationTarget: purchase.presale_tokens.graduation_target,
            accumulatedFund: purchase.presale_tokens.accummulated_fund,
          }
        }

        acc[tokenId].totalInvested += purchase.amount
        // Calculate percentage of total funds
        acc[tokenId].percentageOfTotal = (acc[tokenId].totalInvested / purchase.presale_tokens.accummulated_fund) * 100

        return acc
      }, {})

      return Object.values(holdings)
    },
    select: (data) => data.sort((a, b) => b.totalInvested - a.totalInvested),
  })
}
