// src/lib/data/programs/_curated.ts
// Human-curated REAL programs. Identity (program exists at this university) is
// verified; admission requirements are NOT invented — they default to
// "Doğrulama gerekli" until curated against official program pages.
// Curated programs ALWAYS win over generated batches on id/slug conflict.
import type { Program } from "@/lib/types";

const NEEDS = "Doğrulama gerekli";
const now = "2026-06-21T00:00:00Z";
const next = "2026-12-21T00:00:00Z";

function p(o: Partial<Program> & Pick<Program,
  "id" | "name_tr" | "name_en" | "slug" | "university_id" | "university_name" |
  "country_code" | "field" | "source_url">): Program {
  return {
    degree_level: "bachelor",
    application_platform: NEEDS,
    academic_expectation_notes: NEEDS,
    exam_requirement_summary: NEEDS,
    english_requirement_summary: NEEDS,
    essay_requirement_summary: NEEDS,
    document_requirement_summary: NEEDS,
    deadline_summary: NEEDS,
    scholarship_notes: NEEDS,
    fit_notes: NEEDS,
    source_title: "Resmî program sayfası",
    source_type: "official_website",
    source_status: "needs_review",
    last_checked_at: now,
    next_review_at: next,
    confidence_score: 0.8,
    needs_human_review: true,
    review_status: "needs_review",
    reviewer_notes: "Program kimliği küratör onaylı; kabul detayları doğrulanmadı.",
    ...o,
  } as Program;
}

export const curatedPrograms: Program[] = [
  p({ id: "p-nl-tudelft-cse-bsc", name_tr: "Bilgisayar Bilimi ve Mühendisliği (BSc)", name_en: "Computer Science and Engineering (BSc)", slug: "tu-delft-computer-science-engineering-bsc", university_id: "u-nl-delft-university-of-technology", university_name: "Delft University of Technology", country_code: "NL", field: "computer_science", source_url: "https://www.tudelft.nl/en/education/programmes/bachelors/computer-science-and-engineering/" }),
  p({ id: "p-nl-tudelft-aerospace-bsc", name_tr: "Havacılık ve Uzay Mühendisliği (BSc)", name_en: "Aerospace Engineering (BSc)", slug: "tu-delft-aerospace-engineering-bsc", university_id: "u-nl-delft-university-of-technology", university_name: "Delft University of Technology", country_code: "NL", field: "engineering", source_url: "https://www.tudelft.nl/en/education/programmes/bachelors/aerospace-engineering/" }),
  p({ id: "p-nl-uva-economics-bsc", name_tr: "Ekonomi ve İşletme Ekonomisi (BSc)", name_en: "Economics and Business Economics (BSc)", slug: "uva-economics-business-economics-bsc", university_id: "u-nl-university-of-amsterdam", university_name: "University of Amsterdam", country_code: "NL", field: "economics", source_url: "https://www.uva.nl/en/programmes" }),
  p({ id: "p-nl-leiden-iro-ba", name_tr: "Uluslararası İlişkiler ve Örgütler (BA)", name_en: "International Relations and Organisations (BA)", slug: "leiden-international-relations-organisations-ba", university_id: "u-nl-leiden-university", university_name: "Leiden University", country_code: "NL", field: "international_relations", source_url: "https://www.universiteitleiden.nl/en/education/study-programmes" }),
  p({ id: "p-it-bocconi-econ-mgmt-bsc", name_tr: "Ekonomi ve Yönetim (BSc)", name_en: "Economics and Management (BSc)", slug: "bocconi-economics-management-bsc", university_id: "u-it-bocconi-university", university_name: "Bocconi University", country_code: "IT", field: "economics", source_url: "https://www.unibocconi.it/en/programs" }),
  p({ id: "p-gb-oxford-ppe-ba", name_tr: "Felsefe, Siyaset ve Ekonomi (BA)", name_en: "Philosophy, Politics and Economics (BA)", slug: "oxford-ppe-ba", university_id: "u-gb-university-of-oxford", university_name: "University of Oxford", country_code: "GB", field: "political_science", source_url: "https://www.ox.ac.uk/admissions/undergraduate/courses" }),
  p({ id: "p-gb-imperial-computing-beng", name_tr: "Bilgisayar (BEng)", name_en: "Computing (BEng)", slug: "imperial-computing-beng", university_id: "u-gb-imperial-college-london", university_name: "Imperial College London", country_code: "GB", field: "computer_science", source_url: "https://www.imperial.ac.uk/study/courses/" }),
  p({ id: "p-ch-ethz-cs-bsc", name_tr: "Bilgisayar Bilimi (BSc)", name_en: "Computer Science (BSc)", slug: "ethz-computer-science-bsc", university_id: "u-ch-eth-zurich", university_name: "ETH Zurich", country_code: "CH", field: "computer_science", source_url: "https://ethz.ch/en/studies/bachelor/degree-programmes.html" }),
  p({ id: "p-tr-bogazici-cmpe-bs", name_tr: "Bilgisayar Mühendisliği (Lisans)", name_en: "Computer Engineering (BS)", slug: "bogazici-computer-engineering-bs", university_id: "u-tr-bogazici-university", university_name: "Boğaziçi University", country_code: "TR", field: "computer_science", source_url: "https://www.cmpe.boun.edu.tr/" }),
  p({ id: "p-tr-metu-cmpe-bs", name_tr: "Bilgisayar Mühendisliği (Lisans)", name_en: "Computer Engineering (BS)", slug: "metu-computer-engineering-bs", university_id: "u-tr-middle-east-technical-university", university_name: "Middle East Technical University", country_code: "TR", field: "computer_science", source_url: "https://ceng.metu.edu.tr/" }),
  p({ id: "p-tr-koc-cmpe-bs", name_tr: "Bilgisayar Mühendisliği (Lisans)", name_en: "Computer Engineering (BS)", slug: "koc-computer-engineering-bs", university_id: "u-tr-koc-university", university_name: "Koç University", country_code: "TR", field: "computer_science", source_url: "https://www.ku.edu.tr/en/academic-programs/" }),
  p({ id: "p-fr-sciencespo-ba", name_tr: "Sosyal Bilimler Lisansı", name_en: "Bachelor of Arts (Social Sciences)", slug: "sciencespo-bachelor-arts", university_id: "u-fr-sciences-po", university_name: "Sciences Po", country_code: "FR", field: "political_science", source_url: "https://www.sciencespo.fr/en/academics/undergraduate/" }),
];
