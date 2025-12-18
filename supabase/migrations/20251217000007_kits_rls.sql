-- Enable RLS for warehouse tables
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;

-- Policies for kits
CREATE POLICY "Enable read access for all users" ON kits FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON kits FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON kits FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON kits FOR DELETE USING (true);

-- Policies for kit_items
CREATE POLICY "Enable read access for all users" ON kit_items FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON kit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON kit_items FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON kit_items FOR DELETE USING (true);
