// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

// Just an example Edge Function that:
// 1. Fetches tokens from "for-you" endpoint
// 2. Connects to wss://pumpportal.fun/api/data
// 3. Subscribes to trades
// 4. Collects any trades where solAmount >= 0.1
// 5. Returns them as JSON after ~5 seconds
//
// Keep in mind that Edge Functions are ephemeral: once you return a response,
// the function execution will stop. This means you can't maintain an open WebSocket
// for real-time streaming inside an Edge Function unless you use a streaming response
// or another approach (like storing results in DB).

interface WebSocketMessage {
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

console.log('Hello from websocket-pumpfun-toast!')

Deno.serve(async (_req) => {
  console.log('Starting websocket-pumpfun-toast function...')

  // 1) Grab coins to determine which tokens to subscribe to
  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  }
  const coinResp = await fetch('https://frontend-api-v3.pump.fun/coins/for-you?limit=10&offset=0&includeNsfw=true', {
    headers,
  })
  const coins = await coinResp.json()
  const tokenIds = coins.map((c: any) => c.mint)
  console.log('Token ids:', tokenIds)

  // 2) Open a WebSocket connection to pumpportal.fun
  console.log('Connecting to wss://pumpportal.fun/api/data...')
  const ws = new WebSocket('wss://pumpportal.fun/api/data')
  const trades: WebSocketMessage[] = []

  // 3) Return a Promise so we can wait a bit for messages
  return new Promise((resolve) => {
    ws.onopen = () => {
      console.log('Connected to pumpportal.fun! Subscribing to tokens...')
      const payload = {
        method: 'subscribeTokenTrade',
        keys: tokenIds,
      }
      ws.send(JSON.stringify(payload))
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('Received WS message:', data)
        if (data.solAmount && data.solAmount >= 0.1) {
          console.log('Trade with solAmount >= 0.1, storing it.')
          trades.push(data)
        }
      } catch (err) {
        console.error('Error parsing WS message:', err)
      }
    }

    ws.onerror = (evt) => {
      console.log('WebSocket error:', evt)
    }

    ws.onclose = (_evt) => {
      console.log('WebSocket closed')
    }

    // Close the connection & respond after 5 seconds
    setTimeout(() => {
      console.log('Closing WebSocket and returning collected trades...')
      ws.close()
      resolve(
        new Response(JSON.stringify(trades), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }, 5000)
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/websocket-pumpfun-toast' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
