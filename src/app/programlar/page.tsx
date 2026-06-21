import { getProgramsFiltered } from "@/lib/repositories";
import { Breadcrumbs, PageHeader, ProgramCard, EmptyState } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Programlar",
  description: "Üniversite programlarını alan ve ülkeye göre incele. Kabul gereklilikleri teyit edilene kadar 'Doğrulama gerekli'.",
  path: "/programlar",
});

const FIELDS = [
  ["", "Tüm alanlar"], ["computer_science", "Bilgisayar Bilimi"], ["engineering", "Mühendislik"],
  ["economics", "Ekonomi"], ["business", "İşletme"], ["political_science", "Siyaset Bilimi"],
  ["international_relations", "Uluslararası İlişkiler"],
];

export default function ProgramsPage({ searchParams }: { searchParams: { alan?: string; q?: string } }) {
  const list = getProgramsFiltered({ field: searchParams.alan, search: searchParams.q });
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Programlar" }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Dizin" title="Programlar"
          lead="Küratör onaylı gerçek programlar listelenir. Her programın gereklilikleri resmî kaynaktan teyit edilene kadar işaretlidir." />
      </div>

      <form className="mt-6 flex flex-wrap items-end gap-3" action="/programlar">
        <label className="text-sm">
          <span className="mb-1 block text-ink-muted">Ara</span>
          <input name="q" defaultValue={searchParams.q} placeholder="Program veya üniversite"
            className="w-64 rounded-card border border-line bg-white px-3 py-2 text-sm" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block text-ink-muted">Alan</span>
          <select name="alan" defaultValue={searchParams.alan || ""} className="rounded-card border border-line bg-white px-3 py-2 text-sm">
            {FIELDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <button className="btn-primary" type="submit">Filtrele</button>
        <span className="text-sm text-ink-muted">{list.length} sonuç</span>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length ? list.map((p) => <ProgramCard key={p.id} p={p} />)
          : <EmptyState title="Sonuç bulunamadı" hint="Filtreleri değiştirip tekrar dene." />}
      </div>
    </div>
  );
}
