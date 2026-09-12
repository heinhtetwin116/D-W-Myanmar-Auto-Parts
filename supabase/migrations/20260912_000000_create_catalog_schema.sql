-- Catalog schema for D&W Myanmar Auto Parts
-- Migration: 20260912_000000_create_catalog_schema
-- Description: Create categories, products, and sync_runs tables with RLS policies

-- ============================================================================
-- Categories Table
-- ============================================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid (),
  erpnext_id text not null unique, -- ERPNext Item Group name
  name_en text not null,
  name_my text not null,
  description_en text,
  description_my text,
  enabled boolean not null default true,
  image_url text,
  created_at timestamp with time zone not null default now (),
  updated_at timestamp with time zone not null default now (),
  synced_at timestamp with time zone
);

-- Enable RLS on categories
alter table public.categories enable row level security;

-- Public read access: anyone can read enabled categories
create policy "public_read_enabled_categories" on public.categories as permissive for select
using (enabled = true);

-- Server-side sync writes (via service role or authenticated user with specific grants)
create policy "sync_write_categories" on public.categories as permissive for insert with check (true);

create policy "sync_update_categories" on public.categories as permissive for update using (true);

-- Indexes for filtering and joining
create index idx_categories_erpnext_id on public.categories (erpnext_id);

create index idx_categories_enabled on public.categories (enabled);

create index idx_categories_synced_at on public.categories (synced_at desc);

-- ============================================================================
-- Products Table
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid (),
  erpnext_id text not null unique, -- ERPNext Item name
  category_id uuid not null,
  sku text not null,
  name_en text not null,
  name_my text not null,
  description_en text,
  description_my text,
  specifications jsonb,
  price_mmk numeric(12, 2) not null, -- Numeric MMK price (e.g., 120.00)
  stock_quantity integer not null default 0,
  enabled boolean not null default true,
  image_url text,
  created_at timestamp with time zone not null default now (),
  updated_at timestamp with time zone not null default now (),
  synced_at timestamp with time zone,
  foreign key (category_id) references public.categories (id) on delete cascade
);

-- Enable RLS on products
alter table public.products enable row level security;

-- Public read access: anyone can read enabled products
create policy "public_read_enabled_products" on public.products as permissive for select
using (enabled = true);

-- Server-side sync writes
create policy "sync_write_products" on public.products as permissive for insert with check (true);

create policy "sync_update_products" on public.products as permissive for update using (true);

-- Indexes for filtering, joining, and search
create index idx_products_erpnext_id on public.products (erpnext_id);

create index idx_products_category_id on public.products (category_id);

create index idx_products_enabled on public.products (enabled);

create index idx_products_sku on public.products (sku);

create index idx_products_synced_at on public.products (synced_at desc);

create index idx_products_price_mmk on public.products (price_mmk);

-- ============================================================================
-- Sync Runs Table
-- ============================================================================
create table if not exists public.sync_runs (
  id uuid primary key default gen_random_uuid (),
  started_at timestamp with time zone not null,
  completed_at timestamp with time zone,
  status text not null check (status in ('in_progress', 'success', 'error')),
  categories_imported integer not null default 0,
  products_imported integer not null default 0,
  error_message text,
  created_at timestamp with time zone not null default now ()
);

-- Enable RLS on sync_runs (optional; consider admin-only visibility)
alter table public.sync_runs enable row level security;

-- Admin-only read access (restrict to authenticated with admin role; defer for now)
create policy "admin_read_sync_runs" on public.sync_runs as permissive for select using (false); -- Disabled for now; will be enabled with admin role

-- Server-side sync writes only
create policy "sync_write_sync_runs" on public.sync_runs as permissive for insert with check (true);

-- Indexes
create index idx_sync_runs_status on public.sync_runs (status);

create index idx_sync_runs_started_at on public.sync_runs (started_at desc);

-- ============================================================================
-- Grant public read-only access to categories and products
-- ============================================================================
-- Note: These grants allow unauthenticated users to read enabled records via RLS.
-- sync_runs table remains restricted to server/admin access.
grant select on public.categories to anon;

grant select on public.products to anon;

-- Server role can do everything on catalog and sync tables.
grant all on public.categories to authenticated;

grant all on public.products to authenticated;

grant all on public.sync_runs to authenticated;
