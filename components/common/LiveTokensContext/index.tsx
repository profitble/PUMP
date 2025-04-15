import React, { createContext, useCallback, useContext, useState } from 'react'

import { supabase } from '@/utils'

import { useTokenSubscription } from '@/hooks'

import { TableNames } from '@/types'
import { Tables } from '@/types/database.types'

type TokensContextType = {
  tokens: Tables<'presale_tokens'>[]
  addToken: (token: Tables<'presale_tokens'>) => void
  loadInitialTokens: () => Promise<void>
}

const LiveTokensContext = createContext<TokensContextType | undefined>(undefined)

export function LiveTokensProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Tables<'presale_tokens'>[]>([])

  const addToken = useCallback((newToken: Tables<'presale_tokens'>) => {
    console.log('Adding new token:', newToken)
    setTokens((prev) => [...prev, newToken])
  }, [])

  const loadInitialTokens = useCallback(async () => {
    try {
      console.log('Loading initial tokens...')
      const { data, error } = await supabase
        .from(TableNames.PRESALE_TOKENS)
        .select('*')
        .order('volume_24h', { ascending: false })

      if (error) throw error
      console.log('Loaded tokens:', data)
      setTokens(data || [])
    } catch (error) {
      console.error('Error loading tokens:', error)
    }
  }, [])

  // Subscribe to token updates
  useTokenSubscription(addToken)

  return (
    <LiveTokensContext.Provider value={{ tokens, addToken, loadInitialTokens }}>{children}</LiveTokensContext.Provider>
  )
}

export function useLiveTokens() {
  const context = useContext(LiveTokensContext)
  if (!context) {
    throw new Error('useLiveTokens must be used within a LiveTokensContext')
  }
  return context
}
