-- Fix RLS policies to allow insert/update/delete for now (Development Mode)

-- Assets Table
CREATE POLICY "Enable insert for all users" ON "public"."assets"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "public"."assets"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Strategic Plans
CREATE POLICY "Enable insert for all users" ON "public"."strategic_plans"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "public"."strategic_plans"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Risks
CREATE POLICY "Enable insert for all users" ON "public"."risks"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "public"."risks"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Lifecycle Events
CREATE POLICY "Enable insert for all users" ON "public"."lifecycle_events"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON "public"."lifecycle_events"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Asset Documents (Make sure we cover all bases)
DROP POLICY IF EXISTS "Allow authenticated upload" ON asset_documents;
CREATE POLICY "Enable insert for all users" ON "public"."asset_documents"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON "public"."asset_documents"
AS PERMISSIVE FOR DELETE
TO public
USING (true);
