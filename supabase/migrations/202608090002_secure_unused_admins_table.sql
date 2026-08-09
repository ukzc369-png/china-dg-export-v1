alter table public.admins enable row level security;

comment on table public.admins is
  'Legacy empty table. RLS intentionally has no policies; admin login uses Supabase Auth.';
