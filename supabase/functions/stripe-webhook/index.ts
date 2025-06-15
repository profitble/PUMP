import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '')

const TREASURE_WALLET = Deno.env.get('TREASURE_WALLET') || ''

// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }
    const event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret, undefined, cryptoProvider)

    console.log('Event received:', event.type)

    if (event.type === 'crypto.onramp_session.updated') {
      const session = event.data.object as Stripe.CryptoOnrampSession
      console.log('Session status:', session.status)
      if (session.status === 'fulfillment_complete') {
        // Get user_id from metadata
        const userId = session.metadata?.user_id
        if (!userId) {
          throw new Error('No user_id in session metadata')
        }

        // Verify the destination wallet is our treasure wallet
        if (session.transaction_details?.wallet_address !== TREASURE_WALLET) {
          throw new Error('Invalid destination wallet')
        }

        // Insert the payment record
        const { error } = await supabase.from('crypto_payments').insert({
          user_id: userId,
          session_id: session.id,
          status: session.status,
          amount: session.transaction_details?.source_amount,
          currency: session.transaction_details?.source_currency,
          crypto_amount: session.transaction_details?.destination_amount,
          crypto_currency: session.transaction_details?.destination_currency,
          wallet_address: session.transaction_details?.wallet_address,
          transaction_id: session.transaction_details?.transaction_id,
        })

        if (error) {
          console.error('Supabase insert error:', error)
          throw error
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
