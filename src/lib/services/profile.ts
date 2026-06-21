// src/lib/services/profile.ts
// Profile analysis. Produces Reach/Match/Safety *suggestions* and gap analysis.
// This is NOT an admission decision and carries no guarantee. All requirement
// data is "Doğrulama gerekli" until curated, so gaps are framed as checks to do.
import type { Program, StudentProgramMatch } from "@/lib/types";
import { getProgramsFiltered } from "@/lib/repositories";

export interface ProfileInput {
  targetCountryCode: string;
  targetField: string;
  gpa: number | null;
  gpaScale: number;
  curriculumType: string;
  examScores: { exam: string; score: string }[];
  englishLevel: string;
  budgetBand: "low" | "mid" | "high" | "unknown";
  extracurriculars: string;
  essayReadiness: "not_started" | "draft" | "reviewed" | "final";
  applicationTimeline: string;
}

export interface ProfileResult {
  matches: StudentProgramMatch[];
  examGaps: string[];
  documentGaps: string[];
  essayGaps: string[];
  deadlineWarnings: string[];
  disclaimer: string;
}

const DISCLAIMER =
  "Bu analiz bir kabul değerlendirmesi değildir ve hiçbir kabul garantisi vermez. " +
  "Tüm kurum/program gereklilikleri resmî kaynaklardan teyit edilmelidir (Doğrulama gerekli).";

function categorize(p: Program, input: ProfileInput): "reach" | "match" | "safety" {
  // Heuristic only — requirements are unverified, so we lean on a coarse signal.
  const curated = p.source_type === "official_website";
  const gpaNorm = input.gpa != null ? input.gpa / (input.gpaScale || 4) : null;
  if (curated && (gpaNorm == null || gpaNorm < 0.85)) return "reach";
  if (gpaNorm != null && gpaNorm >= 0.9) return "safety";
  return "match";
}

export function analyzeProfile(input: ProfileInput): ProfileResult {
  const candidates = getProgramsFiltered({
    field: input.targetField,
    countryCode: input.targetCountryCode || undefined,
  });

  const matches: StudentProgramMatch[] = candidates.slice(0, 12).map((p) => {
    const category = categorize(p, input);
    return {
      program_id: p.id,
      program_name: p.name_tr,
      university_name: p.university_name,
      category,
      rationale_tr:
        category === "reach"
          ? "Seçici/küratör program. Profilini güçlendirmek faydalı olur."
          : category === "safety"
          ? "Akademik profilin bu programla uyumlu görünüyor (teyit gerekli)."
          : "Dengeli bir hedef. Gereklilikleri resmî kaynaktan kontrol et.",
      exam_gaps: ["Sınav gereklilikleri resmî sayfadan teyit edilmeli (Doğrulama gerekli)"],
      document_gaps: ["Belge listesi resmî sayfadan teyit edilmeli (Doğrulama gerekli)"],
      essay_gaps:
        input.essayReadiness === "not_started"
          ? ["Essay/niyet mektubu henüz başlamadı — keşif aşamasıyla başla."]
          : [],
      deadline_warnings: ["Başvuru takvimi resmî sayfadan teyit edilmeli (Doğrulama gerekli)"],
    };
  });

  const examGaps: string[] = [];
  if (!input.examScores.some((e) => ["IELTS", "TOEFL", "Duolingo English Test", "PTE Academic"].includes(e.exam))) {
    examGaps.push("İngilizce yeterlik sınavı (IELTS/TOEFL vb.) skoru görünmüyor.");
  }
  if (input.targetCountryCode === "US" && !input.examScores.some((e) => ["SAT", "ACT"].includes(e.exam))) {
    examGaps.push("ABD hedefi için SAT/ACT durumunu kontrol et (kurum test politikası değişebilir).");
  }

  const documentGaps = ["Transkript, referans/öneri mektupları ve pasaport için kontrol listesi oluştur."];
  const essayGaps =
    input.essayReadiness === "not_started" || input.essayReadiness === "draft"
      ? ["Essay süreci erken aşamada — keşif sorularıyla temayı netleştir."]
      : [];
  const deadlineWarnings =
    !input.applicationTimeline || input.applicationTimeline.toLowerCase().includes("geç")
      ? ["Başvuru takvimin dar olabilir — erken/round son tarihlerini doğrula."]
      : [];

  return { matches, examGaps, documentGaps, essayGaps, deadlineWarnings, disclaimer: DISCLAIMER };
}
