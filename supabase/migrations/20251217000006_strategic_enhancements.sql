-- Strategic Objectives
CREATE TABLE strategic_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategic_plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for objectives
ALTER TABLE strategic_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON strategic_objectives FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON strategic_objectives FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON strategic_objectives FOR UPDATE USING (true);

-- Enhancing Risks table policies (since it was read-only in initial schema)
CREATE POLICY "Allow public insert" ON risks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON risks FOR UPDATE USING (true);

-- Indexes
CREATE INDEX idx_objectives_plan ON strategic_objectives(strategic_plan_id);
