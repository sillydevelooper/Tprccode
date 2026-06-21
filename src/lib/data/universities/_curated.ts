// src/lib/data/universities/_curated.ts
// Human-curated university overrides. These ALWAYS win over generated records
// on id/slug conflict and are never overwritten by build scripts.
// Curated identity for priority institutions is already flagged in the generated
// data (institution_category = "curated_university"); add full hand-verified
// admissions content here as it is reviewed.
import type { University } from "@/lib/types";

export const curatedUniversities: University[] = [];
