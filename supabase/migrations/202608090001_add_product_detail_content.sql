alter table public.products
  add column if not exists slug text,
  add column if not exists detail_content jsonb not null default '{}'::jsonb;

create unique index if not exists products_slug_unique
  on public.products (slug)
  where slug is not null and btrim(slug) <> '';

comment on column public.products.slug is 'Optional stable URL segment for /products/:slug.';
comment on column public.products.detail_content is 'Optional product detail page overrides; empty keys use the frontend safe template.';
