// src/lib/types/index.ts
// Strong types for every TestPrep Admissions data model.
// Source-first + audit-first: every source-based record carries provenance &
// review metadata via the SourceMeta mixin.

/* ------------------------------------------------------------------ enums */

export type ReviewStatus = "approved" | "needs_review" | "rejected" | "archived";

export type SourceStatus =
  | "verified"
  | "needs_review"
  | "stale"
  | "broken"
  | "unknown";

export type SourceType =
  | "official_website"
  | "reference_list"
  | "reference_standard"
  | "government"
  | "ranking_aggregator"
  | "sitemap"
  | "jsonld"
  | "manual"
  | "unknown";

export type InstitutionCategory =
  | "curated_university"
  | "university"
  | "college"
  | "institute"
  | "academy"
  | "school"
  | "research_institute"
  | "medical_center"
  | "government_agency"
  | "company_or_non_education"
  | "unknown";

export type PublicVisibility = "visible" | "review_only" | "hidden";

export type DegreeLevel =
  | "associate"
  | "bachelor"
  | "master"
  | "phd"
  | "diploma"
  | "certificate"
  | "foundation"
  | "unknown";

export type CrawlTier =
  | "tier_0_curated"
  | "tier_1_high_priority"
  | "tier_2_priority"
  | "tier_3_broad"
  | "tier_4_review_only";

export type ProgramField =
  | "computer_science" | "engineering" | "business" | "economics" | "psychology"
  | "medicine_health" | "law" | "political_science" | "international_relations"
  | "data_science_ai" | "architecture" | "design" | "finance" | "biology"
  | "physics" | "mathematics" | "communications_media" | "education"
  | "environmental_science" | "chemistry" | "philosophy" | "sociology"
  | "arts_humanities" | "social_sciences" | "natural_sciences" | "public_policy"
  | "agriculture" | "music" | "sports" | "hospitality" | "translation"
  | "library_science" | "theology" | "social_work" | "public_health" | "pharmacy"
  | "nursing" | "film_cinema" | "theater" | "other";

export type ExamKind =
  | "SAT" | "ACT" | "AP" | "IB" | "A-Level" | "IELTS" | "TOEFL"
  | "Duolingo English Test" | "PTE Academic" | "Cambridge English" | "GRE"
  | "GMAT" | "LNAT" | "UCAT" | "BMAT" | "country_specific_entrance"
  | "program_specific" | "portfolio" | "interview" | "audition" | "other";

/* --------------------------------------------------------- shared mixin */

/** Provenance + review metadata required on every source-based record. */
export interface SourceMeta {
  source_url: string;
  source_title: string;
  source_type: SourceType;
  source_status: SourceStatus;
  last_checked_at: string; // ISO
  next_review_at: string; // ISO
  confidence_score: number; // 0..1
  needs_human_review: boolean;
  review_status: ReviewStatus;
  reviewer_notes: string;
}

export interface SourceReference extends SourceMeta {
  id: string;
  entity_type: "country" | "university" | "program" | "requirement" | "deadline" | "scholarship";
  entity_id: string;
}

/** UI-facing placeholder for any unverified field. */
export const NEEDS_VERIFICATION = "Doğrulama gerekli" as const;

/* ------------------------------------------------------------ entities */

export interface Country extends SourceMeta {
  name_tr: string;
  name_en: string;
  slug: string;
  code: string; // ISO 3166-1 alpha-2
  region: string;
  popular_admission_systems: string[];
  common_application_platforms: string[];
  english_proficiency_notes: string;
  essay_or_statement_notes: string;
  typical_deadline_notes: string;
  scholarship_notes: string;
  turkish_students_notes: string;
}

export interface University extends SourceMeta {
  id: string;
  name: string;
  slug: string;
  country_code: string;
  country_name: string;
  city: string;
  type: string;
  website_url: string;
  admissions_url: string;
  application_platforms: string[];
  popular_program_areas: string[];
  general_international_admission_notes: string;
  testing_notes: string;
  english_proficiency_notes: string;
  essay_requirement_notes: string;
  scholarship_notes: string;
  // classification layer
  institution_category: InstitutionCategory;
  directory_priority: number;
  public_visibility: PublicVisibility;
  admissions_data_priority: number;
  classification_reason: string;
  classification_confidence: number;
  is_active: boolean;
}

export interface Program extends SourceMeta {
  id: string;
  name_tr: string;
  name_en: string;
  slug: string;
  university_id: string;
  university_name: string;
  country_code: string;
  degree_level: DegreeLevel;
  field: ProgramField;
  application_platform: string;
  academic_expectation_notes: string;
  exam_requirement_summary: string;
  english_requirement_summary: string;
  essay_requirement_summary: string;
  document_requirement_summary: string;
  deadline_summary: string;
  scholarship_notes: string;
  fit_notes: string;
}

export interface AdmissionRequirement extends SourceMeta {
  id: string;
  program_id: string;
  category: "academic" | "language" | "exam" | "document" | "other";
  label_tr: string;
  detail_tr: string;
}

export interface ExamRequirement extends SourceMeta {
  id: string;
  program_id: string;
  exam: ExamKind;
  exam_label: string;
  is_required: boolean;
  min_score_note: string; // never invented; "Doğrulama gerekli" by default
}

export interface EssayRequirement extends SourceMeta {
  id: string;
  program_id: string;
  essay_type: "personal_statement" | "supplemental" | "motivation_letter" | "statement_of_purpose" | "other";
  prompt_summary: string;
  word_limit_note: string;
}

export interface DocumentRequirement extends SourceMeta {
  id: string;
  program_id: string;
  document: string;
  is_required: boolean;
  detail_tr: string;
}

export interface Deadline extends SourceMeta {
  id: string;
  program_id: string;
  cycle_label: string;
  round_label: string;
  date_note: string; // "Doğrulama gerekli" unless source-verified
}

export interface Scholarship extends SourceMeta {
  id: string;
  scope: "country" | "university" | "program";
  scope_id: string;
  name: string;
  eligibility_note: string;
  amount_note: string;
}

export interface ApplicationPlatform {
  id: string;
  name: string;
  countries: string[];
  url: string;
  notes: string;
}

export interface AdmissionCycle {
  id: string;
  label: string;
  country_code: string;
  opens_note: string;
  closes_note: string;
}

/* -------------------------------------------------- student-side models */

export interface StudentProfile {
  id: string;
  target_country_code: string;
  target_field: ProgramField | string;
  gpa: number | null;
  gpa_scale: number;
  curriculum_type: string;
  exam_scores: { exam: ExamKind; score: string }[];
  english_level: string;
  budget_band: "low" | "mid" | "high" | "unknown";
  extracurriculars: string;
  essay_readiness: "not_started" | "draft" | "reviewed" | "final";
  application_timeline: string;
  created_at: string;
}

export interface StudentProgramMatch {
  program_id: string;
  program_name: string;
  university_name: string;
  category: "reach" | "match" | "safety";
  rationale_tr: string;
  exam_gaps: string[];
  document_gaps: string[];
  essay_gaps: string[];
  deadline_warnings: string[];
}

export interface EssayDiscoveryAnswer {
  question_id: string;
  question_tr: string;
  answer: string;
}

export interface EssayWorkflow {
  id: string;
  title: string;
  stage: "discovery" | "theme" | "outline" | "draft" | "review" | "final";
  discovery_answers: EssayDiscoveryAnswer[];
  themes: string[];
  outline: string[];
  draft_excerpt: string;
  advisor_feedback: string;
  review_status: ReviewStatus;
  student_owned: true; // always student-owned; we never ghostwrite
  created_at: string;
  updated_at: string;
}

export interface AdvisorNote {
  id: string;
  student_id: string;
  author: string;
  body_tr: string;
  created_at: string;
  visibility: "internal" | "shared_with_student";
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  target_country: string;
  target_field: string;
  stage: "new" | "contacted" | "qualified" | "consult_booked" | "won" | "lost";
  source: string;
  created_at: string;
  notes: string;
}

/* ----------------------------------------------------- review workflow */

export interface DataReviewTask {
  id: string;
  entity_type: "country" | "university" | "program" | "requirement" | "deadline" | "scholarship";
  entity_id: string;
  entity_label: string;
  reason: string;
  status: ReviewStatus;
  source_status: SourceStatus;
  assigned_to: string | null;
  created_at: string;
}

/* ------------------------------------------------------------- helpers */

export const REVIEW_STATUS_TR: Record<ReviewStatus, string> = {
  approved: "Onaylandı",
  needs_review: "İnceleme gerekli",
  rejected: "Reddedildi",
  archived: "Arşivlendi",
};

export const SOURCE_STATUS_TR: Record<SourceStatus, string> = {
  verified: "Doğrulandı",
  needs_review: "İnceleme gerekli",
  stale: "Güncellenmeli",
  broken: "Kaynak bozuk",
  unknown: "Bilinmiyor",
};

export const VISIBILITY_TR: Record<PublicVisibility, string> = {
  visible: "Yayında",
  review_only: "Yalnızca inceleme",
  hidden: "Gizli",
};
