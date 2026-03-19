
-- nav_items table
create table public.nav_items (
  id uuid primary key default gen_random_uuid(),
  label varchar(100) not null,
  url text,
  sort_order int not null default 0,
  is_cta boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- mega_menu_sections table
create table public.mega_menu_sections (
  id uuid primary key default gen_random_uuid(),
  nav_item_id uuid not null references public.nav_items(id) on delete cascade,
  title varchar(100) not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- mega_menu_links table
create table public.mega_menu_links (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.mega_menu_sections(id) on delete cascade,
  label varchar(100) not null,
  url text not null,
  description varchar(200),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_mega_menu_sections_nav_item_id on public.mega_menu_sections(nav_item_id);
create index idx_mega_menu_links_section_id on public.mega_menu_links(section_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_nav_items_updated_at
  before update on public.nav_items
  for each row
  execute function public.set_updated_at();

-- Enable RLS
alter table public.nav_items enable row level security;
alter table public.mega_menu_sections enable row level security;
alter table public.mega_menu_links enable row level security;

-- RLS policies: authenticated users can do everything
create policy "Authenticated users can select nav_items"
  on public.nav_items for select to authenticated using (true);
create policy "Authenticated users can insert nav_items"
  on public.nav_items for insert to authenticated with check (true);
create policy "Authenticated users can update nav_items"
  on public.nav_items for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete nav_items"
  on public.nav_items for delete to authenticated using (true);

create policy "Authenticated users can select mega_menu_sections"
  on public.mega_menu_sections for select to authenticated using (true);
create policy "Authenticated users can insert mega_menu_sections"
  on public.mega_menu_sections for insert to authenticated with check (true);
create policy "Authenticated users can update mega_menu_sections"
  on public.mega_menu_sections for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete mega_menu_sections"
  on public.mega_menu_sections for delete to authenticated using (true);

create policy "Authenticated users can select mega_menu_links"
  on public.mega_menu_links for select to authenticated using (true);
create policy "Authenticated users can insert mega_menu_links"
  on public.mega_menu_links for insert to authenticated with check (true);
create policy "Authenticated users can update mega_menu_links"
  on public.mega_menu_links for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete mega_menu_links"
  on public.mega_menu_links for delete to authenticated using (true);

-- Seed data
insert into public.nav_items (id, label, url, sort_order, is_cta) values
  ('a1000000-0000-0000-0000-000000000001', 'Roofing & Exteriors', null, 1, false),
  ('a1000000-0000-0000-0000-000000000002', 'HVAC & Skilled Trades', null, 2, false),
  ('a1000000-0000-0000-0000-000000000003', 'Field Service Management', null, 3, false),
  ('a1000000-0000-0000-0000-000000000004', 'Partners', null, 4, false),
  ('a1000000-0000-0000-0000-000000000005', 'Resources', null, 5, false),
  ('a1000000-0000-0000-0000-000000000006', 'Company', null, 6, false),
  ('a1000000-0000-0000-0000-000000000007', 'Schedule a Demo →', 'https://www.zuper.co/demo', 7, true);

insert into public.mega_menu_sections (id, nav_item_id, title, sort_order) values
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Solutions', 1),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Features', 2),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Resources', 3),
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Industries', 1),
  ('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Features', 2),
  ('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Core Platform', 1),
  ('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Capabilities', 2),
  ('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Integrations', 3),
  ('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000004', 'Partner Programs', 1),
  ('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000004', 'Partner Resources', 2),
  ('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000005', 'Learn', 1),
  ('b1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000005', 'Support', 2),
  ('b1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005', 'Community', 3),
  ('b1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000006', 'About', 1),
  ('b1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000006', 'Careers', 2);

insert into public.mega_menu_links (section_id, label, url, description, sort_order) values
  ('b1000000-0000-0000-0000-000000000001', 'Roofing Software', 'https://www.zuper.co/roofing', 'End-to-end roofing business management', 1),
  ('b1000000-0000-0000-0000-000000000001', 'Exterior Contractors', 'https://www.zuper.co/exteriors', 'Solutions for siding, gutters & more', 2),
  ('b1000000-0000-0000-0000-000000000001', 'Storm Restoration', '#', 'Manage storm damage claims efficiently', 3),
  ('b1000000-0000-0000-0000-000000000002', 'Estimates & Proposals', '#', 'Create winning proposals fast', 1),
  ('b1000000-0000-0000-0000-000000000002', 'Job Scheduling', '#', 'Drag-and-drop crew scheduling', 2),
  ('b1000000-0000-0000-0000-000000000002', 'Material Ordering', '#', 'Streamline material procurement', 3),
  ('b1000000-0000-0000-0000-000000000003', 'Case Studies', 'https://www.zuper.co/case-studies', 'See how roofers use Zuper', 1),
  ('b1000000-0000-0000-0000-000000000003', 'ROI Calculator', '#', 'Calculate your potential savings', 2),
  ('b1000000-0000-0000-0000-000000000003', 'Blog', 'https://www.zuper.co/blog', 'Tips and industry insights', 3),
  ('b1000000-0000-0000-0000-000000000004', 'HVAC', 'https://www.zuper.co/hvac', 'Complete HVAC service management', 1),
  ('b1000000-0000-0000-0000-000000000004', 'Plumbing', 'https://www.zuper.co/plumbing', 'Plumbing business solutions', 2),
  ('b1000000-0000-0000-0000-000000000004', 'Electrical', 'https://www.zuper.co/electrical', 'Electrical contractor tools', 3),
  ('b1000000-0000-0000-0000-000000000005', 'Dispatching', '#', 'Smart technician dispatching', 1),
  ('b1000000-0000-0000-0000-000000000005', 'Invoicing', '#', 'Send invoices from the field', 2),
  ('b1000000-0000-0000-0000-000000000005', 'Customer Portal', '#', 'Self-service booking for customers', 3),
  ('b1000000-0000-0000-0000-000000000006', 'Work Order Management', 'https://www.zuper.co/work-order-management', 'Create and track work orders', 1),
  ('b1000000-0000-0000-0000-000000000006', 'Scheduling & Dispatch', 'https://www.zuper.co/scheduling', 'Optimize routes and schedules', 2),
  ('b1000000-0000-0000-0000-000000000006', 'Mobile App', '#', 'Empower your field teams', 3),
  ('b1000000-0000-0000-0000-000000000007', 'GPS Tracking', '#', 'Real-time fleet visibility', 1),
  ('b1000000-0000-0000-0000-000000000007', 'Reporting & Analytics', '#', 'Data-driven decisions', 2),
  ('b1000000-0000-0000-0000-000000000007', 'Custom Forms', '#', 'Build custom inspection forms', 3),
  ('b1000000-0000-0000-0000-000000000007', 'Inventory Management', '#', 'Track parts and equipment', 4),
  ('b1000000-0000-0000-0000-000000000008', 'QuickBooks', '#', 'Seamless accounting sync', 1),
  ('b1000000-0000-0000-0000-000000000008', 'Salesforce', '#', 'CRM integration', 2),
  ('b1000000-0000-0000-0000-000000000008', 'HubSpot', '#', 'Marketing automation', 3),
  ('b1000000-0000-0000-0000-000000000009', 'Become a Partner', '#', 'Join the Zuper partner network', 1),
  ('b1000000-0000-0000-0000-000000000009', 'Referral Program', '#', 'Earn by referring Zuper', 2),
  ('b1000000-0000-0000-0000-000000000009', 'Technology Partners', '#', 'Build on the Zuper platform', 3),
  ('b1000000-0000-0000-0000-000000000010', 'Partner Portal', '#', 'Access partner tools and resources', 1),
  ('b1000000-0000-0000-0000-000000000010', 'Partner Directory', '#', 'Find a Zuper partner near you', 2),
  ('b1000000-0000-0000-0000-000000000011', 'Blog', 'https://www.zuper.co/blog', 'Industry insights and tips', 1),
  ('b1000000-0000-0000-0000-000000000011', 'Webinars', '#', 'Live and on-demand sessions', 2),
  ('b1000000-0000-0000-0000-000000000011', 'Guides & eBooks', '#', 'In-depth resource library', 3),
  ('b1000000-0000-0000-0000-000000000012', 'Help Center', '#', 'Find answers quickly', 1),
  ('b1000000-0000-0000-0000-000000000012', 'API Documentation', '#', 'Developer resources', 2),
  ('b1000000-0000-0000-0000-000000000012', 'Contact Support', '#', 'Get in touch with our team', 3),
  ('b1000000-0000-0000-0000-000000000013', 'Community Forum', '#', 'Connect with other users', 1),
  ('b1000000-0000-0000-0000-000000000013', 'Events', '#', 'Upcoming Zuper events', 2),
  ('b1000000-0000-0000-0000-000000000014', 'About Us', 'https://www.zuper.co/about', 'Our story and mission', 1),
  ('b1000000-0000-0000-0000-000000000014', 'Leadership', '#', 'Meet the team', 2),
  ('b1000000-0000-0000-0000-000000000014', 'Press', '#', 'News and media coverage', 3),
  ('b1000000-0000-0000-0000-000000000015', 'Open Positions', '#', 'Join our growing team', 1),
  ('b1000000-0000-0000-0000-000000000015', 'Culture', '#', 'Life at Zuper', 2),
  ('b1000000-0000-0000-0000-000000000015', 'Benefits', '#', 'Perks and benefits', 3);
