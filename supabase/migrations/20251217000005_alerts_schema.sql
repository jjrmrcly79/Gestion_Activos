-- Alerts Table for Out-of-Range Readings
CREATE TYPE alert_status AS ENUM ('new', 'acknowledged', 'resolved');

CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  work_order_id UUID REFERENCES work_orders(id) ON DELETE SET NULL,
  measurement_point_id UUID REFERENCES measurement_points(id) ON DELETE SET NULL,
  
  description TEXT NOT NULL, -- e.g. "Temp 105 > Max 100"
  severity TEXT DEFAULT 'medium', -- low, medium, high, critical
  status alert_status DEFAULT 'new',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read all" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public write all" ON alerts FOR ALL USING (true);
