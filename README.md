# pump.fun Clone

![pump.fun Mobile Implementation](/assets/images/shots.png)

A high-performance mobile implementation of the pump.fun protocol built with React Native and Expo. This app enables users to create, discover, and trade meme tokens with real-time price tracking and decentralized token creation capabilities.

## System Architecture

```mermaid
graph TB
    subgraph "Mobile App"
        A[React Native Client]
        B[Expo Router]
        C[React Query State]
        D[WebSocket Manager]
    end
    
    subgraph "Authentication"
        E[Privy Web3 Auth]
        F[Apple Sign-In]
        G[Wallet Connection]
    end
    
    subgraph "Backend Services"
        H[Supabase Database]
        I[Edge Functions]
        J[Real-time Subscriptions]
        K[File Storage]
    end
    
    subgraph "Blockchain"
        L[Solana Network]
        M[Token Programs]
        N[Price Oracles]
    end
    
    subgraph "External APIs"
        O[MoonPay SDK]
        P[LaunchDarkly]
        Q[Haptic Feedback]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    C --> H
    D --> J
    I --> H
    I --> L
    G --> L
    M --> L
    N --> L
    A --> O
    A --> P
    A --> Q
    
    style A fill:#e1f5fe
    style H fill:#f3e5f5
    style L fill:#fff3e0
    style E fill:#e8f5e8
```

## Technical Implementation

### Protocol Stack
- **Blockchain Layer:** Solana blockchain integration
- **Smart Contracts:** Solana programs
- **State Management:** React Query with real-time WebSocket subscriptions
- **Database:** Supabase (PostgreSQL) with real-time capabilities
- **Mobile Framework:** React Native (Expo 52) with App Router
- **Authentication:** Privy Web3 auth + Apple Sign-In
- **Styling:** NativeWind (Tailwind CSS for React Native)

### Core Features
- **Token Creation:** Create new meme tokens with custom branding
- **Token Discovery:** Browse trending and presale tokens with real-time updates
- **Trading:** Purchase tokens in presale phase with graduation to DEX
- **Real-time Updates:** WebSocket integration for live price feeds
- **Wallet Integration:** Solana wallet management with Privy authentication
- **Charts & Analytics:** Token price visualization and metrics

```typescript
interface TokenData {
  name: string;
  symbol: string;
  imageUrl: string;
  description: string;
  
  // Trading data
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  isPresale: boolean;
  
  // Protocol extensions
  tradingEnabled: boolean;
  graduationThreshold: number;
}

interface WebSocketMessage {
  solAmount: number;
  mint: string;
  traderPublicKey?: string;
  maker?: string;
  market?: string;
}
```

### User Journey Flow

```mermaid
flowchart TD
    A[App Launch] --> B{User Authenticated?}
    B -->|No| C[Sign Up Screen]
    B -->|Yes| D[Home - Token Discovery]
    
    C --> E[Choose Auth Method]
    E --> F[Privy Web3 Auth]
    E --> G[Apple Sign-In]
    F --> H[Connect Wallet]
    G --> H
    H --> D
    
    D --> I[Browse Tokens]
    D --> J[Create New Token]
    D --> K[View Profile]
    
    I --> L[Filter: Presale/Graduated]
    L --> M[Select Token]
    M --> N[Token Details]
    N --> O[Purchase Token]
    N --> P[View Charts]
    
    J --> Q[Upload Image]
    Q --> R[Set Parameters]
    R --> S[Deploy Token]
    S --> T[Presale Begins]
    
    O --> U[Confirm Purchase]
    U --> V[Transaction Complete]
    V --> W[Real-time Updates]
    
    T --> X[Track Progress]
    X --> Y{Graduation Threshold?}
    Y -->|No| X
    Y -->|Yes| Z[Graduate to DEX]
    
    style A fill:#e8f5e8
    style D fill:#e3f2fd
    style S fill:#fff3e0
    style Z fill:#f3e5f5
```

### Performance Metrics
| Operation | Latency | Throughput |
|-----------|---------|------------|
| Price Updates | <100ms | 10/sec |
| Token Creation | ~15sec | 5/min |
| Order Execution | <2sec | 30/min |

## Development Setup

### 🔑 Key Commands
- **Dev Client Build:** `npm run dev-client` - Create dev-client build for physical device
- **Development Server:** `npm run dev` - Serve code for existing dev-client  
- **Install Dependencies:** `npm install`

### 🌲 Environment Variables
- `EXPO_PUBLIC_APP_VARIANT="development"` (for local development)
- No environment variables required for production app builds

### 🏃 Running Locally
1. Navigate to root directory
2. `npm install`
3. `npm run dev-client` to create dev-client build
4. Scan QR code to open on device
5. For subsequent runs (if no native changes): `npm run dev`

### 🧑‍💻 Supabase Edge Functions (Local)
1. Open Docker app
2. Navigate to `supabase/functions` and create `.env`:
   ```
   IS_LOCAL=true
   URL="https://ebaqrryrinmxanbidylq.supabase.co"
   SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
   ```
3. Run `supabase start` from `supabase/` directory
4. Run `supabase functions serve`

## Technical Architecture

### Mobile Client
- **Framework:** Expo App Router (React Native 0.76.7)
- **State Layer:** React Query (@tanstack/react-query) with WebSocket integration
- **UI Components:** Custom haptic-enabled components with NativeWind styling
- **Authentication:** Privy Web3 authentication + Apple Sign-In
- **Navigation:** File-based routing with Expo Router

### Backend Infrastructure
- **Core:** Supabase with Edge Functions (Deno runtime)
- **Database:** PostgreSQL with real-time subscriptions via WebSocket
- **Blockchain:** Solana Web3.js integration
- **Features:** LaunchDarkly feature flags
- **Payments:** MoonPay SDK integration

### App Organization

```mermaid
graph TB
    subgraph "App Routes"
        A[_layout.tsx]
        B[signup.tsx]
        C[onboard.tsx]
        
        subgraph "Auth Pages"
            D[coinDetails.tsx]
            E[tabs/coin]
            F[tabs/profile]
            G[tabs/add.tsx]
        end
    end
    
    subgraph "Components"
        H[common/]
        I[ui/]
        J[home/]
        K[tokens/]
        L[profile/]
    end
    
    subgraph "Backend"
        M[supabase.ts]
        N[websocket.ts]
        O[edge functions]
    end
    
    A --> B
    A --> C
    A --> D
    E --> H
    F --> H
    G --> H
    H --> M
    H --> N
    
    style A fill:#e3f2fd
    style H fill:#f1f8e9
    style M fill:#fff8e1
```

**Directory Structure:**
```
app/                    # Expo Router pages
├── _layout.tsx        # Root layout with providers
├── signup.tsx         # User onboarding
├── (auth)/           # Authenticated routes
│   ├── [coinDetails].tsx  # Token detail screen
│   └── (tabs)/       # Tab navigation
│       ├── (coin)/   # Token discovery & trading
│       ├── (profile)/ # User profile
│       └── add.tsx   # Create new token

components/            # Reusable UI components
├── common/           # Business logic components
├── ui/              # Base UI components
└── (feature)/       # Feature-specific components

utils/               # Utilities & integrations
├── supabase.ts     # Database client
├── websocket.ts    # Real-time connections
└── storage.ts      # Local storage

supabase/           # Backend functions
├── functions/      # Edge functions
└── migrations/     # Database schema
```

### ⚙️ Reusable Components
- **ParentView:** Main view wrapper for pages
- **CText:** Standardized text with custom fonts
- **CTextInput:** Consistent text input styling
- **Icon:** Lucide icons integration
- **Spacer:** Layout spacing utility
- **CustomHaptics:** Consistent haptic feedback

## Protocol Specifications

### Token Creation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Mobile App
    participant S as Supabase
    participant E as Edge Functions
    participant B as Solana Blockchain
    participant D as DEX
    
    U->>A: Initiate token creation
    U->>A: Upload image & set parameters
    A->>S: Store token metadata
    A->>E: Validate & process creation
    E->>B: Deploy Solana token program
    B-->>E: Return token address
    E->>S: Update token status
    S-->>A: Real-time status update
    A-->>U: Token created - Presale active
    
    Note over A,S: Presale Phase
    U->>A: Users purchase tokens
    A->>E: Process purchases
    E->>S: Track purchase volume
    
    Note over S,D: Graduation Threshold Met
    S->>E: Trigger graduation
    E->>D: Create DEX liquidity pair
    D-->>E: Confirm listing
    E->>S: Update to "graduated"
    S-->>A: Real-time graduation event
    A-->>U: Token now trading on DEX
```

### Real-time Features

```mermaid
graph LR
    subgraph "Data Sources"
        A[Solana Network]
        B[User Transactions]
        C[Price Oracles]
        D[DEX Events]
    end
    
    subgraph "Processing Layer"
        E[Edge Functions]
        F[Event Listeners]
        G[Price Calculators]
    end
    
    subgraph "Supabase Real-time"
        H[Database Changes]
        I[WebSocket Server]
        J[Channel Subscriptions]
    end
    
    subgraph "Mobile Client"
        K[React Query Cache]
        L[WebSocket Manager]
        M[Live Components]
        N[Toast Notifications]
    end
    
    A --> F
    B --> E
    C --> G
    D --> F
    
    E --> H
    F --> H
    G --> H
    
    H --> I
    I --> J
    J --> L
    
    L --> K
    L --> M
    L --> N
    
    style I fill:#e1f5fe
    style M fill:#f3e5f5
    style A fill:#fff3e0
```

**Features:**
- WebSocket subscriptions for live token updates
- Real-time price feeds via Supabase realtime
- Live purchase notifications and toasts
- Token discovery with instant updates

*Made with ❤️ and lots of boba 🧋*