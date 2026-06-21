// src/lib/data/universities/index.ts
import type { University } from "@/lib/types";
import { curatedUniversities } from "./_curated";
import { generatedUniversities } from "./generated";

/**
 * Merge policy: curated records win on id OR slug conflict; generated records
 * fill the rest. Curated data is never overwritten.
 */
function mergeUniversities(): University[] {
  const curatedIds = new Set(curatedUniversities.map((u) => u.id));
  const curatedSlugs = new Set(curatedUniversities.map((u) => u.slug));
  const generatedFiltered = generatedUniversities.filter(
    (u) => !curatedIds.has(u.id) && !curatedSlugs.has(u.slug),
  );
  return [...curatedUniversities, ...generatedFiltered];
}

export const universities: University[] = mergeUniversities();
