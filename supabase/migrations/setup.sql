-- TechTics Database Setup
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/.../sql/new)

-- Client registrations
CREATE TABLE IF NOT EXISTS client_forms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_details TEXT,
  services TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Developer registrations
CREATE TABLE IF NOT EXISTS developer_forms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  specialties TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client agreements
CREATE TABLE IF NOT EXISTS client_agreements (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  business_name TEXT,
  business_details TEXT,
  services TEXT[],
  agreed_at TIMESTAMPTZ DEFAULT now(),
  reference TEXT
);

-- Developer agreements
CREATE TABLE IF NOT EXISTS developer_agreements (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  years_of_experience TEXT,
  specialties TEXT[],
  agreed_at TIMESTAMPTZ DEFAULT now(),
  reference TEXT
);

-- Enable Row Level Security (optional, allow anon inserts)
ALTER TABLE client_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_agreements ENABLE ROW LEVEL SECURITY;

-- Allow anon inserts into all tables
CREATE POLICY "Allow anon inserts on client_forms" ON client_forms FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon inserts on developer_forms" ON developer_forms FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon inserts on client_agreements" ON client_agreements FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon inserts on developer_agreements" ON developer_agreements FOR INSERT TO anon WITH CHECK (true);
