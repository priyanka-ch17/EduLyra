-- SkillBridge AI PostgreSQL schema
create extension if not exists "pgcrypto";

create type public.app_role as enum ('student','faculty','industry','institution');
create type public.opportunity_type as enum ('Job','Internship','Faculty','Training');
create type public.work_mode as enum ('Remote','Hybrid','On-site');
create type public.application_stage as enum ('Saved','Applied','Shortlisted','Interview','Selected','Rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.app_role not null default 'student',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key references public.profiles(id) on delete cascade,
  institution text,
  department text,
  graduation_year int,
  readiness_score int default 0 check (readiness_score between 0 and 100),
  profile_completion int default 0 check (profile_completion between 0 and 100)
);

create table if not exists public.faculty (
  id uuid primary key references public.profiles(id) on delete cascade,
  institution text,
  department text,
  expertise text[],
  experience_years int default 0
);

create table if not exists public.industries (
  id uuid primary key references public.profiles(id) on delete cascade,
  company_name text not null,
  website text,
  industry text,
  verified boolean not null default false
);

create table if not exists public.institutions (
  id uuid primary key references public.profiles(id) on delete cascade,
  institution_name text not null,
  institution_type text,
  verified boolean not null default false
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  status text not null default 'draft',
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.assessment_questions (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid references public.skill_assessments(id) on delete cascade,
  question text not null,
  category text not null,
  question_type text not null default 'rating',
  options jsonb
);

create table if not exists public.assessment_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.skill_assessments(id) on delete cascade,
  overall_score int check (overall_score between 0 and 100),
  technical_score int check (technical_score between 0 and 100),
  soft_score int check (soft_score between 0 and 100),
  strengths text[],
  weaknesses text[],
  skill_gaps text[],
  created_at timestamptz not null default now()
);

create table if not exists public.student_skills (
  student_id uuid references public.students(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  score int check (score between 0 and 100),
  verified boolean default false,
  source text,
  primary key (student_id, skill_id)
);

create table if not exists public.skill_gaps (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  priority text not null default 'Medium',
  current_score int default 0,
  target_score int default 75,
  created_at timestamptz not null default now()
);

create table if not exists public.career_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  required_skills text[]
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  company text not null,
  type public.opportunity_type not null,
  description text,
  location text,
  work_mode public.work_mode not null,
  compensation text,
  duration text,
  eligibility text,
  deadline date,
  created_at timestamptz not null default now(),
  published boolean not null default true
);

create table if not exists public.opportunity_skills (
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  skill_id uuid references public.skills(id) on delete cascade,
  required boolean not null default true,
  primary key (opportunity_id, skill_id)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  stage public.application_stage not null default 'Applied',
  applied_at timestamptz not null default now(),
  next_action text,
  unique(opportunity_id, applicant_id)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  title text not null,
  duration text,
  level text,
  skills text[],
  certificate_available boolean default false,
  url text
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  issuer text,
  issued_on date,
  credential_url text,
  verified boolean default false
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  description text,
  technologies text[],
  github_url text,
  live_url text,
  verified boolean default false
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  username text not null unique,
  headline text,
  about text,
  public boolean default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorships (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid references public.profiles(id) on delete cascade,
  mentee_id uuid references public.profiles(id) on delete cascade,
  topic text,
  status text default 'requested',
  created_at timestamptz not null default now()
);

create table if not exists public.collaborations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  organization text not null,
  title text not null,
  type text not null,
  description text,
  skills text[],
  participants int default 0,
  deadline date,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  type text,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_opportunities (
  user_id uuid references public.profiles(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read boolean default false
);

create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_at timestamptz,
  mode text,
  meeting_url text,
  notes text
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete cascade,
  metric text not null,
  value numeric not null,
  dimension jsonb,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_opportunities_deadline on public.opportunities(deadline);
create index if not exists idx_opportunities_type on public.opportunities(type);
create index if not exists idx_applications_applicant on public.applications(applicant_id);
create index if not exists idx_applications_opportunity on public.applications(opportunity_id);
create index if not exists idx_notifications_user_read on public.notifications(user_id, read);
create index if not exists idx_student_skills_student on public.student_skills(student_id);

-- Enable RLS on every application table.
do $$
declare t text;
begin
  foreach t in array array['profiles','students','faculty','industries','institutions','skills','skill_assessments','assessment_questions','assessment_results','student_skills','skill_gaps','career_roles','opportunities','opportunity_skills','applications','courses','certifications','projects','portfolios','mentorships','collaborations','notifications','saved_opportunities','messages','interviews','analytics']
  loop execute format('alter table public.%I enable row level security', t); end loop;
end $$;

-- Helper functions.
create or replace function public.current_role()
returns public.app_role
language sql stable security definer set search_path=public
as $$ select role from public.profiles where id = auth.uid(); $$;

-- Profiles: own profile; public role data can be read for matching.
create policy "profiles_select_authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "students_own" on public.students for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "faculty_own" on public.faculty for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "industries_own" on public.industries for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "institutions_own" on public.institutions for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "skills_read" on public.skills for select to authenticated using (true);
create policy "career_roles_read" on public.career_roles for select to authenticated using (true);
create policy "courses_read" on public.courses for select to authenticated using (true);

create policy "opportunities_public_read" on public.opportunities for select to authenticated using (published = true);
create policy "industry_manage_opportunities" on public.opportunities for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "opportunity_skills_read" on public.opportunity_skills for select to authenticated using (true);

create policy "applications_student_manage" on public.applications for all to authenticated using (applicant_id = auth.uid()) with check (applicant_id = auth.uid());
create policy "applications_industry_view" on public.applications for select to authenticated using (
  exists (select 1 from public.opportunities o where o.id = opportunity_id and o.owner_id = auth.uid())
);
create policy "applications_industry_update" on public.applications for update to authenticated using (
  exists (select 1 from public.opportunities o where o.id = opportunity_id and o.owner_id = auth.uid())
) with check (
  exists (select 1 from public.opportunities o where o.id = opportunity_id and o.owner_id = auth.uid())
);

create policy "student_skills_own" on public.student_skills for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "skill_gaps_own" on public.skill_gaps for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "assessments_own" on public.skill_assessments for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "assessment_questions_read" on public.assessment_questions for select to authenticated using (
  exists (select 1 from public.skill_assessments a where a.id = assessment_id and a.student_id = auth.uid())
);
create policy "assessment_results_own" on public.assessment_results for all to authenticated using (
  exists (select 1 from public.skill_assessments a where a.id = assessment_id and a.student_id = auth.uid())
);

create policy "certifications_own" on public.certifications for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "projects_own" on public.projects for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "portfolios_own" on public.portfolios for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "public_portfolios_read" on public.portfolios for select to anon using (public = true);

create policy "mentorship_participants" on public.mentorships for all to authenticated using (mentor_id = auth.uid() or mentee_id = auth.uid()) with check (mentor_id = auth.uid() or mentee_id = auth.uid());
create policy "collaborations_read" on public.collaborations for select to authenticated using (true);
create policy "collaboration_owner_manage" on public.collaborations for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "notifications_own" on public.notifications for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "saved_opportunities_own" on public.saved_opportunities for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "messages_participants" on public.messages for all to authenticated using (sender_id = auth.uid() or receiver_id = auth.uid()) with check (sender_id = auth.uid() or receiver_id = auth.uid());
create policy "interviews_participants" on public.interviews for select to authenticated using (
  exists (select 1 from public.applications a where a.id = application_id and (a.applicant_id = auth.uid() or exists (select 1 from public.opportunities o where o.id=a.opportunity_id and o.owner_id=auth.uid())))
);
create policy "analytics_institution_read" on public.analytics for select to authenticated using (
  exists (select 1 from public.institutions i where i.id = institution_id and i.id = auth.uid())
);

-- New-user profile trigger.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path=public
as $$
begin
  insert into public.profiles (id,name,email,role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'student')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Optional cloud workspace snapshot used by the web app to keep profile, learning,
-- applications, recruitment state and messages available across devices.
create table if not exists public.workspace_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.app_role not null,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.workspace_snapshots enable row level security;
drop policy if exists "workspace_snapshot_own" on public.workspace_snapshots;
create policy "workspace_snapshot_own" on public.workspace_snapshots for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid());


-- EduLyra production-flow extensions (assessment randomization, verification, learning evidence,
-- internship tracking, reviews and protected documents).
alter table public.students add column if not exists career_goal text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists email_verified boolean not null default false;
alter table public.profiles add column if not exists phone_verified boolean not null default false;
alter table public.certifications add column if not exists certificate_id text unique;
alter table public.certifications add column if not exists verification_status text not null default 'pending';

create table if not exists public.assessment_question_bank (
  id uuid primary key default gen_random_uuid(),
  career_goal text not null,
  domain text not null,
  category text not null,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  difficulty text not null default 'Intermediate',
  active boolean not null default true
);

create table if not exists public.assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.skill_assessments(id) on delete cascade,
  question_id uuid not null references public.assessment_question_bank(id) on delete cascade,
  selected_answer text,
  is_correct boolean,
  answered_at timestamptz default now(),
  unique(assessment_id, question_id)
);

create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  module_order int not null,
  video_url text,
  duration_minutes int,
  quiz jsonb,
  required boolean not null default true
);

create table if not exists public.learning_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  progress int not null default 0 check(progress between 0 and 100),
  quiz_score int,
  completed_at timestamptz,
  primary key(student_id,module_id)
);

create table if not exists public.internship_workspaces (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  mentor_id uuid references public.profiles(id) on delete set null,
  start_date date,
  end_date date,
  status text not null default 'Active',
  completion_percentage int not null default 0 check(completion_percentage between 0 and 100),
  feedback text
);

create table if not exists public.internship_milestones (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.internship_workspaces(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'Pending',
  completed_at timestamptz
);

create table if not exists public.feedback_reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  subject_type text not null,
  subject_id uuid,
  rating int check(rating between 1 and 5),
  feedback text not null,
  public_visible boolean not null default false,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  storage_path text not null,
  visibility text not null default 'private',
  verification_status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.skill_verifications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  source text not null,
  evidence_id uuid,
  status text not null default 'verified',
  verified_at timestamptz not null default now()
);

create table if not exists public.recruitment_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

alter table public.assessment_question_bank enable row level security;
alter table public.assessment_answers enable row level security;
alter table public.learning_modules enable row level security;
alter table public.learning_progress enable row level security;
alter table public.internship_workspaces enable row level security;
alter table public.internship_milestones enable row level security;
alter table public.feedback_reviews enable row level security;
alter table public.documents enable row level security;
alter table public.skill_verifications enable row level security;
alter table public.recruitment_notes enable row level security;

create policy "question_bank_authenticated_read" on public.assessment_question_bank
  for select to authenticated using (active = true);

create policy "assessment_answers_owner" on public.assessment_answers
  for all to authenticated
  using (exists(select 1 from public.skill_assessments a where a.id=assessment_id and a.student_id=auth.uid()))
  with check (exists(select 1 from public.skill_assessments a where a.id=assessment_id and a.student_id=auth.uid()));

create policy "learning_modules_authenticated_read" on public.learning_modules
  for select to authenticated using (true);

create policy "learning_progress_owner" on public.learning_progress
  for all to authenticated using (student_id=auth.uid()) with check (student_id=auth.uid());

create policy "documents_owner" on public.documents
  for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());

create policy "feedback_author_manage" on public.feedback_reviews
  for all to authenticated using (author_id=auth.uid()) with check (author_id=auth.uid());

create policy "feedback_public_read" on public.feedback_reviews
  for select to authenticated using (public_visible=true and moderated=true);

create policy "skill_verifications_student_read" on public.skill_verifications
  for select to authenticated using (student_id=auth.uid());

create policy "recruitment_notes_author_manage" on public.recruitment_notes
  for all to authenticated using (author_id=auth.uid()) with check (author_id=auth.uid());

create policy "internship_workspace_participants" on public.internship_workspaces
  for select to authenticated using (
    exists(select 1 from public.applications a where a.id=application_id and a.applicant_id=auth.uid())
    or mentor_id=auth.uid()
    or exists(select 1 from public.applications a join public.opportunities o on o.id=a.opportunity_id
              where a.id=application_id and o.owner_id=auth.uid())
  );

create policy "internship_milestone_participants" on public.internship_milestones
  for select to authenticated using (
    exists(select 1 from public.internship_workspaces w
           join public.applications a on a.id=w.application_id
           where w.id=workspace_id and (a.applicant_id=auth.uid() or w.mentor_id=auth.uid()
             or exists(select 1 from public.opportunities o where o.id=a.opportunity_id and o.owner_id=auth.uid())))
  );


-- ============================================================
-- EduLyra production extension: assessment, learning, trust,
-- recruitment, collaboration, privacy and internship workflows.
-- These additive migrations preserve existing tables.
-- ============================================================

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  career_goal text not null,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds int,
  auto_submitted boolean not null default false,
  overall_score int check (overall_score between 0 and 100),
  technical_score int check (technical_score between 0 and 100),
  soft_score int check (soft_score between 0 and 100),
  aptitude_score int check (aptitude_score between 0 and 100),
  strengths text[] default '{}',
  weaknesses text[] default '{}',
  skill_gaps text[] default '{}',
  anti_cheat_events int not null default 0
);

create table if not exists public.assessment_question_bank (
  id uuid primary key default gen_random_uuid(),
  career_goal text not null,
  education_domain text,
  category text not null,
  skill text,
  question text not null,
  options jsonb not null,
  correct_answer text not null,
  difficulty text not null default 'Intermediate',
  active boolean not null default true
);

create table if not exists public.assessment_attempt_questions (
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_question_bank(id) on delete restrict,
  position int not null,
  primary key (attempt_id, question_id)
);

create table if not exists public.assessment_responses (
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id uuid not null references public.assessment_question_bank(id) on delete restrict,
  answer text,
  is_correct boolean,
  answered_at timestamptz,
  primary key (attempt_id, question_id)
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null,
  duration_minutes int,
  required boolean not null default true
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  video_url text not null,
  duration_seconds int,
  position int not null
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  title text not null,
  passing_score int not null default 70 check (passing_score between 0 and 100)
);

create table if not exists public.learning_progress (
  student_id uuid not null references public.students(id) on delete cascade,
  module_id uuid not null references public.course_modules(id) on delete cascade,
  video_completed boolean not null default false,
  quiz_completed boolean not null default false,
  quiz_score int check (quiz_score between 0 and 100),
  completed_at timestamptz,
  primary key (student_id, module_id)
);

create table if not exists public.certificate_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  certificate_number text not null unique,
  name text not null,
  issuer text not null,
  issued_on date not null default current_date,
  status text not null default 'Verified' check (status in ('Pending','Verified','Revoked')),
  verification_token text not null unique default encode(gen_random_bytes(12),'hex')
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  storage_path text not null,
  visibility text not null default 'Private' check (visibility in ('Private','Institution','Recruiters','Public')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.privacy_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  portfolio_visibility text not null default 'Private',
  recruiter_visibility boolean not null default false,
  institution_visibility boolean not null default true,
  phone_visibility boolean not null default false,
  email_visibility boolean not null default false
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  category text not null,
  subject text,
  rating int check (rating between 1 and 5),
  body text not null,
  public_display boolean not null default false,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null,
  target_id uuid,
  rating int check (rating between 1 and 5),
  body text not null,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.recruiter_notes (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid not null references public.applications(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.recruitment_stages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  stage text not null,
  entered_at timestamptz not null default now(),
  notes text
);

create table if not exists public.interview_details (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_at timestamptz,
  mode text,
  meeting_url text,
  notes text
);

create table if not exists public.internship_tasks (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status text not null default 'Todo' check (status in ('Todo','In Progress','Done')),
  completed_at timestamptz
);

create table if not exists public.internship_feedback (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating int check (rating between 1 and 5),
  strengths text,
  improvement_areas text,
  comments text,
  created_at timestamptz not null default now()
);

create table if not exists public.placement_outcomes (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid references public.institutions(id) on delete set null,
  student_id uuid not null references public.students(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  outcome text not null,
  company text,
  role text,
  recorded_at timestamptz not null default now()
);

create table if not exists public.career_skill_requirements (
  career_role_id uuid not null references public.career_roles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  target_score int not null default 75 check (target_score between 0 and 100),
  required boolean not null default true,
  primary key (career_role_id, skill_id)
);

create table if not exists public.faculty_opportunities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  type text not null check (type in ('Faculty Internship','FDP','Industrial Training','Consultancy','Research','Workshop','Guest Lecture','Mentorship','Industry Project')),
  organization text not null,
  description text,
  expertise text[],
  location text,
  deadline date,
  created_at timestamptz not null default now()
);

create table if not exists public.industry_programs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  type text not null check (type in ('Training','Certification','Workshop','Mentorship','Bootcamp','Industry Project','Guest Lecture')),
  description text,
  skills text[],
  duration text,
  certificate_available boolean not null default false,
  deadline date,
  created_at timestamptz not null default now()
);

create table if not exists public.collaboration_participants (
  collaboration_id uuid not null references public.collaborations(id) on delete cascade,
  participant_id uuid not null references public.profiles(id) on delete cascade,
  role text,
  status text not null default 'Invited',
  primary key (collaboration_id, participant_id)
);

-- Additive indexes for common production queries.
create index if not exists idx_assessment_attempts_student on public.assessment_attempts(student_id, submitted_at desc);
create index if not exists idx_assessment_bank_goal on public.assessment_question_bank(career_goal, active);
create index if not exists idx_learning_progress_student on public.learning_progress(student_id);
create index if not exists idx_certificates_student on public.certificate_records(student_id);
create index if not exists idx_documents_owner on public.documents(owner_id);
create index if not exists idx_feedback_public on public.feedback(public_display, moderated);
create index if not exists idx_recruiter_notes_application on public.recruiter_notes(application_id);
create index if not exists idx_internship_tasks_application on public.internship_tasks(application_id);
create index if not exists idx_placement_outcomes_institution on public.placement_outcomes(institution_id);

-- Secure profile access: replace the original broad authenticated SELECT policy.
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_self_or_authorized" on public.profiles
for select to authenticated
using (
  id = auth.uid()
  or exists (
    select 1 from public.applications a
    join public.opportunities o on o.id = a.opportunity_id
    where a.applicant_id = profiles.id and o.owner_id = auth.uid()
  )
  or (
    public.current_role() = 'institution'
    and exists (
      select 1 from public.students s
      where s.id = profiles.id
    )
  )
);

-- Private documents are owner-controlled; recruiter/institution access is
-- granted only for the relevant visibility and relationship.
alter table public.assessment_attempts enable row level security;
alter table public.assessment_question_bank enable row level security;
alter table public.assessment_attempt_questions enable row level security;
alter table public.assessment_responses enable row level security;
alter table public.course_modules enable row level security;
alter table public.videos enable row level security;
alter table public.quizzes enable row level security;
alter table public.learning_progress enable row level security;
alter table public.certificate_records enable row level security;
alter table public.documents enable row level security;
alter table public.privacy_settings enable row level security;
alter table public.feedback enable row level security;
alter table public.reviews enable row level security;
alter table public.recruiter_notes enable row level security;
alter table public.recruitment_stages enable row level security;
alter table public.interview_details enable row level security;
alter table public.internship_tasks enable row level security;
alter table public.internship_feedback enable row level security;
alter table public.placement_outcomes enable row level security;
alter table public.career_skill_requirements enable row level security;
alter table public.faculty_opportunities enable row level security;
alter table public.industry_programs enable row level security;
alter table public.collaboration_participants enable row level security;

create policy "assessment_attempts_student" on public.assessment_attempts for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "assessment_bank_read_authenticated" on public.assessment_question_bank for select to authenticated using (active = true);
create policy "assessment_attempt_questions_student" on public.assessment_attempt_questions for all to authenticated using (exists (select 1 from public.assessment_attempts a where a.id=attempt_id and a.student_id=auth.uid())) with check (exists (select 1 from public.assessment_attempts a where a.id=attempt_id and a.student_id=auth.uid()));
create policy "assessment_responses_student" on public.assessment_responses for all to authenticated using (exists (select 1 from public.assessment_attempts a where a.id=attempt_id and a.student_id=auth.uid())) with check (exists (select 1 from public.assessment_attempts a where a.id=attempt_id and a.student_id=auth.uid()));

create policy "course_modules_read" on public.course_modules for select to authenticated using (true);
create policy "videos_read" on public.videos for select to authenticated using (true);
create policy "quizzes_read" on public.quizzes for select to authenticated using (true);
create policy "learning_progress_student" on public.learning_progress for all to authenticated using (student_id=auth.uid()) with check (student_id=auth.uid());

create policy "certificates_owner_read" on public.certificate_records for select to authenticated using (student_id=auth.uid());
create policy "documents_owner" on public.documents for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "privacy_owner" on public.privacy_settings for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "feedback_owner_insert_read" on public.feedback for select to authenticated using (user_id=auth.uid() or (public_display=true and moderated=true));
create policy "feedback_insert" on public.feedback for insert to authenticated with check (user_id=auth.uid());
create policy "reviews_owner" on public.reviews for all to authenticated using (reviewer_id=auth.uid()) with check (reviewer_id=auth.uid());

create policy "recruiter_notes_owner" on public.recruiter_notes for all to authenticated using (recruiter_id=auth.uid()) with check (recruiter_id=auth.uid());
create policy "recruitment_stages_candidate_or_recruiter" on public.recruitment_stages for select to authenticated using (
  exists (select 1 from public.applications a where a.id=application_id and (a.applicant_id=auth.uid() or exists(select 1 from public.opportunities o where o.id=a.opportunity_id and o.owner_id=auth.uid())))
);
create policy "internship_tasks_participant" on public.internship_tasks for all to authenticated using (
  exists (select 1 from public.applications a where a.id=application_id and a.applicant_id=auth.uid())
) with check (
  exists (select 1 from public.applications a where a.id=application_id and a.applicant_id=auth.uid())
);
create policy "internship_feedback_reviewer_or_candidate" on public.internship_feedback for all to authenticated using (reviewer_id=auth.uid() or exists(select 1 from public.applications a where a.id=application_id and a.applicant_id=auth.uid()));
create policy "faculty_opportunities_read" on public.faculty_opportunities for select to authenticated using (true);
create policy "faculty_opportunities_owner" on public.faculty_opportunities for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "industry_programs_read" on public.industry_programs for select to authenticated using (true);
create policy "industry_programs_owner" on public.industry_programs for all to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "career_skill_requirements_read" on public.career_skill_requirements for select to authenticated using (true);
create policy "collaboration_participants_self" on public.collaboration_participants for select to authenticated using (participant_id=auth.uid());

create policy "placement_outcomes_institution_or_student" on public.placement_outcomes for select to authenticated using (
  student_id=auth.uid() or institution_id=auth.uid()
);


-- Institution authorization for institutional analytics: only records whose
-- institution matches the authenticated institution's registered name.
create policy "institution_read_students" on public.students
for select to authenticated using (
  id = auth.uid()
  or (
    public.current_role() = 'institution'
    and exists (
      select 1 from public.institutions i
      join public.profiles p on p.id=i.id
      where i.id=auth.uid() and i.institution_name=students.institution
    )
  )
);

create policy "institution_read_faculty" on public.faculty
for select to authenticated using (
  id = auth.uid()
  or (
    public.current_role() = 'institution'
    and exists (
      select 1 from public.institutions i
      where i.id=auth.uid() and i.institution_name=faculty.institution
    )
  )
);


-- Starter assessment bank. Administrators can expand this bank; each attempt
-- should select a randomized subset appropriate to the learner's career goal.
insert into public.assessment_question_bank
(career_goal,category,skill,question,options,correct_answer,difficulty)
select v.career_goal,v.category,v.skill,v.question,v.options::jsonb,v.correct_answer,v.difficulty
from (values
('Software Developer','Technical','Java','Which principle hides implementation details behind a public interface?','["Encapsulation","Inheritance","Compilation","Rendering"]','Encapsulation','Beginner'),
('Software Developer','Technical','Data Structures','Which structure follows FIFO order?','["Queue","Stack","Heap","Tree"]','Queue','Beginner'),
('Software Developer','Technical','SQL','What does a primary key identify?','["A unique row","A CSS rule","A chart","A duplicate row"]','A unique row','Beginner'),
('Software Developer','Technical','Git','Which Git command downloads remote changes without merging them?','["git fetch","git delete","git init","git clean"]','git fetch','Intermediate'),
('Software Developer','Technical','APIs','Which format is commonly used for REST API payloads?','["JSON","MP3","JPEG","EXE"]','JSON','Beginner'),
('Data Analyst','Technical','SQL','Which SQL clause filters grouped results?','["HAVING","WHERE","ORDER BY","LIMIT"]','HAVING','Intermediate'),
('Data Analyst','Technical','Statistics','Which measure represents the middle value of ordered data?','["Median","Variance","Range","Mean"]','Median','Beginner'),
('Data Analyst','Technical','Python','Which library is widely used for tabular data?','["Pandas","React","JUnit","Spring"]','Pandas','Beginner'),
('Data Analyst','Technical','Power BI','Which feature transforms data before visualization?','["Power Query","PowerPoint","Git","JDBC"]','Power Query','Intermediate'),
('Data Analyst','Technical','Visualization','Which chart is generally useful for showing a trend over time?','["Line chart","Pie chart","Gauge only","Single number"]','Line chart','Beginner'),
('Data Scientist','Technical','Machine Learning','Which learning approach uses labelled examples?','["Supervised learning","Unsupervised learning","Random search","Rendering"]','Supervised learning','Beginner'),
('Data Scientist','Technical','Python','Which library is widely used for numerical arrays?','["NumPy","React","Spring","Figma"]','NumPy','Beginner'),
('Data Scientist','Technical','Statistics','What does standard deviation describe?','["Spread of values","A database key","A web route","A UI component"]','Spread of values','Beginner'),
('AI/ML Engineer','Technical','Evaluation','Which metric is commonly used for classification performance?','["F1 score","Screen size","Latency only","File size"]','F1 score','Intermediate'),
('Cybersecurity','Technical','Networking','Which protocol commonly resolves domain names?','["DNS","FTP","SMTP","SSH"]','DNS','Beginner'),
('Cybersecurity','Technical','Authentication','What does multi-factor authentication add?','["An additional verification factor","A database index","A CSS rule","A faster CPU"]','An additional verification factor','Beginner'),
('Cybersecurity','Technical','Security','Which principle limits access to what is necessary?','["Least privilege","Open access","Replication","Rendering"]','Least privilege','Beginner'),
('Cloud Engineer','Technical','Cloud','Which model provides virtualized compute infrastructure?','["IaaS","SaaS","HTML","CSS"]','IaaS','Beginner'),
('Cloud Engineer','Technical','Containers','Which technology packages an application with its dependencies?','["Docker","Figma","SQL","React"]','Docker','Beginner'),
('Cloud Engineer','Technical','Security','Why is HTTPS used?','["Secure communication","Increase storage","Compile code","Resize images"]','Secure communication','Beginner'),
('General','Soft Skills','Communication','Which response best demonstrates active listening?','["Clarify the speaker’s point before responding","Interrupt with your solution","Ignore the concern","Change the topic"]','Clarify the speaker’s point before responding','Beginner'),
('General','Soft Skills','Teamwork','Which behaviour best supports collaboration?','["Share information, ask questions and respect different views","Work without communicating","Avoid feedback","Make every decision alone"]','Share information, ask questions and respect different views','Beginner'),
('General','Soft Skills','Communication','What is the clearest way to communicate a project blocker?','["State the blocker, impact and requested help","Hide the blocker","Send an unclear one-word message","Wait until the deadline"]','State the blocker, impact and requested help','Beginner'),
('General','Aptitude','Numerical Reasoning','If 5 workers complete a task in 12 days, how many worker-days are required?','["60","17","45","72"]','60','Beginner'),
('General','Aptitude','Numerical Reasoning','A product priced at 800 is discounted by 10%. What is the sale price?','["720","710","780","880"]','720','Beginner'),
('General','Aptitude','Problem Solving','Which approach is useful when a problem has many possible causes?','["Break it into hypotheses and test them","Guess once and stop","Ignore evidence","Change everything at once"]','Break it into hypotheses and test them','Beginner')
) as v(career_goal,category,skill,question,options,correct_answer,difficulty)
where not exists (
 select 1 from public.assessment_question_bank q where q.question=v.question and q.career_goal=v.career_goal
);
