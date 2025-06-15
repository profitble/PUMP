// import { supabase } from './supabase';

// type PumpEvent = {
//   token_name: string;
//   token_symbol: string;
//   buyer_name: string;
//   amount: string;
//   timestamp: number;
//   backgroundColor?: string;
//   imageColor?: string;
//   textDetailsColor?: string;
//   textColor?: string;
// }

// const COLORS = [
//   {
//     backgroundColor: "#4F46E5",
//     imageColor: "#F8FAFC",
//     textDetailsColor: "#93C5FD",
//     textColor: "#FFFFFF",
//   },
//   {
//     backgroundColor: "#10B981",
//     imageColor: "#ECFDF5",
//     textDetailsColor: "#005d38",
//     textColor: "#FFFFFF",
//   },
//   {
//     backgroundColor: "#EC4899",
//     imageColor: "#FDF2F8",
//     textDetailsColor: "#ffe800",
//     textColor: "#FFFFFF",
//   },
//   {
//     backgroundColor: "#F59E0B",
//     imageColor: "#FFFBEB",
//     textDetailsColor: "#000000",
//     textColor: "#FCD34D",
//   },
//   {
//     backgroundColor: "#8B5CF6",
//     imageColor: "#F5F3FF",
//     textDetailsColor: "#ffe800",
//     textColor: "#FFFFFF",
//   },
// ];

// type EventCallback = (event: PumpEvent) => void;

// export class PumpWebSocket {
//   private ws: WebSocket | null = null;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000;
//   private eventCallbacks: EventCallback[] = [];
//   private tokenIds: string[] = [];

//   constructor() {
//     this.init();
//   }

//   private async init() {
//     await this.fetchTrendingTokens();
//     this.connect();
//   }

//   private async fetchTrendingTokens() {
//     try {
//       const response = await fetch('https://frontend-api-v3.pump.fun/coins/currently-live?limit=10&offset=0&includeNsfw=true', {
//         headers: {
//           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
//         }
//       });
//       const coins = await response.json();
//       this.tokenIds = coins.map((coin: any) => coin.mint);
//       console.log('🔍 Fetched trending tokens:', this.tokenIds);
//     } catch (error) {
//       console.error('Error fetching trending tokens:', error);
//     }
//   }

//   private connect() {
//     try {
//       this.ws = new WebSocket('wss://pumpportal.fun/api/data');

//       this.ws.onopen = () => {
//         console.log('Connected to PumpPortal WebSocket');
//         this.reconnectAttempts = 0;
//         this.subscribeToTokens();
//       };

//       this.ws.onmessage = async (event) => {
//         try {
//           const data = JSON.parse(event.data);
//           console.log('📥 WebSocket message:', data);

//           // Handle both subscription confirmation and trade data
//           if (data.message === "Successfully subscribed to keys.") {
//             console.log('✅ Successfully subscribed to token trades');
//             return;
//           }

//           // Check if it's a trade event with minimum amount
//           if (data.solAmount >= 0.1) {
//             const pumpEvent = this.formatPumpEvent(data);
//             this.notifyCallbacks(pumpEvent);
//           }
//         } catch (error) {
//           console.error('Error handling WebSocket message:', error);
//         }
//       };

//       this.ws.onclose = () => {
//         console.log('WebSocket connection closed');
//         this.handleReconnect();
//       };

//       this.ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//       };

//     } catch (error) {
//       console.error('Error connecting to WebSocket:', error);
//       this.handleReconnect();
//     }
//   }

//   private subscribeToTokens() {
//     if (this.ws && this.ws.readyState === WebSocket.OPEN && this.tokenIds.length > 0) {
//       const payload = {
//         method: "subscribeTokenTrade",
//         keys: this.tokenIds
//       };
//       console.log('📤 Subscribing with payload:', payload);
//       this.ws.send(JSON.stringify(payload));
//     }
//   }

//   private formatPumpEvent(data: any): PumpEvent {
//     const colors = COLORS[Math.floor(Math.random() * COLORS.length)];
//     return {
//       token_name: data.mint || data.market,
//       token_symbol: "PUMP",
//       buyer_name: (data.traderPublicKey || data.maker || "").slice(0, 4),
//       amount: data.solAmount?.toString() || data.amount?.toString() || "0",
//       timestamp: Date.now(),
//       ...colors
//     };
//   }

//   private handleReconnect() {
//     if (this.reconnectAttempts < this.maxReconnectAttempts) {
//       this.reconnectAttempts++;
//       setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
//     }
//   }

//   public onPumpEvent(callback: EventCallback) {
//     this.eventCallbacks.push(callback);
//   }

//   private notifyCallbacks(event: PumpEvent) {
//     this.eventCallbacks.forEach(callback => callback(event));
//   }

//   public disconnect() {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//     }
//   }
// }

// // Export singleton instance
// export const pumpWebSocket = new PumpWebSocket();
