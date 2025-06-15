import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils'

import { QueryKeys, TableNames } from '@/types'
import { Tables } from '@/types/database.types'

export const useGetAllCoins = () => {
  return useQuery<Tables<'presale_tokens'>[], Error>({
    queryKey: [QueryKeys.ALL_COINS],
    queryFn: async () => {
      const { data, error } = await supabase.from(TableNames.PRESALE_TOKENS).select('*')
      // .order("TOP_OF_THE_HILL", { ascending: false })
      // .order("market_cap", { ascending: false });

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}
