  -- Add the column
  alter table auth.users 
  add column solana_address text;
  
-- Create users_amounts table optimized for Solana
CREATE TABLE "public"."users_amounts" (
    "user_address" TEXT NOT NULL,         -- Solana wallet address
    "token_mint" TEXT NOT NULL,           -- SPL token mint address
    "total_deposits" NUMERIC(20,9) NOT NULL DEFAULT 0 CHECK (total_deposits >= 0),
    "total_withdrawals" NUMERIC(20,9) NOT NULL DEFAULT 0 CHECK (total_withdrawals >= 0),
    "current_amount" NUMERIC(20,9) 
        GENERATED ALWAYS AS (total_deposits - total_withdrawals) STORED,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY ("user_address", "token_mint")
);

-- Create index for efficient Solana queries
CREATE INDEX idx_user_token ON users_amounts (user_address, token_mint);

-- Add RLS policies
ALTER TABLE "public"."users_amounts" ENABLE ROW LEVEL SECURITY;

-- Create restrictive policies for Solana wallets
CREATE POLICY "Users can view their own amounts"
    ON "public"."users_amounts"
    FOR SELECT
    TO authenticated
    USING (auth.uid() = (SELECT id FROM auth.users WHERE solana_address = user_address));

-- Create secure update function for Solana transactions
CREATE OR REPLACE FUNCTION update_solana_amount(
    p_user_address TEXT,
    p_token_mint TEXT,
    p_amount NUMERIC(20,9),
    p_is_deposit BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.users_amounts (
        user_address,
        token_mint,
        total_deposits,
        total_withdrawals
    )
    VALUES (
        p_user_address,
        p_token_mint,
        CASE WHEN p_is_deposit THEN p_amount ELSE 0 END,
        CASE WHEN p_is_deposit THEN 0 ELSE p_amount END
    )
    ON CONFLICT (user_address, token_mint)
    DO UPDATE SET
        total_deposits = users_amounts.total_deposits + 
            CASE WHEN p_is_deposit THEN p_amount ELSE 0 END,
        total_withdrawals = users_amounts.total_withdrawals + 
            CASE WHEN p_is_deposit THEN 0 ELSE p_amount END,
        updated_at = now();
END;
$$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_amounts_updated_at
    BEFORE UPDATE ON users_amounts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Create function to link Solana addresses to auth users
CREATE OR REPLACE FUNCTION public.link_solana_address()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE auth.users 
    SET solana_address = new.raw_user_meta_data->>'solanaPublicKey'
    WHERE id = new.id;
    RETURN new;
END;
$$;

-- Trigger to link Solana address on user creation
CREATE TRIGGER link_solana_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.link_solana_address();

-- Index for auth.users.solana_address lookups (RLS performance)
CREATE INDEX idx_auth_users_solana ON auth.users (solana_address);

-- Revoke direct modification permissions
REVOKE INSERT, UPDATE, DELETE ON TABLE "public"."users_amounts" FROM authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION update_solana_amount TO authenticated;

-- Grant usage to service role
GRANT ALL ON TABLE "public"."users_amounts" TO service_role;

-- Add realtime
ALTER PUBLICATION supabase_realtime ADD TABLE "public"."users_amounts"; 