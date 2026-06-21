// src/lib/repositories/index.ts
// Static repository layer. Swap these implementations for Supabase queries later
// without touching the UI — pages only call these functions.
import type {
  Country, University, Program, PublicVisibility, InstitutionCategory,
} from "@/lib/types";
import { countries } from "@/lib/data/countries";
import { universities } from "@/lib/data/universities";
import { programs } from "@/lib/data/programs";

/* ---------------------------------------------------------- countries */

export function getAllCountries(): Country[] {
  return [...countries].sort((a, b) => a.name_tr.localeCompare(b.name_tr, "tr"));
}

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code.toUpperCase());
}

export function getCountriesWithUniversities(): Country[] {
  const codes = new Set(universities.map((u) => u.country_code));
  return getAllCountries().filter((c) => codes.has(c.code));
}

/* -------------------------------------------------------- universities */

const PUBLIC_CATEGORIES: InstitutionCategory[] = [
  "curated_university", "university", "college", "institute", "academy", "school",
];

export interface UniversityQuery {
  countryCode?: string;
  search?: string;
  visibility?: PublicVisibility;
  page?: number;
  pageSize?: number;
}

/** Public listing: only visible + public categories + active. */
export function getPublicUniversities(q: UniversityQuery = {}) {
  let list = universities.filter(
    (u) => u.is_active && u.public_visibility === "visible" &&
      PUBLIC_CATEGORIES.includes(u.institution_category),
  );
  if (q.countryCode) list = list.filter((u) => u.country_code === q.countryCode!.toUpperCase());
  if (q.search) {
    const s = q.search.toLocaleLowerCase("tr");
    list = list.filter((u) =>
      u.name.toLocaleLowerCase("tr").includes(s) ||
      u.country_name.toLocaleLowerCase("tr").includes(s) ||
      (u.city || "").toLocaleLowerCase("tr").includes(s));
  }
  list.sort((a, b) => a.directory_priority - b.directory_priority || a.name.localeCompare(b.name));
  const page = q.page ?? 1, pageSize = q.pageSize ?? 24;
  const total = list.length;
  const items = list.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

/** All universities (admin/review use). */
export function getAllUniversities(): University[] {
  return universities;
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
}

export function getUniversitiesByCountry(code: string): University[] {
  return universities.filter(
    (u) => u.country_code === code.toUpperCase() &&
      u.public_visibility === "visible" && u.is_active,
  );
}

/** Curated/priority universities for SSG. */
export function getCuratedUniversitySlugs(): string[] {
  return universities
    .filter((u) => u.institution_category === "curated_university")
    .map((u) => u.slug);
}

/* ------------------------------------------------------------ programs */

export function getAllPrograms(): Program[] {
  return programs;
}

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export function getProgramsByUniversity(universityId: string): Program[] {
  return programs.filter((p) => p.university_id === universityId);
}

export function getProgramsByField(field: string): Program[] {
  return programs.filter((p) => p.field === field);
}

/** Programs eligible for SSG: curated + approved. Generated/needs_review = dynamic. */
export function getIndexableProgramSlugs(): string[] {
  return programs
    .filter((p) => p.review_status === "approved" || p.source_type === "official_website")
    .map((p) => p.slug);
}

export interface ProgramQuery { field?: string; countryCode?: string; search?: string; }
export function getProgramsFiltered(q: ProgramQuery = {}): Program[] {
  let list = [...programs];
  if (q.field) list = list.filter((p) => p.field === q.field);
  if (q.countryCode) list = list.filter((p) => p.country_code === q.countryCode!.toUpperCase());
  if (q.search) {
    const s = q.search.toLocaleLowerCase("tr");
    list = list.filter((p) =>
      p.name_tr.toLocaleLowerCase("tr").includes(s) ||
      p.name_en.toLocaleLowerCase("tr").includes(s) ||
      p.university_name.toLocaleLowerCase("tr").includes(s));
  }
  return list;
}

/* --------------------------------------------------------------- stats */

export function getPlatformStats() {
  const visible = universities.filter((u) => u.public_visibility === "visible").length;
  const reviewOnly = universities.filter((u) => u.public_visibility === "review_only").length;
  const hidden = universities.filter((u) => u.public_visibility === "hidden").length;
  const curated = universities.filter((u) => u.institution_category === "curated_university").length;
  const countriesWithUnis = new Set(universities.map((u) => u.country_code)).size;
  return {
    countries: countries.length,
    universities: universities.length,
    visible, reviewOnly, hidden, curated,
    generated: universities.length - curated,
    programs: programs.length,
    countriesWithUnis,
  };
}
