-- Group 2: Asset Decision-Making
-- Used for Capital Investment Planning, Repair vs Replace analysis, etc.

CREATE TYPE decision_status AS ENUM ('proposed', 'analyzing', 'approved', 'rejected', 'deferred');
CREATE TYPE decision_type AS ENUM ('capex', 'opex', 'disposal', 'replacement', 'expansion');

CREATE TABLE asset_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  
  -- Links to other modules (Line of Sight)
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  strategic_plan_id UUID REFERENCES strategic_plans(id),
  
  -- Decision parameters
  decision_type decision_type NOT NULL,
  status decision_status DEFAULT 'proposed',
  
  estimated_cost NUMERIC(15, 2),
  benefit_value NUMERIC(15, 2), -- Financial or quantified risk reduction
  roi NUMERIC(10, 2), -- Return on Investment %
  
  justification TEXT,
  alternatives_analyzed TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE asset_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "asset_decisions"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable insert for all users" ON "asset_decisions"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "asset_decisions"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Indexes
CREATE INDEX idx_decisions_asset ON asset_decisions(asset_id);
CREATE INDEX idx_decisions_plan ON asset_decisions(strategic_plan_id);
