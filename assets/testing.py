import asyncio
import websockets
import json
import requests
from datetime import datetime

async def subscribe():
    # Load currently live coins
    with open('currently_live_coins.json') as f:
        live_coins = json.load(f)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    }
    response = requests.get('https://frontend-api-v3.pump.fun/coins/for-you',
                          params={'limit': 10, 'offset': 0, 'includeNsfw': 'true'},
                          headers=headers)
    coins = response.json()
    token_ids = [coin['mint'] for coin in coins]
    print(f"Watching tokens: {token_ids}")
    
    uri = "wss://pumpportal.fun/api/data"
    trades = []
    async with websockets.connect(uri) as websocket:
        payload = {
            "method": "subscribeTokenTrade", 
            "keys": token_ids
        }
        await websocket.send(json.dumps(payload))
        
        async for message in websocket:
            data = json.loads(message)
            if data.get('solAmount', 0) > .1:
                # Get buyer name from trader public key
                buyer_name = data.get('traderPublicKey', '')[:4]
                
                # Find matching coin symbol
                symbol = next((coin['symbol'] for coin in live_coins if coin['mint'] == data['mint']), '')
                
                # Extract key data
                trade_data = {
                    'buyer': buyer_name,
                    'amount': data['solAmount'],
                    'token': symbol
                }
                
                trades.append(trade_data)
                print(f"Trade saved: {trade_data}")
                
                with open('trades.json', 'w') as f:
                    json.dump(trades, f, indent=2)

# Run the subscribe function
asyncio.get_event_loop().run_until_complete(subscribe())