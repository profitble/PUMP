import { crypto } from 'https://deno.land/std@0.217.0/crypto/mod.ts'
import bs58 from 'npm:bs58@5.0.0'
import { TokensInsert } from '../types.ts'

interface MetadataResponse {
  metadata: {
    name: string
    symbol: string
    description: string
    image: string
  }
  metadataUri: string
}

type CreateTokenRequest = {
  userId: string
  name: string
  ticker: string
  description: string
  image: string
  twitter?: string
  telegram?: string
  website?: string
}

function processImageData(base64Image: string): string {
  console.log(`[Token Creation] Processing image data...`)

  let imageBase64 = base64Image
  if (!imageBase64.startsWith('data:')) {
    console.log(`[Token Creation] Adding data URI prefix to image...`)
    imageBase64 = `data:image/png;base64,${imageBase64}`
  }

  console.log(`[Token Creation] Validating image format...`)
  const [header] = imageBase64.split(',')
  if (!header.includes('image/')) {
    throw new Error('Invalid image format')
  }

  // Convert to binary and back to validate base64
  console.log(`[Token Creation] Converting to binary for validation...`)
  try {
    const imageBytes = Uint8Array.from(atob(imageBase64.split(',')[1]), (c) => c.charCodeAt(0))
    const blob = new Blob([imageBytes], {
      type: header.split(':')[1].split(';')[0],
    })
    console.log(`[Token Creation] Image size: ${(blob.size / 1024 / 1024).toFixed(2)}MB`)
    if (blob.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error('Image too large (max 5MB)')
    }
    return imageBase64
  } catch (error) {
    console.error('[Token Creation] Error processing image data:', error)
    throw new Error('Invalid image data')
  }
}

// Function to generate ed25519 keypair bytes (for future Solana integration)
async function generateEd25519Keypair(): Promise<{
  publicKey: Uint8Array
  secretKey: Uint8Array
}> {
  console.log(`[Token Creation] Generating ed25519 keypair...`)
  const keyPair = await crypto.subtle.generateKey({ name: 'Ed25519', namedCurve: 'Ed25519' }, true, ['sign', 'verify'])

  console.log(`[Token Creation] Exporting keypair to JWK format...`)
  const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
  const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey)

  console.log(`[Token Creation] Converting JWK to raw bytes...`)
  const publicKeyBytes = base64UrlToUint8Array(publicKeyJwk.x!)
  const privateKeyBytes = base64UrlToUint8Array(privateKeyJwk.d!)

  // Combine private and public key bytes in Solana format
  console.log(`[Token Creation] Combining keys in Solana format...`)
  const secretKey = new Uint8Array(64)
  secretKey.set(privateKeyBytes)
  secretKey.set(publicKeyBytes, 32)

  return { publicKey: publicKeyBytes, secretKey }
}

// Helper to convert base64url to Uint8Array
function base64UrlToUint8Array(base64url: string): Uint8Array {
  console.log(`[Token Creation] Converting base64url to Uint8Array...`)
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  const binStr = atob(base64)
  const arr = new Uint8Array(binStr.length)
  for (let i = 0; i < binStr.length; i++) {
    arr[i] = binStr.charCodeAt(i)
  }
  return arr
}

// Minimal Keypair implementation for Solana
class SolanaKeypair {
  secretKey: Uint8Array
  publicKey: Uint8Array

  constructor(secretKey: Uint8Array, publicKey: Uint8Array) {
    console.log(`[Token Creation] Creating new SolanaKeypair instance...`)
    this.secretKey = secretKey
    this.publicKey = publicKey
  }

  static async generate(): Promise<SolanaKeypair> {
    console.log(`[Token Creation] Generating new SolanaKeypair...`)
    const { publicKey, secretKey } = await generateEd25519Keypair()
    return new SolanaKeypair(secretKey, publicKey)
  }

  toString(): string {
    console.log(`[Token Creation] Converting public key to base58 string...`)
    return bs58.encode(this.publicKey)
  }
}

export async function createToken(request: CreateTokenRequest) {
  try {
    console.log(`[Token Creation] Starting token creation process...`)
    console.log(`[Token Creation] Request details: Name=${request.name}, Ticker=${request.ticker}`)

    // Process and validate image
    console.log(`[Token Creation] Starting image processing...`)
    const processedImage = processImageData(request.image)
    console.log(`[Token Creation] Image processed successfully`)

    // Generate Solana keypair for future deployment
    console.log(`[Token Creation] Generating Solana keypair...`)
    const keypair = await SolanaKeypair.generate()
    console.log(`[Token Creation] Generated keypair with address: ${keypair.toString()}`)

    // For now, use mock pair address until we implement Solana AMM integration
    const mockPairAddress = `pair_${Math.random().toString(36).substring(7)}`
    console.log(`[Token Creation] Generated mock pair address: ${mockPairAddress}`)

    // Prepare token data for database
    console.log(`[Token Creation] Preparing token data for database...`)
    const tokenData: TokensInsert = {
      id: Math.floor(Math.random() * 1000000000).toString(),
      pair_address: mockPairAddress,
      token_address: keypair.toString(),
      token_name: request.name,
      token_symbol: request.ticker,
      descriptions: request.description,
      image_url: processedImage,
      price_usd: 0,
      volume_24h: 0,
      liquidity_usd: 0,
      market_cap: 0,
      socials: [
        ...(request.twitter ? [{ type: 'twitter', url: request.twitter }] : []),
        ...(request.telegram ? [{ type: 'telegram', url: request.telegram }] : []),
        ...(request.website ? [{ type: 'website', url: request.website }] : []),
      ],
    }

    // TODO: Store keypair.secretKey securely for future deployment
    console.log(`[Token Creation] Token data prepared for ${request.name}`)
    console.log(`[Token Creation] Social links added: ${tokenData.socials?.length || 0}`)
    return tokenData
  } catch (error) {
    console.error('[Token Creation] Error creating token:', error)
    throw error
  }
}
