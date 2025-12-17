-- Group 5: Organization & People
-- Managing Departments, Teams, Roles, and Competencies

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  head_of_department TEXT, -- Could be a user ID later
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE personnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL, -- e.g. 'Asset Manager', 'Maintenance Technician'
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  competencies TEXT[], -- Array of strings e.g. ['ISO 55000 Foundation', 'Safety Cert']
  status TEXT DEFAULT 'active', -- 'active', 'inactive'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON "departments" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all users" ON "departments" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON "personnel" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for all users" ON "personnel" AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON "personnel" AS PERMISSIVE FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Initial Data Seeding
INSERT INTO departments (name, description) VALUES 
('Strategic Planning', 'Responsible for SAMP and long-term planning'),
('Operations', 'Day-to-day asset operation'),
('Maintenance', 'Preventive and corrective maintenance'),
('Engineering', 'Technical design and analysis'),
('Finance', 'Capital planning and budgeting');
