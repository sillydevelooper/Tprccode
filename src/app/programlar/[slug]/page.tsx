import { notFound } from "next/navigation";
import Link from "next/link";
import { getIndexableProgramSlugs, getProgramBySlug, getUniversityBySlug } from "@/lib/repositories";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { SourceVerificationBox, FieldValue } from "@/components/Badges";
import { buildMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";

export const dynamicParams = true;
export function generateStaticParams() {
  return getIndexableProgramSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProgramBySlug(params.slug);
  if (!p) return buildMetadata({ title: "Program bulunamadı", path: `/programlar/${params.slug}`, noindex: true });
  const noindex = !(p.review_status === "approved" || p.source_type === "official_website");
  return buildMetadata({
    title: `${p.name_tr} — ${p.university_name}`,
    description: `${p.university_name} ${p.name_tr} programı için kabul, sınav, essay ve son tarih notları. Doğrulanmamış alanlar 'Doğrulama gerekli'.`,
    path: `/programlar/${p.slug}`,
    noindex,
  });
}

const FIELDS: [string, (p: NonNullable<ReturnType<typeof getProgramBySlug>>) => string][] = [
  ["Akademik beklentiler", (p) => p.academic_expectation_notes],
  ["Sınav gereklilikleri", (p) => p.exam_requirement_summary],
  ["İngilizce yeterlik", (p) => p.english_requirement_summary],
  ["Essay / niyet mektubu", (p) => p.essay_requirement_summary],
  ["Belgeler", (p) => p.document_requirement_summary],
  ["Son tarihler", (p) => p.deadline_summary],
  ["Burs notları", (p) => p.scholarship_notes],
  ["Uygunluk notları", (p) => p.fit_notes],
];

export default function ProgramDetail({ params }: { params: { slug: string } }) {
  const p = getProgramBySlug(params.slug);
  if (!p) notFound();
  const uni = getUniversityBySlug(
    // best-effort link by name slug
    p.university_name.toLowerCase().normalize("NFKD").replace(/[^\w]+/g, "-").replace(/(^-|-$)/g, ""),
  );

  return (
    <div className="container-page py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(
        breadcrumbJsonLd([{ name: "Programlar", path: "/programlar" }, { name: p.name_tr, path: `/programlar/${p.slug}` }]),
      )} />
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Programlar", href: "/programlar" }, { name: p.name_tr }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <PageHeader eyebrow={`${p.university_name} · ${p.degree_level.toUpperCase()}`} title={p.name_tr} />
          <p className="mt-2 text-ink-muted">{p.name_en}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="badge border-line bg-parchment text-ink-soft">{p.field.replace(/_/g, " ")}</span>
            {uni && <Link href={`/universiteler/${uni.slug}`} className="text-verify-ink hover:underline">{uni.name} →</Link>}
          </div>

          <div className="mt-6 card divide-y divide-line">
            {FIELDS.map(([label, get]) => (
              <div key={label} className="grid gap-1 px-5 py-4 sm:grid-cols-[200px_1fr]">
                <div className="text-sm text-ink-muted">{label}</div>
                <div className="text-sm"><FieldValue value={get(p)} /></div>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-card border border-line bg-white px-4 py-3 text-sm text-ink-muted">
            Bu sayfadaki kabul bilgileri yalnızca resmî program sayfasından teyit edildikten sonra
            “onaylı” sayılır. Lütfen başvuru kararlarını resmî kaynakla doğrula.
          </p>
        </div>

        <div className="lg:pt-2"><SourceVerificationBox meta={p} /></div>
      </div>
    </div>
  );
}
