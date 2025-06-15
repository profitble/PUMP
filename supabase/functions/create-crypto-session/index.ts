import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function createStripeSession(user) {
  const urlencoded = new URLSearchParams()
  urlencoded.append('wallet_addresses[solana]', Deno.env.get('TREASURE_WALLET'))
  urlencoded.append('source_currency', 'usd')
  urlencoded.append('destination_currency', 'sol')
  urlencoded.append('destination_network', 'solana')
  urlencoded.append('destination_amount', '1')
  urlencoded.append('destination_currencies[0]', 'sol')
  urlencoded.append('destination_networks[0]', 'solana')

  urlencoded.append('metadata[user_id]', user.id)

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('STRIPE_SECRET_KEY')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: urlencoded,
    redirect: 'follow',
  }

  try {
    const response = await fetch('https://api.stripe.com/v1/crypto/onramp_sessions', requestOptions)
    const data = await response.json()
    console.log(data)
    return data
  } catch (e) {
    console.log(e)
    return e
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // AUTH
    const authorization = req.headers.get('Authorization')

    if (!authorization) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authorization } },
    })

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error(userError?.message ?? 'No user found')
    }
    // END AUTH

    const onrampSession = await createStripeSession(user)

    console.log('SESSION', JSON.stringify(onrampSession, null, 2))

    return new Response(JSON.stringify(onrampSession), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
