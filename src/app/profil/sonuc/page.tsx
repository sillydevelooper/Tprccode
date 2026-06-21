import Link from "next/link";
import { analyzeProfile } from "@/lib/services/profile";
import { Breadcrumbs, PageHeader, EmptyState } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Profil Analizi Sonucu", path: "/profil/sonuc", noindex: true });

const CAT_LABEL = { reach: "Reach", match: "Match", safety: "Safety" } as const;
const CAT_CLASS = {
  reach: "border-flag/30 bg-flag-soft text-flag",
  match: "border-verify/30 bg-verify-soft text-verify-ink",
  safety: "border-line bg-parchment text-ink-soft",
} as const;

export default function ResultPage({ searchParams }: { searchParams: Record<string, string> }) {
  const examScores: { exam: string; score: string }[] = [];
  if (searchParams.sat) examScores.push({ exam: "SAT", score: searchParams.sat });
  if (searchParams.ielts) examScores.push({ exam: "IELTS", score: searchParams.ielts });

  const result = analyzeProfile({
    targetCountryCode: searchParams.ulke || "",
    targetField: searchParams.alan || "computer_science",
    gpa: searchParams.gpa ? parseFloat(searchParams.gpa) : null,
    gpaScale: parseFloat(searchParams.scale || "4") || 4,
    curriculumType: searchParams.curriculum || "",
    examScores,
    englishLevel: searchParams.english || "",
    budgetBand: (searchParams.budget as any) || "unknown",
    extracurriculars: "",
    essayReadiness: (searchParams.essay as any) || "not_started",
    applicationTimeline: searchParams.timeline || "",
  });

  const groups = ["reach", "match", "safety"] as const;

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Profil Analizi", href: "/profil" }, { name: "Sonuç" }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Analiz" title="Profil Sonucun" />
      </div>

      <p className="mt-4 rounded-card border border-flag/30 bg-flag-soft px-4 py-3 text-sm text-flag">
        {result.disclaimer}
      </p>

      {result.matches.length === 0 ? (
        <div className="mt-8"><EmptyState title="Bu alan/ülke için program verisi henüz yok"
          hint="Program ingestion ile genişledikçe öneriler artacaktır. Şimdilik küratör programlarını /programlar altında inceleyebilirsin." /></div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {groups.map((g) => {
            const items = result.matches.filter((m) => m.category === g);
            return (
              <div key={g}>
                <h2 className="h-display mb-3 text-lg">{CAT_LABEL[g]} <span className="text-sm text-ink-muted">({items.length})</span></h2>
                <div className="space-y-3">
                  {items.map((m) => (
                    <div key={m.program_id} className="card p-4">
                      <span className={`badge ${CAT_CLASS[g]}`}>{CAT_LABEL[g]}</span>
                      <Link href={`/programlar/${m.program_id.replace(/^p-/, "")}`} className="mt-2 block font-display text-base text-ink hover:underline">
                        {m.program_name}
                      </Link>
                      <p className="text-sm text-ink-muted">{m.university_name}</p>
                      <p className="mt-2 text-sm">{m.rationale_tr}</p>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-sm text-ink-muted">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <GapCard title="Sınav eksikleri" items={result.examGaps} />
        <GapCard title="Belge eksikleri" items={result.documentGaps} />
        <GapCard title="Essay eksikleri" items={result.essayGaps} />
        <GapCard title="Son tarih uyarıları" items={result.deadlineWarnings} />
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/profil" className="btn-ghost">Profili düzenle</Link>
        <Link href="/essay" className="btn-primary">Essay sürecine geç</Link>
      </div>
    </div>
  );
}

function GapCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-display text-base text-ink">{title}</h3>
      {items.length ? (
        <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
          {items.map((it, i) => <li key={i} className="flex gap-2"><span className="text-flag" aria-hidden>•</span>{it}</li>)}
        </ul>
      ) : <p className="mt-2 text-sm text-ink-muted">Belirgin bir eksik görünmüyor.</p>}
    </div>
  );
}
