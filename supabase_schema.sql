-- ========================================================
-- MARGINALIA LITERARY REVIEW — SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ========================================================

-- 1. Profiles Table (Reader & Writer directory)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  email TEXT,
  initials TEXT,
  role TEXT DEFAULT 'Fellow Reader',
  bio TEXT,
  member_number TEXT,
  languages TEXT[] DEFAULT ARRAY['English'],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert on profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on profiles"
  ON public.profiles FOR UPDATE
  USING (true);

-- 2. Posts Table (Essays & Publications)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  dek TEXT,
  summary TEXT,
  section TEXT DEFAULT 'Essays',
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'published',
  read_time_minutes INTEGER DEFAULT 5,
  appreciations INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  epigraph JSONB,
  image TEXT,
  author JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on published posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Allow insert on posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update on posts"
  ON public.posts FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete on posts"
  ON public.posts FOR DELETE
  USING (true);

-- 3. Notes Table (Short thoughts)
CREATE TABLE IF NOT EXISTS public.notes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'en',
  dir TEXT DEFAULT 'ltr',
  image TEXT,
  author JSONB NOT NULL,
  appreciations INTEGER DEFAULT 0,
  replies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on notes"
  ON public.notes FOR SELECT
  USING (true);

CREATE POLICY "Allow all write on notes"
  ON public.notes FOR ALL
  USING (true);
