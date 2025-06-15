CREATE TABLE tokens (
    id uuid default uuid_generate_v4() primary key,
    mint_address VARCHAR(255) UNIQUE NOT NULL, -- The token mint address
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL,
    initial_supply BIGINT NOT NULL,
    decimals INTEGER NOT NULL,
    transaction_signature TEXT NOT NULL,  -- Store the transaction signature
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Add other fields as needed
    presale_token_id UUID REFERENCES presale_tokens(id)
);

CREATE INDEX idx_mint_address ON tokens (mint_address);
CREATE INDEX idx_presale_token_id ON tokens (presale_token_id);
