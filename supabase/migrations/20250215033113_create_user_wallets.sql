create table user_wallets (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    balance numeric default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    unique(user_id)
);

-- Enable RLS
alter table user_wallets enable row level security;

-- RLS policies
create policy "Users can view their own wallet"
    on user_wallets for select
    using (auth.uid() = user_id);