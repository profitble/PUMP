-- Create presale_tokens table
create table presale_tokens (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) not null,
    name text not null,
    symbol text not null,
    description text,
    graduation_target double precision not null,
    accummulated_fund double precision default 0,
    volume_24h double precision default 0,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table presale_tokens enable row level security;

-- RLS policies
create policy "Anyone can view presale tokens"
    on presale_tokens for select
    to authenticated
    using (true);

create policy "Users can insert their own presale tokens"
    on presale_tokens for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Add indexes for better query performance
create index idx_presale_tokens_user_id on presale_tokens(user_id);
create index idx_presale_tokens_created_at on presale_tokens(created_at);