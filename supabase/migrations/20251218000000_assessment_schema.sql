-- Create assessments table
create table if not exists assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('in_progress', 'completed')) default 'in_progress',
  metadata jsonb default '{}'::jsonb
);

-- Create assessment_answers table
create table if not exists assessment_answers (
  id uuid default gen_random_uuid() primary key,
  assessment_id uuid references assessments(id) on delete cascade not null,
  block_id text not null, -- 'A', 'B', etc.
  question_id text not null, -- Unique ID for the question
  score integer check (score >= 0 and score <= 4),
  evidence text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(assessment_id, question_id)
);

-- Enable RLS
alter table assessments enable row level security;
alter table assessment_answers enable row level security;

-- Create policies for assessments
create policy "Users can view their own assessments"
  on assessments for select
  using (auth.uid() = user_id);

create policy "Users can insert their own assessments"
  on assessments for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own assessments"
  on assessments for update
  using (auth.uid() = user_id);

create policy "Users can delete their own assessments"
  on assessments for delete
  using (auth.uid() = user_id);

-- Create policies for assessment_answers
create policy "Users can view answers for their assessments"
  on assessment_answers for select
  using (
    exists (
      select 1 from assessments
      where assessments.id = assessment_answers.assessment_id
      and assessments.user_id = auth.uid()
    )
  );

create policy "Users can insert answers for their assessments"
  on assessment_answers for insert
  with check (
    exists (
      select 1 from assessments
      where assessments.id = assessment_answers.assessment_id
      and assessments.user_id = auth.uid()
    )
  );

create policy "Users can update answers for their assessments"
  on assessment_answers for update
  using (
    exists (
      select 1 from assessments
      where assessments.id = assessment_answers.assessment_id
      and assessments.user_id = auth.uid()
    )
  );

create policy "Users can delete answers for their assessments"
  on assessment_answers for delete
  using (
    exists (
      select 1 from assessments
      where assessments.id = assessment_answers.assessment_id
      and assessments.user_id = auth.uid()
    )
  );
