// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface PurchaseRequest {
  presaleTokenId: string
  amount: number
}

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  success: true
  transaction: {
    purchaseId: string
    newBalance: number
    tokenAmount: number
    accumulatedFund: number
  }
}

Deno.serve(async (req) => {
  try {
    // Get the current user from the request
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: req.headers.get('Authorization')! } },
    })

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' } as ErrorResponse), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get request body
    const { presaleTokenId, amount }: PurchaseRequest = await req.json()

    // Validate input
    if (!presaleTokenId || !amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Invalid purchase parameters' } as ErrorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create admin supabase client for secure operations
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user's current wallet balance
    const { data: walletData, error: walletError } = await adminSupabase
      .from('user_wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single()

    if (walletError || !walletData) {
      return new Response(JSON.stringify({ error: 'User wallet not found' } as ErrorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if user has enough balance
    if (walletData.balance < amount) {
      return new Response(JSON.stringify({ error: 'Insufficient balance' } as ErrorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get presale token data
    const { data: tokenData, error: tokenError } = await adminSupabase
      .from('presale_tokens')
      .select('*')
      .eq('id', presaleTokenId)
      .single()

    if (tokenError || !tokenData) {
      return new Response(JSON.stringify({ error: 'Presale token not found' } as ErrorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if amount is not bigger than remaining
    if (amount + tokenData.accummulated_fund > tokenData.graduation_target) {
      return new Response(JSON.stringify({ error: 'Not enough presale token left' } as ErrorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Start transaction

    // 1. Update user wallet balance
    const { error: updateWalletError } = await adminSupabase
      .from('user_wallets')
      .update({
        balance: walletData.balance - amount,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateWalletError) {
      throw new Error('Failed to update wallet balance')
    }

    // 2. Update presale token accumulated fund
    const { error: updateTokenError } = await adminSupabase
      .from('presale_tokens')
      .update({
        accummulated_fund: tokenData.accummulated_fund + amount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', presaleTokenId)

    if (updateTokenError) {
      // If there's an error, try to rollback wallet update
      await adminSupabase
        .from('user_wallets')
        .update({
          balance: walletData.balance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      throw new Error('Failed to update presale token')
    }

    // 3. Record the purchase
    const { data: purchaseData, error: purchaseError } = await adminSupabase
      .from('token_purchases')
      .insert({
        user_id: user.id,
        presale_token_id: presaleTokenId,
        amount: amount,
        tokens_amount: amount, // Using 1:1 ratio for simplicity, adjust as needed
      })
      .select()
      .single()

    if (purchaseError) {
      // If there's an error, try to rollback previous updates
      await adminSupabase
        .from('user_wallets')
        .update({
          balance: walletData.balance,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)

      await adminSupabase
        .from('presale_tokens')
        .update({
          accummulated_fund: tokenData.accummulated_fund,
          updated_at: new Date().toISOString(),
        })
        .eq('id', presaleTokenId)

      throw new Error('Failed to record purchase')
    }

    const response: SuccessResponse = {
      success: true,
      transaction: {
        purchaseId: purchaseData.id,
        newBalance: walletData.balance - amount,
        tokenAmount: amount,
        accumulatedFund: tokenData.accummulated_fund + amount,
      },
    }

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(JSON.stringify({ error: errorMessage } as ErrorResponse), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
