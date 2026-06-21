import { notFound } from "next/navigation";
import { getAllCountries, getCountryBySlug, getUniversitiesByCountry } from "@/lib/repositories";
import { Breadcrumbs, PageHeader, UniversityCard, EmptyState } from "@/components/ui/Primitives";
import { SourceVerificationBox, FieldValue } from "@/components/Badges";
import { buildMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export function generateStaticParams() {
  return getAllCountries().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = getCountryBySlug(params.slug);
  if (!c) return buildMetadata({ title: "Ülke bulunamadı", path: `/ulkeler/${params.slug}`, noindex: true });
  return buildMetadata({
    title: `${c.name_tr} — üniversite kabul rehberi`,
    description: `${c.name_tr} için kabul sistemleri, başvuru platformları ve üniversiteler. Doğrulanmamış detaylar 'Doğrulama gerekli'.`,
    path: `/ulkeler/${c.slug}`,
  });
}

const ROWS: [string, (c: ReturnType<typeof getCountryBySlug>) => string][] = [
  ["İngilizce yeterlik notları", (c) => c!.english_proficiency_notes],
  ["Essay / niyet mektubu notları", (c) => c!.essay_or_statement_notes],
  ["Tipik son tarih notları", (c) => c!.typical_deadline_notes],
  ["Burs notları", (c) => c!.scholarship_notes],
  ["Türk öğrenciler için notlar", (c) => c!.turkish_students_notes],
];

export default function CountryDetail({ params }: { params: { slug: string } }) {
  const c = getCountryBySlug(params.slug);
  if (!c) notFound();
  const unis = getUniversitiesByCountry(c.code);

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(
        breadcrumbJsonLd([{ name: "Ülkeler", path: "/ulkeler" }, { name: c.name_tr, path: `/ulkeler/${c.slug}` }]),
      )} />
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Ülkeler", href: "/ulkeler" }, { name: c.name_tr }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <PageHeader eyebrow={`${c.region} · ${c.code}`} title={c.name_tr} />

          <div className="mt-6 card divide-y divide-line">
            <Row label="Yaygın kabul sistemleri" values={c.popular_admission_systems} />
            <Row label="Başvuru platformları" values={c.common_application_platforms} />
            {ROWS.map(([label, get]) => (
              <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr]">
                <div className="text-sm text-ink-muted">{label}</div>
                <div className="text-sm"><FieldValue value={get(c)} /></div>
              </div>
            ))}
          </div>

          <h2 className="h-display mt-10 text-xl">{c.name_tr} üniversiteleri ({unis.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {unis.length ? unis.map((u) => <UniversityCard key={u.id} u={u} />)
              : <EmptyState title="Bu ülke için üniversite verisi henüz eklenmedi" hint="Ingestion pipeline ağ erişimiyle çalıştığında bu liste dolacaktır." />}
          </div>
        </div>

        <div className="lg:pt-2"><SourceVerificationBox meta={c} /></div>
      </div>
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr]">
      <div className="text-sm text-ink-muted">{label}</div>
      <div className="flex flex-wrap gap-2 text-sm">
        {values.map((v, i) => v === "Doğrulama gerekli"
          ? <FieldValue key={i} value={v} />
          : <span key={i} className="badge border-line bg-parchment text-ink-soft">{v}</span>)}
      </div>
    </div>
  );
}
