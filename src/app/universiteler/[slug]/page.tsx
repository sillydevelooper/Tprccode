import { notFound } from "next/navigation";
import Link from "next/link";
import { getCuratedUniversitySlugs, getUniversityBySlug, getProgramsByUniversity } from "@/lib/repositories";
import { Breadcrumbs, PageHeader, ProgramCard, EmptyState } from "@/components/ui/Primitives";
import { SourceVerificationBox, FieldValue } from "@/components/Badges";
import { buildMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

// Curated/priority universities are statically generated; the rest render
// on-demand (still server-rendered) so we don't pre-promote unreviewed pages.
export const dynamicParams = true;
export function generateStaticParams() {
  return getCuratedUniversitySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const u = getUniversityBySlug(params.slug);
  if (!u) return buildMetadata({ title: "Üniversite bulunamadı", path: `/universiteler/${params.slug}`, noindex: true });
  const noindex = u.public_visibility !== "visible";
  return buildMetadata({
    title: `${u.name} — kabul bilgileri`,
    description: `${u.name} (${u.country_name}) için başvuru platformları, sınav/İngilizce/essay notları. Doğrulanmamış alanlar 'Doğrulama gerekli'.`,
    path: `/universiteler/${u.slug}`,
    noindex,
  });
}

const FIELDS: [string, (u: NonNullable<ReturnType<typeof getUniversityBySlug>>) => string][] = [
  ["Genel uluslararası kabul", (u) => u.general_international_admission_notes],
  ["Sınav notları", (u) => u.testing_notes],
  ["İngilizce yeterlik", (u) => u.english_proficiency_notes],
  ["Essay gereklilikleri", (u) => u.essay_requirement_notes],
  ["Burs notları", (u) => u.scholarship_notes],
  ["Başvuru sayfası", (u) => u.admissions_url],
];

export default function UniversityDetail({ params }: { params: { slug: string } }) {
  const u = getUniversityBySlug(params.slug);
  if (!u) notFound();
  const programs = getProgramsByUniversity(u.id);

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(
        breadcrumbJsonLd([{ name: "Üniversiteler", path: "/universiteler" }, { name: u.name, path: `/universiteler/${u.slug}` }]),
      )} />
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Üniversiteler", href: "/universiteler" }, { name: u.name }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <PageHeader
            eyebrow={`${u.city !== "Doğrulama gerekli" ? u.city + " · " : ""}${u.country_name}`}
            title={u.name}
          />
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href={`/ulkeler`} className="text-verify-ink hover:underline">{u.country_name}</Link>
            {u.website_url !== "Doğrulama gerekli" && (
              <a href={u.website_url} target="_blank" rel="noopener noreferrer" className="text-verify-ink hover:underline">Resmî site ↗</a>
            )}
            <span className="badge border-line bg-parchment text-ink-soft">{u.type}</span>
          </div>

          <div className="mt-6 card divide-y divide-line">
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr]">
              <div className="text-sm text-ink-muted">Başvuru platformları</div>
              <div className="flex flex-wrap gap-2 text-sm">
                {u.application_platforms.map((p, i) => p === "Doğrulama gerekli"
                  ? <FieldValue key={i} value={p} />
                  : <span key={i} className="badge border-line bg-parchment text-ink-soft">{p}</span>)}
              </div>
            </div>
            {FIELDS.map(([label, get]) => (
              <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr]">
                <div className="text-sm text-ink-muted">{label}</div>
                <div className="text-sm"><FieldValue value={get(u)} /></div>
              </div>
            ))}
          </div>

          <h2 className="h-display mt-10 text-xl">Programlar ({programs.length})</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {programs.length ? programs.map((p) => <ProgramCard key={p.id} p={p} />)
              : <EmptyState title="Bu üniversite için program verisi henüz eklenmedi" hint="Program ingestion pipeline’ı ile eklenir." />}
          </div>
        </div>

        <div className="lg:pt-2"><SourceVerificationBox meta={u} /></div>
      </div>
    </div>
  );
}
