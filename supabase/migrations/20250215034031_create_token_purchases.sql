create table token_purchases (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    presale_token_id uuid references presale_tokens(id) not null,
    amount numeric not null,
    tokens_amount numeric not null,
    status text not null default 'completed',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table token_purchases enable row level security;

-- RLS policies
create policy "Users can view their own purchases"
    on token_purchases for select
    using (auth.uid() = user_id);

-- Function to calculate 24h volume
create or replace function calculate_24h_volume()
returns trigger as $$
begin
    -- Calculate 24h volume for the token
    with daily_volume as (
        select 
            presale_token_id,
            sum(amount) as volume
        from token_purchases
        where 
            created_at >= now() - interval '24 hours'
        group by presale_token_id
    )
    update presale_tokens
    set 
        volume_24h = COALESCE((
            select volume 
            from daily_volume 
            where presale_token_id = presale_tokens.id
        ), 0),
        updated_at = now()
    where id in (select presale_token_id from daily_volume);
    
    return NEW;
end;
$$ language plpgsql;

-- Create trigger to update 24h volume
create trigger update_24h_volume
    after insert or update on token_purchases
    for each statement
    execute function calculate_24h_volume();

-- Function to process token purchase
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
    v_tokens_amount numeric;
    v_purchase_id uuid;
    v_presale_token presale_tokens%rowtype;
begin
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