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
