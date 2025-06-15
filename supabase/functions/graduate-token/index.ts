import bs58 from 'https://cdn.skypack.dev/bs58'
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createMint } from 'npm:@solana/spl-token'
import { Connection, Keypair, PublicKey } from 'npm:@solana/web3.js'
import { createClient } from 'npm:@supabase/supabase-js'
import { mintTo } from 'npm:@solana/spl-token'
import { TOKEN_PROGRAM_ID } from 'npm:@solana/spl-token'
import { getOrCreateAssociatedTokenAccount } from 'npm:@solana/spl-token'
import { getAccount } from 'npm:@solana/spl-token'

// Supabase configuration (using environment variables)
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Solana configuration (using environment variables)
const connection = new Connection(Deno.env.get('SOLANA_RPC_URL') || '', {
  commitment: 'confirmed',
})
const privateKeyBase58 = Deno.env.get('SOLANA_PRIVATE_KEY') || ''

// Token parameters
const DECIMALS = 9
const INITIAL_SUPPLY = 1000000000 // 1 billion tokens with 9 decimals

async function createSPLToken(presaleTokenId: string): Promise<{ mintAddress: string; signature: string }> {
  // 1. Fetch Presale Token Data from Supabase
  // const { data: presaleToken, error: supabaseError } = await supabase
  //   .from('presale_tokens')
  //   .select('*')
  //   .eq('id', presaleTokenId)
  //   .single()
  console.log('-----------------------------')
  console.log('supabaseUrl:', supabaseUrl, supabaseAnonKey)

  // Create admin supabase client for secure operations
  const adminSupabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  console.log(`Fetching presale token data... ${presaleTokenId}`)
  const { data: presaleToken, error: supabaseError } = await adminSupabase
    .from('presale_tokens')
    .select('*')
    .eq('id', presaleTokenId)
    .single()

  console.log('-----------------------------')

  if (supabaseError) {
    console.error('Supabase error fetching presale token:', supabaseError)
    throw new Error('Failed to fetch presale token data')
  }

  if (!presaleToken) {
    console.log('Presale token not found')
    throw new Error('Presale token not found')
  }

  // 2. Wallet Setup
  const mintAuthority = Keypair.fromSecretKey(Uint8Array.from(bs58.decode(privateKeyBase58)))

  // 3. Create SPL Token (Mint) - Using the imported utility function
  console.log('Creating token mint...')
  const mint = await createMint(
    connection,
    mintAuthority,
    mintAuthority.publicKey,
    null,
    DECIMALS,
    undefined,
    undefined,
    TOKEN_PROGRAM_ID
  )
  console.log('Token mint created:', mint.toBase58())

  const mintAddress = mint.toBase58()
  console.log('Mint address:', mintAddress)

  console.log('Creating token account...')
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, mintAuthority, mint, mintAuthority.publicKey)
  console.log('Token account created:', tokenAccount.address.toBase58())

  // Mint tokens to the token account
  console.log('Minting tokens...')
  const mintTx = await mintTo(connection, mintAuthority, mint, tokenAccount.address, mintAuthority, INITIAL_SUPPLY)
  console.log('Tokens minted:', mintTx)

  // Get updated token account info
  const tokenAccountInfo = await getAccount(connection, tokenAccount.address)
  console.log('Token balance:', tokenAccountInfo.amount.toString())

  // 4. Mint Initial Supply

  // const mintSignature = await connection.sendRawTransaction(mintTx.instructions[0])
  // await connection.confirmTransaction(mintSignature)
  // console.log(3)

  // 5. Save to Supabase (tokens table)
  const { error: tokenSupabaseError } = await supabase
    .from('tokens') // Replace with your tokens table name
    .insert([
      {
        mint_address: mintAddress,
        name: presaleToken.name,
        symbol: presaleToken.symbol,
        decimals: DECIMALS,
        initial_supply: INITIAL_SUPPLY,
        presale_token_id: presaleTokenId, // Link to presale token
        transaction_signature: mintTx,
      },
    ])
  console.log(4)

  if (tokenSupabaseError) {
    console.log(tokenSupabaseError)
    throw new Error('Failed to save token data to Supabase', tokenSupabaseError)
  }

  return { mintAddress: mint.toBase58(), signature: mintTx }
}

Deno.serve(async (req: Request) => {
  try {
    const { presaleTokenId } = await req.json()

    if (!presaleTokenId) {
      return new Response(JSON.stringify({ error: 'presaleTokenId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const result = await createSPLToken(presaleTokenId)

    return new Response(JSON.stringify(result), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
