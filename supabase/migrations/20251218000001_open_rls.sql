-- Allow public/anon access to assessments for testing
drop policy if exists "Users can view their own assessments" on assessments;
drop policy if exists "Users can insert their own assessments" on assessments;
drop policy if exists "Users can update their own assessments" on assessments;
drop policy if exists "Users can delete their own assessments" on assessments;

create policy "Public view assessments"
on assessments for select
using (true);

create policy "Public insert assessments"
on assessments for insert
with check (true);

create policy "Public update assessments"
on assessments for update
using (true);


-- Allow public/anon access to answers
drop policy if exists "Users can view answers for their assessments" on assessment_answers;
drop policy if exists "Users can insert answers for their assessments" on assessment_answers;
drop policy if exists "Users can update answers for their assessments" on assessment_answers;
drop policy if exists "Users can delete answers for their assessments" on assessment_answers;

create policy "Public view answers"
on assessment_answers for select
using (true);

create policy "Public insert answers"
on assessment_answers for insert
with check (true);

create policy "Public update answers"
on assessment_answers for update
using (true);
