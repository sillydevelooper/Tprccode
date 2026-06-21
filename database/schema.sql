-- TestPrep Admissions — Postgres / Supabase schema
-- Source-first + audit-first. Every source-based table carries provenance + review
-- columns. Curated rows are protected by an is_curated flag; ingestion upserts must
-- never overwrite is_curated = true rows (enforce in application/import layer).
-- NOTE: Supabase is NOT connected yet; this is the migration target.

create extension if not exists "pgcrypto";

-- ---------- shared enums ----------
do $$ begin
  create type review_status as enum ('approved','needs_review','rejected','archived');
exception when duplicate_object then null; end $$;
do $$ begin
  create type source_status as enum ('verified','needs_review','stale','broken','unknown');
exception when duplicate_object then null; end $$;
do $$ begin
  create type public_visibility as enum ('visible','review_only','hidden');
exception when duplicate_object then null; end $$;

-- reusable provenance columns are inlined per table for clarity.

-- ---------- countries ----------
create table if not exists countries (
  code            char(2) primary key,
  name_tr         text not null,
  name_en         text not null,
  slug            text not null unique,
  region          text not null,
  popular_admission_systems   text[] not null default '{}',
  common_application_platforms text[] not null default '{}',
  english_proficiency_notes   text not null default 'Doğrulama gerekli',
  essay_or_statement_notes    text not null default 'Doğrulama gerekli',
  typical_deadline_notes      text not null default 'Doğrulama gerekli',
  scholarship_notes           text not null default 'Doğrulama gerekli',
  turkish_students_notes      text not null default 'Doğrulama gerekli',
  -- provenance
  source_url text not null, source_title text not null, source_type text not null,
  source_status source_status not null default 'needs_review',
  last_checked_at timestamptz not null default now(),
  next_review_at  timestamptz,
  confidence_score numeric(3,2) not null default 0.5,
  needs_human_review boolean not null default true,
  review_status review_status not null default 'needs_review',
  reviewer_notes text not null default '',
  is_curated boolean not null default false
);

-- ---------- universities ----------
create table if not exists universities (
  id   text primary key,
  name text not null,
  slug text not null,
  country_code char(2) not null references countries(code),
  city text not null default 'Doğrulama gerekli',
  type text not null default 'university',
  website_url text not null default 'Doğrulama gerekli',
  admissions_url text not null default 'Doğrulama gerekli',
  application_platforms text[] not null default '{}',
  popular_program_areas text[] not null default '{}',
  general_international_admission_notes text not null default 'Doğrulama gerekli',
  testing_notes text not null default 'Doğrulama gerekli',
  english_proficiency_notes text not null default 'Doğrulama gerekli',
  essay_requirement_notes text not null default 'Doğrulama gerekli',
  scholarship_notes text not null default 'Doğrulama gerekli',
  institution_category text not null default 'unknown',
  directory_priority int not null default 4,
  public_visibility public_visibility not null default 'review_only',
  admissions_data_priority int not null default 4,
  classification_reason text not null default '',
  classification_confidence numeric(3,2) not null default 0.5,
  is_active boolean not null default true,
  source_url text not null, source_title text not null, source_type text not null,
  source_status source_status not null default 'needs_review',
  last_checked_at timestamptz not null default now(),
  next_review_at timestamptz,
  confidence_score numeric(3,2) not null default 0.5,
  needs_human_review boolean not null default true,
  review_status review_status not null default 'needs_review',
  reviewer_notes text not null default '',
  is_curated boolean not null default false,
  unique (slug, country_code)
);
create index if not exists idx_uni_country on universities(country_code);
create index if not exists idx_uni_visibility on universities(public_visibility);
create index if not exists idx_uni_category on universities(institution_category);

-- ---------- university_classifications (audit trail) ----------
create table if not exists university_classifications (
  id bigserial primary key,
  university_id text not null references universities(id) on delete cascade,
  institution_category text not null,
  public_visibility public_visibility not null,
  reason text not null,
  confidence numeric(3,2) not null,
  classified_at timestamptz not null default now()
);

-- ---------- programs ----------
create table if not exists programs (
  id text primary key,
  name_tr text not null,
  name_en text not null,
  slug text not null,
  university_id text not null references universities(id) on delete cascade,
  country_code char(2) not null references countries(code),
  degree_level text not null default 'unknown',
  field text not null default 'other',
  application_platform text not null default 'Doğrulama gerekli',
  academic_expectation_notes text not null default 'Doğrulama gerekli',
  exam_requirement_summary text not null default 'Doğrulama gerekli',
  english_requirement_summary text not null default 'Doğrulama gerekli',
  essay_requirement_summary text not null default 'Doğrulama gerekli',
  document_requirement_summary text not null default 'Doğrulama gerekli',
  deadline_summary text not null default 'Doğrulama gerekli',
  scholarship_notes text not null default 'Doğrulama gerekli',
  fit_notes text not null default 'Doğrulama gerekli',
  source_url text not null, source_title text not null, source_type text not null,
  source_status source_status not null default 'needs_review',
  last_checked_at timestamptz not null default now(),
  next_review_at timestamptz,
  confidence_score numeric(3,2) not null default 0.5,
  needs_human_review boolean not null default true,
  review_status review_status not null default 'needs_review',
  reviewer_notes text not null default '',
  is_curated boolean not null default false,
  unique (slug)
);
create index if not exists idx_prog_uni on programs(university_id);
create index if not exists idx_prog_field on programs(field);

-- ---------- requirement detail tables ----------
create table if not exists admission_requirements (
  id text primary key, program_id text not null references programs(id) on delete cascade,
  category text not null, label_tr text not null, detail_tr text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);
create table if not exists exam_requirements (
  id text primary key, program_id text not null references programs(id) on delete cascade,
  exam text not null, exam_label text not null, is_required boolean not null default true,
  min_score_note text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);
create table if not exists essay_requirements (
  id text primary key, program_id text not null references programs(id) on delete cascade,
  essay_type text not null, prompt_summary text not null default 'Doğrulama gerekli',
  word_limit_note text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);
create table if not exists document_requirements (
  id text primary key, program_id text not null references programs(id) on delete cascade,
  document text not null, is_required boolean not null default true, detail_tr text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);
create table if not exists deadlines (
  id text primary key, program_id text not null references programs(id) on delete cascade,
  cycle_label text not null, round_label text not null, date_note text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);
create table if not exists scholarships (
  id text primary key, scope text not null, scope_id text not null,
  name text not null, eligibility_note text not null default 'Doğrulama gerekli',
  amount_note text not null default 'Doğrulama gerekli',
  source_url text not null, source_status source_status not null default 'needs_review',
  needs_human_review boolean not null default true, review_status review_status not null default 'needs_review'
);

-- ---------- sources registry + review tasks ----------
create table if not exists sources (
  id bigserial primary key, entity_type text not null, entity_id text not null,
  url text not null, title text not null, source_type text not null,
  source_status source_status not null default 'needs_review',
  last_checked_at timestamptz not null default now(), next_review_at timestamptz
);
create table if not exists review_tasks (
  id bigserial primary key, entity_type text not null, entity_id text not null,
  entity_label text not null, reason text not null,
  status review_status not null default 'needs_review',
  source_status source_status not null default 'needs_review',
  assigned_to text, created_at timestamptz not null default now()
);

-- ---------- student-side + CRM ----------
create table if not exists student_profiles (
  id uuid primary key default gen_random_uuid(),
  target_country_code char(2), target_field text, gpa numeric, gpa_scale numeric default 4,
  curriculum_type text, exam_scores jsonb not null default '[]', english_level text,
  budget_band text default 'unknown', extracurriculars text, essay_readiness text default 'not_started',
  application_timeline text, created_at timestamptz not null default now()
);
create table if not exists student_matches (
  id bigserial primary key, student_id uuid references student_profiles(id) on delete cascade,
  program_id text references programs(id), category text not null, rationale_tr text,
  exam_gaps text[] default '{}', document_gaps text[] default '{}',
  essay_gaps text[] default '{}', deadline_warnings text[] default '{}'
);
create table if not exists essay_workflows (
  id uuid primary key default gen_random_uuid(), title text not null,
  stage text not null default 'discovery', discovery_answers jsonb not null default '[]',
  themes text[] default '{}', outline text[] default '{}', draft_excerpt text default '',
  advisor_feedback text default '', review_status review_status not null default 'needs_review',
  student_owned boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists advisor_notes (
  id uuid primary key default gen_random_uuid(), student_id uuid references student_profiles(id) on delete cascade,
  author text not null, body_tr text not null, visibility text not null default 'internal',
  created_at timestamptz not null default now()
);
create table if not exists leads (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null,
  target_country text, target_field text, stage text not null default 'new',
  source text, notes text default '', created_at timestamptz not null default now()
);

-- ---------- guard: protect curated rows from ingestion overwrite ----------
-- Application import layer must use: INSERT ... ON CONFLICT DO UPDATE ... WHERE NOT excluded.is_curated
-- AND target.is_curated = false;  (curated rows are immutable to the importer.)
