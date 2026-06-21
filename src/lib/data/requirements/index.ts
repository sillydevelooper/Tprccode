// src/lib/data/requirements/index.ts
// Seed structures for requirements data. Real records are attached per-program as
// they are curated from official sources; until then UI shows "Doğrulama gerekli".
import type {
  ExamRequirement, EssayRequirement, DocumentRequirement, Deadline, Scholarship,
  ApplicationPlatform, ExamKind,
} from "@/lib/types";

/** Catalog of exams the model supports (identity only, no fabricated scores). */
export const SUPPORTED_EXAMS: { kind: ExamKind; label: string; group: string }[] = [
  { kind: "SAT", label: "SAT", group: "Lisans giriş" },
  { kind: "ACT", label: "ACT", group: "Lisans giriş" },
  { kind: "AP", label: "AP", group: "Müfredat" },
  { kind: "IB", label: "IB Diploma", group: "Müfredat" },
  { kind: "A-Level", label: "A-Level", group: "Müfredat" },
  { kind: "IELTS", label: "IELTS", group: "İngilizce yeterlik" },
  { kind: "TOEFL", label: "TOEFL", group: "İngilizce yeterlik" },
  { kind: "Duolingo English Test", label: "Duolingo English Test", group: "İngilizce yeterlik" },
  { kind: "PTE Academic", label: "PTE Academic", group: "İngilizce yeterlik" },
  { kind: "Cambridge English", label: "Cambridge English", group: "İngilizce yeterlik" },
  { kind: "GRE", label: "GRE", group: "Lisansüstü" },
  { kind: "GMAT", label: "GMAT", group: "Lisansüstü" },
  { kind: "LNAT", label: "LNAT", group: "Program özel" },
  { kind: "UCAT", label: "UCAT", group: "Program özel" },
  { kind: "BMAT", label: "BMAT", group: "Program özel" },
  { kind: "country_specific_entrance", label: "Ülkeye özel giriş sınavı", group: "Ülke özel" },
  { kind: "program_specific", label: "Programa özel sınav", group: "Program özel" },
  { kind: "portfolio", label: "Portfolyo", group: "Değerlendirme" },
  { kind: "interview", label: "Mülakat", group: "Değerlendirme" },
  { kind: "audition", label: "Seçme (audition)", group: "Değerlendirme" },
];

export const examRequirements: ExamRequirement[] = [];
export const essayRequirements: EssayRequirement[] = [];
export const documentRequirements: DocumentRequirement[] = [];
export const deadlines: Deadline[] = [];
export const scholarships: Scholarship[] = [];

export const applicationPlatforms: ApplicationPlatform[] = [
  { id: "plat-commonapp", name: "Common App", countries: ["US"], url: "https://www.commonapp.org", notes: "ABD lisans başvuruları" },
  { id: "plat-ucas", name: "UCAS", countries: ["GB"], url: "https://www.ucas.com", notes: "Birleşik Krallık lisans başvuruları" },
  { id: "plat-studielink", name: "Studielink", countries: ["NL"], url: "https://www.studielink.nl", notes: "Hollanda başvuruları" },
  { id: "plat-uniassist", name: "uni-assist", countries: ["DE"], url: "https://www.uni-assist.de", notes: "Almanya uluslararası başvuru" },
  { id: "plat-cao", name: "CAO", countries: ["IE"], url: "https://www.cao.ie", notes: "İrlanda lisans başvuruları" },
];
