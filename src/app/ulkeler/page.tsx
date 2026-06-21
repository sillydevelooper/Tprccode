import { getAllCountries, getCountriesWithUniversities } from "@/lib/repositories";
import { Breadcrumbs, PageHeader, CountryCard } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ülkeler",
  description: "Üniversite kabul sistemlerini ülke ülke keşfet. Her ülke kimliği ISO referansından; kabul detayları teyit edilene kadar 'Doğrulama gerekli'.",
  path: "/ulkeler",
});

export default function CountriesPage() {
  const withUnis = getCountriesWithUniversities();
  const all = getAllCountries();
  const codesWith = new Set(withUnis.map((c) => c.code));
  const rest = all.filter((c) => !codesWith.has(c.code));

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Ülkeler" }]} />
      <div className="mt-6">
        <PageHeader
          eyebrow="Master liste"
          title="Ülkeler"
          lead="Verili üniversitesi olan ülkeler önce listelenir. Tam liste ISO 3166 kimlik verisiyle hazırdır; kabul/başvuru detayları kaynaktan teyit edilene kadar işaretlidir."
        />
      </div>

      <h2 className="h-display mt-10 text-xl">Üniversite verisi olan ülkeler ({withUnis.length})</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {withUnis.map((c) => <CountryCard key={c.code} c={c} />)}
      </div>

      <h2 className="h-display mt-12 text-xl">Diğer ülkeler ({rest.length})</h2>
      <p className="mt-1 text-sm text-ink-muted">Kimlik verisi hazır; üniversite verisi ingestion ile eklenecek.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((c) => <CountryCard key={c.code} c={c} />)}
      </div>
    </div>
  );
}
