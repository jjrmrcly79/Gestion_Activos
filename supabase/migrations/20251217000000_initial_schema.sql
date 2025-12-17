-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE asset_lifecycle_phase AS ENUM ('planning', 'acquisition', 'operation', 'maintenance', 'disposal');
CREATE TYPE criticality_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Strategic Plans (PEGA - Group 1)
CREATE TABLE strategic_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  mission_statement TEXT,
  vision_statement TEXT,
  period_start DATE,
  period_end DATE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (Group 4)
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES assets(id),
  tag TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  lifecycle_phase asset_lifecycle_phase DEFAULT 'planning',
  criticality criticality_level DEFAULT 'medium',
  initial_value NUMERIC(15, 2),
  current_value NUMERIC(15, 2),
  location TEXT,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  installation_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risks (Group 6)
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  strategic_plan_id UUID REFERENCES strategic_plans(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- e.g., 'financial', 'safety', 'environmental'
  likelihood INT CHECK (likelihood BETWEEN 1 AND 5),
  impact INT CHECK (impact BETWEEN 1 AND 5),
  risk_score INT GENERATED ALWAYS AS (likelihood * impact) STORED,
  mitigation_strategy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset Lifecycle Events (Group 3)
CREATE TABLE lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- e.g., 'maintenance', 'failure', 'upgrade', 'audit'
  date TIMESTAMPTZ DEFAULT NOW(),
  summary TEXT,
  details JSONB, -- Flexible storage for event specifics
  cost NUMERIC(15, 2),
  performed_by TEXT
);

-- Asset Documents (Group 4 - for AI / Knowledge Base)
CREATE TABLE asset_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  content_text TEXT, -- Extracted text for AI analysis
  summary TEXT, -- AI generated summary
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies (Basic Public Read for now, will lock down later)
ALTER TABLE strategic_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON strategic_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON assets FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON risks FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON lifecycle_events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON asset_documents FOR SELECT USING (true);
CREATE POLICY "Allow authenticated upload" ON asset_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Indexes
CREATE INDEX idx_assets_parent ON assets(parent_id);
CREATE INDEX idx_risks_asset ON risks(asset_id);
CREATE INDEX idx_docs_asset ON asset_documents(asset_id);

