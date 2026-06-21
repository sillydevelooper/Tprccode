import Link from "next/link";
import { getPublicUniversities, getCountriesWithUniversities } from "@/lib/repositories";
import { Breadcrumbs, PageHeader, UniversityCard, EmptyState } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Üniversiteler",
  description: "Kaynak-temelli üniversite dizini. Her kayıtta kaynak ve inceleme durumu görünür; kabul detayları teyit edilene kadar 'Doğrulama gerekli'.",
  path: "/universiteler",
});

export default function UniversitiesPage({
  searchParams,
}: { searchParams: { ulke?: string; q?: string; sayfa?: string } }) {
  const page = Math.max(1, parseInt(searchParams.sayfa || "1", 10) || 1);
  const result = getPublicUniversities({
    countryCode: searchParams.ulke,
    search: searchParams.q,
    page,
    pageSize: 24,
  });
  const countries = getCountriesWithUniversities();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Üniversiteler" }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Dizin" title="Üniversiteler"
          lead="Yalnızca eğitim kurumu kategorisindeki ve yayında olan kayıtlar listelenir. Araştırma/şirket gibi kayıtlar yalnızca inceleme panelinde görünür." />
      </div>

      {/* filters (GET form, server-rendered) */}
      <form className="mt-6 flex flex-wrap items-end gap-3" action="/universiteler">
        <label className="text-sm">
          <span className="mb-1 block text-ink-muted">Ara</span>
          <input name="q" defaultValue={searchParams.q} placeholder="Üniversite, şehir, ülke"
            className="w-64 rounded-card border border-line bg-white px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-ink-muted">Ülke</span>
          <select name="ulke" defaultValue={searchParams.ulke || ""}
            className="rounded-card border border-line bg-white px-3 py-2 text-sm">
            <option value="">Tümü</option>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name_tr}</option>)}
          </select>
        </label>
        <button className="btn-primary" type="submit">Filtrele</button>
        <span className="text-sm text-ink-muted">{result.total} sonuç</span>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.length ? result.items.map((u) => <UniversityCard key={u.id} u={u} />)
          : <EmptyState title="Sonuç bulunamadı" hint="Filtreleri değiştirip tekrar dene." />}
      </div>

      {result.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: result.totalPages }).map((_, i) => {
            const n = i + 1;
            const qs = new URLSearchParams({ ...(searchParams.q ? { q: searchParams.q } : {}), ...(searchParams.ulke ? { ulke: searchParams.ulke } : {}), sayfa: String(n) });
            return (
              <Link key={n} href={`/universiteler?${qs.toString()}`}
                className={`rounded-card border px-3 py-1.5 ${n === page ? "border-ink bg-ink text-white" : "border-line bg-white hover:bg-parchment"}`}>
                {n}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
