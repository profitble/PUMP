import { useQuery } from '@tanstack/react-query'

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'

export const useGetSolanaPrice = () => {
  const {
    data = 194,
    error,
    isLoading,
  } = useQuery<number, Error, any>({
    queryKey: ['solanaPrice'],
    queryFn: async () => {
      const response = await fetch(COINGECKO_API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch Solana price')
      }
      const json = await response.json()
      return json.solana.usd // Directly return the price as a number
    },
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 30000, // Auto-refetch every 30 seconds
  })

  return { price: data, error, isLoading } // Return the price directly
}
