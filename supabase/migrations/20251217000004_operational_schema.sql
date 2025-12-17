-- Phase 1: Operational Database Foundation
-- Covers: Roles, Work Orders, Warehouse, and Measurement Points

-- 1. User Profiles & Roles (RBAC)
CREATE TYPE user_role AS ENUM ('technician', 'planner', 'supervisor', 'warehouse', 'industrial_read_only', 'admin');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role user_role DEFAULT 'technician',
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Measurement Points (for Assets)
CREATE TABLE measurement_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Motor Temp", "Vibration X"
  unit TEXT, -- e.g. "degC", "mm/s"
  min_value NUMERIC,
  max_value NUMERIC, -- If exceeded, triggers alert
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE measurement_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  measurement_point_id UUID REFERENCES measurement_points(id) ON DELETE CASCADE,
  work_order_id UUID, -- distinct reference, added later
  value NUMERIC NOT NULL,
  notes TEXT,
  captured_at TIMESTAMPTZ DEFAULT NOW(),
  captured_by UUID REFERENCES profiles(id)
);

-- 3. Warehouse & Inventory
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- SKU
  description TEXT NOT NULL,
  unit TEXT NOT NULL, -- e.g. "ea", "liter", "box"
  min_stock_level NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warehouse_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  quantity_on_hand NUMERIC DEFAULT 0,
  location_bin TEXT, -- e.g. "A-12-B"
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kits (Bill of Materials for Tasks)
CREATE TABLE kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kit_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID REFERENCES kits(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  quantity_required NUMERIC NOT NULL,
  NOTES TEXT
);

-- 4. Work Orders (The Core)
CREATE TYPE work_order_status AS ENUM ('draft', 'assigned', 'kit_requested', 'kit_ready', 'in_progress', 'completed', 'verified', 'closed', 'cancelled');
CREATE TYPE work_order_type AS ENUM ('preventive', 'corrective', 'inspection', 'project');
CREATE TYPE work_order_priority AS ENUM ('low', 'medium', 'high', 'emergency');

CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- FIX: Use integer for identity, and we can format 'OT-100' in frontend
  wo_number INT GENERATED ALWAYS AS IDENTITY UNIQUE, 
  
  title TEXT NOT NULL,
  description TEXT,
  
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  type work_order_type DEFAULT 'preventive',
  priority work_order_priority DEFAULT 'medium',
  status work_order_status DEFAULT 'draft',
  
  requester_id UUID REFERENCES profiles(id),
  assignee_id UUID REFERENCES profiles(id),
  
  scheduled_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  
  -- Feedback
  execution_time_minutes INT,
  downtime_minutes INT,
  feedback_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add Reference back to WO in Readings (This must be done carefully since WO is circular dep conceptually but table order is fine)
ALTER TABLE measurement_readings ADD CONSTRAINT fk_reading_wo FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE SET NULL;

-- 5. Activities (Checklists inside WO)
CREATE TABLE work_order_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_order_id UUID REFERENCES work_orders(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  comments TEXT,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES profiles(id),
  "order" INT DEFAULT 0
);

-- 6. Material Movements (Consumption)
CREATE TYPE movement_type AS ENUM ('inbound', 'outbound_wo', 'adjustment', 'return');

CREATE TABLE material_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID REFERENCES materials(id),
  work_order_id UUID REFERENCES work_orders(id),
  type movement_type NOT NULL,
  quantity NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);


-- RLS Policies (Draft - Open for dev, refine later)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE measurement_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_order_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_movements ENABLE ROW LEVEL SECURITY;

-- Permissive policies for now to allow development
CREATE POLICY "Public read all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public write all" ON profiles FOR ALL USING (true); -- Auth trigger should handle this ideally

CREATE POLICY "Public read all" ON work_orders FOR SELECT USING (true);
CREATE POLICY "Public write all" ON work_orders FOR ALL USING (true);

CREATE POLICY "Public read all" ON materials FOR SELECT USING (true);
CREATE POLICY "Public write all" ON materials FOR ALL USING (true);

CREATE POLICY "Public read all" ON measurement_points FOR SELECT USING (true);
CREATE POLICY "Public write all" ON measurement_points FOR ALL USING (true);
