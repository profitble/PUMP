import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { ChannelNames, TableNames } from '../types.ts'
import { createToken } from './createToken.ts'

type CreateTokenRequest = {
  userId: string
  name: string
  ticker: string
  description: string
  image: string
  walletGenerated: {
    privateKey: string
    publicKey: string
    apiKey: string
  }
}

Deno.serve(async (req) => {
  try {
    const requestData = (await req.json()) as CreateTokenRequest

    const PUMP_API_KEY = Deno.env.get('PUMP_API_KEY') // TODO: remove this since API key changes per wallet

    const isLocal = Deno.env.get('IS_LOCAL')
    const supabaseUrl = isLocal ? Deno.env.get('URL') : Deno.env.get('SUPABASE_URL')
    const supabaseKey = isLocal ? Deno.env.get('SERVICE_ROLE_KEY') : Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')

    if (!PUMP_API_KEY) {
      throw new Error('PUMP_API_KEY environment variable is not set')
    }

    if (!requestData.userId || !requestData.name || !requestData.description || !requestData.image) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: userId, name, description, and image are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const tokenData = await createToken(requestData, PUMP_API_KEY)

    // check if token was created successfully
    if (!tokenData.token_address) {
      return new Response(
        JSON.stringify({
          error: 'Failed to create token',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Add this after the tokenData is created
    const createdTokenData = {
      token_address: tokenData.token_address,
      token_name: tokenData.token_name,
      token_symbol: tokenData.token_symbol,
      descriptions: tokenData.descriptions,
      walletGenerated: requestData.walletGenerated,
    }

    // Insert into created_tokens table
    const { data: createdToken, error: createdTokenError } = await supabase
      .from(TableNames.CREATED_TOKENS)
      .insert([createdTokenData])
      .select()
      .single()

    if (createdTokenError) {
      throw new Error(`Database error: ${createdTokenError.message}`)
    }

    // Save the token to the database
    const { data: insertedToken, error } = await supabase
      .from(TableNames.PRESALE_TOKENS)
      .insert([tokenData])
      .select()
      .single()

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    if (!insertedToken) {
      throw new Error(`Database error: inserted token is null`)
    }

    // broadcast token to real-time channel after successful database insert
    await supabase.channel(ChannelNames.NEW_TOKENS).send({
      type: 'broadcast',
      event: 'token_created',
      payload: insertedToken,
    })

    return new Response(JSON.stringify({ success: true, data: tokenData }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing request:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to create token',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
