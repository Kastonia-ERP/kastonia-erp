-- Central application state. Authentication passwords remain exclusively in Supabase Auth.
create table if not exists public.erp_state (
  id text primary key,
  payload jsonb not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.erp_state enable row level security;
drop policy if exists authenticated_read_state on public.erp_state;
create policy authenticated_read_state on public.erp_state for select to authenticated
  using (exists (select 1 from public.user_profiles p where p.id=auth.uid() and p.active));
drop policy if exists admin_write_state on public.erp_state;
create policy admin_write_state on public.erp_state for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

revoke all on public.erp_state from anon;
grant select on public.erp_state to authenticated;
grant insert, update, delete on public.erp_state to authenticated;
