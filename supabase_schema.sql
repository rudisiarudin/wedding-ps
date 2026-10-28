-- ==============================================================================
-- SKEMA DATABASE SUPABASE UNTUK UNDANGAN DIGITAL PUTRI & SYARIF
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda
-- ==============================================================================

-- 1. Tabel Buku Tamu, Doa & Ucapan (wishes)
create table if not exists public.wishes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    message text not null,
    status text default 'Hadir', -- 'Hadir' | 'Tidak Hadir' | 'Masih Ragu'
    reply text,                  -- Balasan doa dari mempelai
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabel Manajemen Daftar Tamu Undangan (guests)
create table if not exists public.guests (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    url text not null,
    category text,               -- misal: 'Keluarga', 'Sahabat', 'VIP', 'Rekan Kerja'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabel Pengaturan / Passcode Admin (settings)
create table if not exists public.settings (
    id uuid default gen_random_uuid() primary key,
    key text unique not null,
    value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Masukkan passcode awal untuk login Admin (bisa diubah sesuai keinginan)
insert into public.settings (key, value)
values ('admin_passcode', 'syarifputri2026')
on conflict (key) do nothing;

-- ==============================================================================
-- KEAMANAN & AKSES (Row Level Security / RLS)
-- Mengizinkan anon key aplikasi membaca dan menyimpan ucapan serta tamu
-- ==============================================================================

alter table public.wishes enable row level security;
alter table public.guests enable row level security;
alter table public.settings enable row level security;

-- Kebijakan Akses: wishes
drop policy if exists "Allow public read wishes" on public.wishes;
create policy "Allow public read wishes" on public.wishes for select using (true);

drop policy if exists "Allow public insert wishes" on public.wishes;
create policy "Allow public insert wishes" on public.wishes for insert with check (true);

drop policy if exists "Allow public update wishes" on public.wishes;
create policy "Allow public update wishes" on public.wishes for update using (true);

drop policy if exists "Allow public delete wishes" on public.wishes;
create policy "Allow public delete wishes" on public.wishes for delete using (true);

-- Kebijakan Akses: guests
drop policy if exists "Allow public read guests" on public.guests;
create policy "Allow public read guests" on public.guests for select using (true);

drop policy if exists "Allow public insert guests" on public.guests;
create policy "Allow public insert guests" on public.guests for insert with check (true);

drop policy if exists "Allow public update guests" on public.guests;
create policy "Allow public update guests" on public.guests for update using (true);

drop policy if exists "Allow public delete guests" on public.guests;
create policy "Allow public delete guests" on public.guests for delete using (true);

-- Kebijakan Akses: settings
drop policy if exists "Allow public read settings" on public.settings;
create policy "Allow public read settings" on public.settings for select using (true);

drop policy if exists "Allow public update settings" on public.settings;
create policy "Allow public update settings" on public.settings for update using (true);

-- ==============================================================================
-- AKTIFKAN FITUR REALTIME (Agar ucapan baru langsung muncul tanpa reload)
-- ==============================================================================
alter publication supabase_realtime add table public.wishes;
