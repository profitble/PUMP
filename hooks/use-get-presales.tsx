import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils'

import { QueryKeys, TableNames } from '@/types'
import { Tables } from '@/types/database.types'

export const useGetPresales = () => {
  return useQuery<Tables<'presale_tokens'>[], Error>({
    queryKey: [QueryKeys.TRENDING_PRESALES],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TableNames.PRESALE_TOKENS)
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}
