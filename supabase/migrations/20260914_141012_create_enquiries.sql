-- Enquiries table for D&W Myanmar Auto Parts
-- Migration: 20260914_141012_create_enquiries
-- Description: Create enquiries table for contact form submissions with RLS policies

-- ============================================================================
-- Enquiries Table
-- ============================================================================
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  email text not null,
  phone text,
  product_id uuid references public.products (id) on delete set null,
  message text not null,
  status text not null default 'new',
  created_at timestamp with time zone not null default now (),
  updated_at timestamp with time zone not null default now ()
);

-- Enable RLS on enquiries
alter table public.enquiries enable row level security;

-- Public insert access: anyone can submit a contact enquiry
create policy "public_insert_enquiries" on public.enquiries as permissive for insert
with check (true);

-- No public read/update/delete: enquiries are staff-only (admin area reads
-- via service role until roles/permissions land in Phase C v2).

-- Indexes for staff triage
create index idx_enquiries_status on public.enquiries (status);

create index idx_enquiries_created_at on public.enquiries (created_at desc);
