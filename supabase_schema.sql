-- Create campaigns table
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  product_description text not null,
  target_audience text not null,
  content_plan text not null,
  posts jsonb not null
);

-- Create calendar_events table
create table if not exists public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  date timestamp with time zone not null,
  type text not null,
  status text not null default 'planned',
  post jsonb not null
);

-- Enable Row Level Security (RLS)
alter table public.campaigns enable row level security;
alter table public.calendar_events enable row level security;

-- Create policies to allow all access for now (since we don't have auth yet)
-- WARNING: This is for development only. In production, you should restrict this.
create policy "Enable all access for all users" on public.campaigns
for all using (true) with check (true);

create policy "Enable all access for all users" on public.calendar_events
for all using (true) with check (true);
