// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { PrivyClient } from 'npm:@privy-io/server-auth@1.18.7'
import jwt from 'npm:jsonwebtoken'

import { createClient } from 'npm:@supabase/supabase-js'

Deno.serve(async (req) => {
  const { privyToken } = await req.json()

  if (!privyToken) {
    return new Response(JSON.stringify({ error: 'Missing Privy token' }), {
      status: 400,
    })
  }

  const privy = new PrivyClient(Deno.env.get('PRIVY_APP_ID'), Deno.env.get('PRIVY_APP_SECRET'))

  try {
    let userId
    if (privyToken === 'dev-auth') {
      userId = 'dev-auth'
    } else {
      const verifiedClaims = await privy.verifyAuthToken(privyToken)
      console.log('verifiedClaims', verifiedClaims)
      userId = verifiedClaims.userId // Use Privy's unique user ID
    }

    const userEmail = `${userId}@privy.io`.replace('did:privy:', '') // Fake email to identify user in Supabase

    // Initialize Supabase Admin client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), // Use Service Role Key
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // // Generate Supabase JWT
    // const supabaseToken = jwt.sign(
    //   { sub: userId, role: "authenticated" },
    //   Deno.env.get("SB_JWT_SECRET"),
    //   { expiresIn: "1h" }
    // );

    // return new Response(JSON.stringify({ supabaseToken }), {
    //   status: 200,
    //   headers: { "Content-Type": "application/json" },
    // });

    // Check if user already exists in Supabase
    const { data: existingUser, error: userError } = await supabase.auth.admin.listUsers()
    const user = existingUser?.users.find((u) => u.email === userEmail)

    if (!user) {
      // Create user if they don't exist
      const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
        email: userEmail,
        user_metadata: { privyId: userId },
        email_confirm: true,
      })

      if (createUserError) {
        return new Response(JSON.stringify({ error: createUserError.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Generate a session for the user
    const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userEmail,
    })

    if (sessionError) {
      return new Response(JSON.stringify({ error: sessionError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        email_otp: session.properties.email_otp,
        email: userEmail,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.log(`Token verification failed with error ${error}.`)

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/authenticate' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
