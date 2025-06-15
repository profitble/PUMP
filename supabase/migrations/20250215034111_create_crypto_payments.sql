create table crypto_payments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    session_id text not null,
    status text not null,
    amount numeric,
    currency text,
    crypto_amount numeric,
    crypto_currency text,
    wallet_address text,
    transaction_id text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table crypto_payments enable row level security;

-- RLS policies
create policy "Users can view their own payments"
    on crypto_payments for select
    using (auth.uid() = user_id);


    

-- Enable realtime for specific tables
alter publication supabase_realtime add table crypto_payments;

-- Create policy for realtime
create policy "Enable realtime for users own payments" 
on crypto_payments 
for select 
to authenticated
using (
  auth.uid() = user_id
);


-- Function to update user balance from crypto payment
create or replace function update_user_balance()
returns trigger as $$
begin
    -- Insert or update user wallet balance
    insert into user_wallets (user_id, balance)
    values (NEW.user_id, NEW.crypto_amount)
    on conflict (user_id)
    do update set 
        balance = user_wallets.balance + NEW.crypto_amount,
        updated_at = now();
    return NEW;
end;
$$ language plpgsql;

-- Create trigger to update balance on payment completion
create trigger on_payment_complete
    after insert on crypto_payments
    for each row
    when (NEW.status = 'fulfillment_complete')
    execute function update_user_balance();

-- Update purchase_tokens function to check wallet balance
create or replace function purchase_tokens(
    p_user_id uuid,
    p_amount numeric,
    p_presale_token_id uuid
)
returns json
language plpgsql
security definer
as $$
declare
    v_wallet_balance numeric;
    v_tokens_amount numeric;
    v_purchase_id uuid;
    v_presale_token presale_tokens%rowtype;
begin
    -- Get current wallet balance
    select balance into v_wallet_balance
    from user_wallets
    where user_id = p_user_id
    for update;  -- Lock the row

    if not found then
        return json_build_object(
            'success', false,
            'error', 'Wallet not found'
        );
    end if;

    if v_wallet_balance < p_amount then
        return json_build_object(
            'success', false,
            'error', 'Insufficient balance'
        );
    end if;

    -- Get presale token
    select * into v_presale_token
    from presale_tokens
    where id = p_presale_token_id
    for update;

    if not found then
        return json_build_object(
            'success', false,
            'error', 'Presale token not found'
        );
    end if;

    -- Calculate tokens amount (you can modify this calculation based on your token price)
    v_tokens_amount := p_amount;  -- 1:1 ratio for example

    -- Start transaction
    begin
        -- Update wallet balance
        update user_wallets
        set 
            balance = balance - p_amount,
            updated_at = now()
        where user_id = p_user_id;

        -- Update presale token accumulated fund
        update presale_tokens
        set 
            accummulated_fund = accummulated_fund + p_amount,
            updated_at = now()
        where id = p_presale_token_id;

        -- Record purchase
        insert into token_purchases 
            (user_id, amount, tokens_amount, presale_token_id)
        values 
            (p_user_id, p_amount, v_tokens_amount, p_presale_token_id)
        returning id into v_purchase_id;

        return json_build_object(
            'success', true,
            'purchase_id', v_purchase_id,
            'tokens_amount', v_tokens_amount,
            'new_balance', v_wallet_balance - p_amount,
            'presale_token', v_presale_token
        );
    exception
        when others then
            return json_build_object(
                'success', false,
                'error', SQLERRM
            );
    end;
end;
$$;

