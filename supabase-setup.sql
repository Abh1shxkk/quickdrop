-- Run this in Supabase SQL Editor
create table if not exists user_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  bot_token text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_tokens enable row level security;

create policy "Users read own token" on user_tokens for select using (auth.uid() = user_id);
create policy "Users insert own token" on user_tokens for insert with check (auth.uid() = user_id);
create policy "Users update own token" on user_tokens for update using (auth.uid() = user_id);
create policy "Users delete own token" on user_tokens for delete using (auth.uid() = user_id);
