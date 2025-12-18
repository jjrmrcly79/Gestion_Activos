-- Drop foreign key constraint to allow demo users
alter table assessments drop constraint if exists assessments_user_id_fkey;

-- Ensure RLS is still permissive (re-applying just in case)
drop policy if exists "Public view assessments" on assessments;
drop policy if exists "Public insert assessments" on assessments;
drop policy if exists "Public update assessments" on assessments;

create policy "Public view assessments" on assessments for select using (true);
create policy "Public insert assessments" on assessments for insert with check (true);
create policy "Public update assessments" on assessments for update using (true);
