export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      crypto_payments: {
        Row: {
          amount: number | null
          created_at: string | null
          crypto_amount: number | null
          crypto_currency: string | null
          currency: string | null
          id: string
          session_id: string
          status: string
          transaction_id: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          crypto_amount?: number | null
          crypto_currency?: string | null
          currency?: string | null
          id?: string
          session_id: string
          status: string
          transaction_id?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          crypto_amount?: number | null
          crypto_currency?: string | null
          currency?: string | null
          id?: string
          session_id?: string
          status?: string
          transaction_id?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      listed_tokens: {
        Row: {
          id: number
          image_url: string | null
          liquidity_usd: number | null
          market_cap: number | null
          pair_address: string | null
          price_usd: number | null
          socials: Json | null
          token_address: string | null
          token_name: string | null
          token_symbol: string | null
          TOP_OF_THE_HILL: boolean | null
          volume_24h: number | null
        }
        Insert: {
          id: number
          image_url?: string | null
          liquidity_usd?: number | null
          market_cap?: number | null
          pair_address?: string | null
          price_usd?: number | null
          socials?: Json | null
          token_address?: string | null
          token_name?: string | null
          token_symbol?: string | null
          TOP_OF_THE_HILL?: boolean | null
          volume_24h?: number | null
        }
        Update: {
          id?: number
          image_url?: string | null
          liquidity_usd?: number | null
          market_cap?: number | null
          pair_address?: string | null
          price_usd?: number | null
          socials?: Json | null
          token_address?: string | null
          token_name?: string | null
          token_symbol?: string | null
          TOP_OF_THE_HILL?: boolean | null
          volume_24h?: number | null
        }
        Relationships: []
      }
      presale_tokens: {
        Row: {
          accummulated_fund: number | null
          created_at: string | null
          description: string | null
          graduation_target: number
          id: string
          image_url: string | null
          name: string
          symbol: string
          updated_at: string | null
          user_id: string
          volume_24h: number | null
        }
        Insert: {
          accummulated_fund?: number | null
          created_at?: string | null
          description?: string | null
          graduation_target: number
          id?: string
          image_url?: string | null
          name: string
          symbol: string
          updated_at?: string | null
          user_id: string
          volume_24h?: number | null
        }
        Update: {
          accummulated_fund?: number | null
          created_at?: string | null
          description?: string | null
          graduation_target?: number
          id?: string
          image_url?: string | null
          name?: string
          symbol?: string
          updated_at?: string | null
          user_id?: string
          volume_24h?: number | null
        }
        Relationships: []
      }
      token_purchases: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          presale_token_id: string
          status: string
          tokens_amount: number
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          presale_token_id: string
          status?: string
          tokens_amount: number
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          presale_token_id?: string
          status?: string
          tokens_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_purchases_presale_token_id_fkey"
            columns: ["presale_token_id"]
            isOneToOne: false
            referencedRelation: "presale_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          created_at: string | null
          decimals: number
          id: string
          initial_supply: number
          mint_address: string
          name: string
          presale_token_id: string | null
          symbol: string
          transaction_signature: string
        }
        Insert: {
          created_at?: string | null
          decimals: number
          id?: string
          initial_supply: number
          mint_address: string
          name: string
          presale_token_id?: string | null
          symbol: string
          transaction_signature: string
        }
        Update: {
          created_at?: string | null
          decimals?: number
          id?: string
          initial_supply?: number
          mint_address?: string
          name?: string
          presale_token_id?: string | null
          symbol?: string
          transaction_signature?: string
        }
        Relationships: [
          {
            foreignKeyName: "tokens_presale_token_id_fkey"
            columns: ["presale_token_id"]
            isOneToOne: false
            referencedRelation: "presale_tokens"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users_amounts: {
        Row: {
          created_at: string | null
          current_amount: number | null
          token_mint: string
          total_deposits: number
          total_withdrawals: number
          updated_at: string | null
          user_address: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          token_mint: string
          total_deposits?: number
          total_withdrawals?: number
          updated_at?: string | null
          user_address: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          token_mint?: string
          total_deposits?: number
          total_withdrawals?: number
          updated_at?: string | null
          user_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      purchase_tokens: {
        Args: {
          p_user_id: string
          p_amount: number
          p_presale_token_id: string
        }
        Returns: Json
      }
      update_solana_amount: {
        Args: {
          p_user_address: string
          p_token_mint: string
          p_amount: number
          p_is_deposit: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

