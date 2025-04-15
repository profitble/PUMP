import { useQuery } from '@tanstack/react-query'

import { supabase } from '@/utils'

import { TableNames } from '@/types'
import { Tables } from '@/types/database.types'

export function useUnpairedTokens() {
  return useQuery<Tables<'presale_tokens'>[]>({
    queryKey: ['unpairedTokens'],
    queryFn: async () => {
      const { data, error } = await supabase.from(TableNames.PRESALE_TOKENS).select('*').is('pair_address', null)

      if (error) throw error
      return data || []
    },
  })
}
