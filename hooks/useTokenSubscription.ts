import { useEffect } from 'react'

import { supabase } from '@/utils'

import { ChannelNames } from '@/types'
import { Tables } from '@/types/database.types'

export function useTokenSubscription(onNewToken: (token: Tables<'presale_tokens'>) => void) {
  useEffect(() => {
    const channel = supabase
      .channel(ChannelNames.NEW_TOKENS)
      .on('broadcast', { event: 'token_created' }, (payload) => {
        console.log('Received new token:', payload)
        onNewToken(payload.payload as Tables<'presale_tokens'>)
      })
      .subscribe((status) => {
        console.log('Subscription status:', status)
      })

    return () => {
      channel.unsubscribe()
    }
  }, [onNewToken])
}
