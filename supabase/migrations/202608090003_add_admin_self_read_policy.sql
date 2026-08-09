create policy "Authenticated admin can read own profile"
  on public.admins
  for select
  to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
