// src/lib/data/programs/index.ts
import type { Program } from "@/lib/types";
import { curatedPrograms } from "./_curated";
import { generatedPrograms } from "./generated";

/** Curated programs win on id/slug conflict; generated batches fill the rest. */
function mergePrograms(): Program[] {
  const ids = new Set(curatedPrograms.map((p) => p.id));
  const slugs = new Set(curatedPrograms.map((p) => p.slug));
  const gen = generatedPrograms.filter((p) => !ids.has(p.id) && !slugs.has(p.slug));
  return [...curatedPrograms, ...gen];
}

export const programs: Program[] = mergePrograms();
