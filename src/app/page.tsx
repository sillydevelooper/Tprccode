import Link from "next/link";
import { getPlatformStats, getCountriesWithUniversities, getPublicUniversities } from "@/lib/repositories";
import { Stat, UniversityCard, CountryCard } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kaynak-öncelikli üniversite kabul zekâsı",
  description: "Ülke, üniversite ve program verisini kaynaklarıyla incele; profilini analiz et; essay sürecini etik biçimde yönet.",
  path: "/",
});

export default function HomePage() {
  const stats = getPlatformStats();
  const countries = getCountriesWithUniversities().slice(0, 8);
  const featured = getPublicUniversities({ pageSize: 6 }).items;

  return (
    <div>
      {/* hero — thesis: every claim is sourced or says "Doğrulama gerekli" */}
      <section className="border-b border-line bg-gradient-to-b from-parchment to-parchment-deep">
        <div className="container-page py-16 sm:py-24">
          <p className="eyebrow mb-4">Denetim-öncelikli kabul platformu</p>
          <h1 className="h-display max-w-3xl text-4xl leading-[1.1] sm:text-5xl">
            Her veri bir kaynağa dayanır.
            <span className="text-verify-ink"> Doğrulanmayan her şey açıkça işaretlenir.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            TestPrep Admissions; ülkeleri, üniversiteleri ve programları kaynaklarıyla birlikte gösterir.
            Kabul garantisi vermez. Doğrulanmamış kabul detayları <strong className="text-flag">“Doğrulama gerekli”</strong> olarak görünür.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/profil" className="btn-primary">Profilini analiz et</Link>
            <Link href="/universiteler" className="btn-ghost">Üniversiteleri keşfet</Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={stats.countries} label="Ülke (master liste)" />
          <Stat value={stats.universities} label="Kurum (kaynak-temelli)" />
          <Stat value={stats.visible} label="Yayında üniversite" />
          <Stat value={stats.curated} label="Küratör onaylı" />
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Kurum sayıları, ağ erişimi açıkken Wikidata/OpenAlex pipeline’ı ile ölçeklenecek gerçek kaynak verisidir;
          şu an küratör çekirdeği + araştırma ile toplanan gerçek kayıtları gösterir.
        </p>
      </section>

      <section className="container-page py-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="h-display text-2xl">Öne çıkan üniversiteler</h2>
          <Link href="/universiteler" className="text-sm font-medium text-verify-ink hover:underline">Tümü →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((u) => <UniversityCard key={u.id} u={u} />)}
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="h-display text-2xl">Üniversitesi olan ülkeler</h2>
          <Link href="/ulkeler" className="text-sm font-medium text-verify-ink hover:underline">Tümü →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((c) => <CountryCard key={c.code} c={c} />)}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="card grid gap-6 p-8 lg:grid-cols-3">
          <Feature title="Kaynak-öncelikli" body="Üniversite ve programlar yapılandırılmış/halka açık kaynaklardan toplanır; her kayıtta kaynak bağlantısı bulunur." />
          <Feature title="Denetim-öncelikli" body="Her kaydın inceleme ve kaynak durumu vardır. Doğrulanmamış içerik yayında ‘onaylı’ gibi sunulmaz." />
          <Feature title="Etik koçluk" body="Essay sürecinde tam metin yazmayız; keşif, tema, yapı ve netlik üzerine çalışırız. Nihai metin öğrenciye aittir." />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}
