import axios from 'axios'

export const conversionRate = async () => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd`)
  return response.data
}
