create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_state enable row level security;

create policy "Users can read own app state"
on public.user_app_state for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own app state"
on public.user_app_state for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own app state"
on public.user_app_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_user_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_user_app_state_updated_at on public.user_app_state;
create trigger trg_user_app_state_updated_at
before update on public.user_app_state
for each row execute function public.set_user_app_state_updated_at();

create table if not exists public.user_plus_entitlements (
  user_id uuid primary key references auth.users(id) on delete cascade,
  valid_until timestamptz null
);

alter table public.user_plus_entitlements enable row level security;

revoke all on table public.user_plus_entitlements from anon, authenticated;
grant select on table public.user_plus_entitlements to authenticated;

drop policy if exists "Users can read own active plus entitlement" on public.user_plus_entitlements;
create policy "Users can read own active plus entitlement"
on public.user_plus_entitlements for select
to authenticated
using (
  auth.uid() = user_id
  and (
    valid_until is null
    or valid_until > now()
  )
);
