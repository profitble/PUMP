import { useQuery, useQueryClient } from '@tanstack/react-query'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { supabase } from '@/utils'
import { Tables } from '@/types/database.types'

type PresaleToken = Tables<'presale_tokens'>

export const usePresaleToken = (presaleId: string | undefined) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!presaleId) return

    // Set up realtime subscription
    const channel: RealtimeChannel = supabase
      .channel(`presale_token_${presaleId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presale_tokens',
          filter: `id=eq.${presaleId}`,
        },
        (payload) => {
          // Update cache with new data
          queryClient.setQueryData(['presaleToken', presaleId], payload.new as PresaleToken)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [presaleId, queryClient])

  return useQuery({
    queryKey: ['presaleToken', presaleId],
    queryFn: async () => {
      if (!presaleId) throw new Error('Presale ID is required')

      const { data, error } = await supabase.from('presale_tokens').select('*').eq('id', presaleId).single()

      if (error) throw error
      return data as PresaleToken
    },
    enabled: !!presaleId, // Only run query if presaleId exists
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2,
  })
}
