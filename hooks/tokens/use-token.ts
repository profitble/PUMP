import { Tables } from '@/types/database.types'
import { supabase } from '@/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export type TokenWithPresale = Tables<'tokens'> & {
  presale_tokens: {
    description: string
    graduation_target: number
    accummulated_fund: number
    volume_24h: number
    image_url: string
  }
}

export const useTokens = () => {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tokens')
        .select(
          `
          mint_address,
          name,
          symbol,
          decimals,
          initial_supply,
          presale_tokens( 
            description,
            graduation_target,
            accummulated_fund,
            volume_24h,
            image_url
          )
        `
        )
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as TokenWithPresale[]
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  })
}
