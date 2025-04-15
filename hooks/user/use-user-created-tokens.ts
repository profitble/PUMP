import { supabase } from '@/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export interface CreatedToken {
  id: string
  name: string
  symbol: string
  description: string
  graduation_target: number
  accummulated_fund: number
  volume_24h: number
  image_url: string | null
  created_at: string
  // Additional metrics
  investors_count: number
  progress_percentage: number
}

export const useUserCreatedTokens = () => {
  const queryClient = useQueryClient()

  // useEffect(() => {
  //   const channel = supabase
  //     .channel('user_created_tokens')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'presale_tokens',
  //       },
  //       () => {
  //         queryClient.invalidateQueries({ queryKey: ['userCreatedTokens'] })
  //       }
  //     )
  //     .subscribe()

  //   return () => {
  //     channel.unsubscribe()
  //   }
  // }, [queryClient])

  return useQuery({
    queryKey: ['userCreatedTokens'],
    queryFn: async () => {
      // First get the current user's ID
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      // Fetch tokens with creator_id matching user's ID
      const { data: tokens, error } = await supabase
        .from('presale_tokens')
        .select(
          `
          *,
          token_purchases (
            user_id
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Process and enrich the data
      return (tokens as CreatedToken[]).map((token) => {
        // Get unique investors count
        // const uniqueInvestors = new Set(token.token_purchases?.map((purchase) => purchase.user_id) ?? [])

        // Calculate progress percentage
        const progress = (token.accummulated_fund / token.graduation_target) * 100

        return {
          ...token,
          // investors_count: uniqueInvestors.size,
          progress_percentage: progress,
        }
      })
    },
  })
}
