import { useQuery } from '@tanstack/react-query'
import { supabase } from '../utils/supabase'
import { QueryKeys, TableNames } from '../types'
import { Tables } from '@/types/database.types'

export const useGetTrendingPresales = () => {
  return useQuery<Tables<'presale_tokens'>[], Error>({
    queryKey: [QueryKeys.TRENDING_PRESALES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TableNames.PRESALE_TOKENS)
        .select('*')
        // Only get tokens created in the last 24 hours
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        // Order by volume
        .order('volume_24h', { ascending: false })
        // Limit to 100 tokens
        .limit(10)

      if (error) {
        throw new Error(error.message)
      }

      // Filter out tokens with no activity
      const activeTokens = data?.filter((token) => token.volume_24h > 0) || []

      return activeTokens
    },
    // Refresh every minute
    refetchInterval: 60 * 1000,
  })
}
