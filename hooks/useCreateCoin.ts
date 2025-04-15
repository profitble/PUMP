import { Alert } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { customHaptics, supabase } from '@/utils'
import { QueryKeys } from '@/types'
import { Tables } from '@/types/database.types'

/** Flag to toggle local development endpoint */
const PING_LOCAL = false

/** Request parameters for creating a new token */
type CreateTokenRequest = {
  userId: string
  name: string
  ticker: string
  description: string
  image: string // Base64 encoded image string
  twitter?: string
  telegram?: string
  website?: string
  walletGenerated: {
    privateKey: string
    publicKey: string
    apiKey: string
  }
}

/** Response format from token creation */
type CreateTokenResponse = {
  success: boolean
  data: Tables<'presale_tokens'>
}

/**
 * Makes API request to create a new token
 * @param params Token creation parameters
 * @returns Response with created token data
 */
const createTokenRequest = async (params: CreateTokenRequest): Promise<CreateTokenResponse> => {
  try {
    console.log('[Token Creation] Starting token creation process')

    // Production endpoint using Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-token', {
      body: params,
    })

    if (error) {
      throw error
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error('[Token Creation] Error:', error)
    throw error
  }
}

/**
 * Hook for creating new tokens
 * Handles mutation state, cache updates, and error handling
 * @returns Mutation object with create token function and state
 */
export const useCreateToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTokenRequest,
    onSuccess: (response) => {
      customHaptics.success()

      // Update cache with new token
      const previousData = queryClient.getQueryData<Tables<'presale_tokens'>[]>([QueryKeys.NEW_TOKEN]) || []
      queryClient.setQueryData([QueryKeys.NEW_TOKEN], [...previousData, response.data])
    },
    onError: (error: any) => {
      console.error('Token creation error:', error)
      let errorMessage = 'Error creating token. Please try again.'
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error instanceof Error) {
        errorMessage = error.message
      }
      Alert.alert('Creation Error', `${errorMessage}\n\nIf the error persists, please contact us.`)
    },
  })
}

/**
 * Hook for accessing user's tokens
 * Returns empty array initially and must be manually enabled
 * @returns Query object for user tokens
 */
export const useUserTokens = () => {
  return useQuery<Tables<'presale_tokens'>[]>({
    queryKey: [QueryKeys.NEW_TOKEN],
    queryFn: () => [],
    staleTime: Infinity,
    enabled: false,
  })
}
