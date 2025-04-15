export enum QueryKeys {
  NEW_TOKEN = 'new_token',
  ALL_COINS = 'all_coins',
  TRENDING_PRESALES = 'trending_presales',
}

export enum ChannelNames {
  NEW_TOKENS = 'new_tokens',
}

export enum TableNames {
  TOKENS = 'listed_tokens',
  CREATED_TOKENS = 'created_tokens',
  PRESALE_TOKENS = 'presale_tokens',
}

export type FontWeight = 'extralight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black'

export type FontStyle = 'normal' | 'italic'

export type WebSocketMessage = {
  solAmount: number
  mint: string
  traderPublicKey?: string
  maker?: string
  market?: string
  backgroundColor?: string
  imageColor?: string
  textDetailsColor?: string
  textColor?: string
}

export type SpacerInputType = {
  horizontal?: boolean
  size: number
}
