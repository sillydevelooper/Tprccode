import Link from "next/link";
import { Breadcrumbs, PageHeader, Stat } from "@/components/ui/Primitives";
import { getPlatformStats } from "@/lib/repositories";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Panel", path: "/dashboard", noindex: true });

export default function DashboardPage() {
  const s = getPlatformStats();
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Panel" }]} />
      <div className="mt-6"><PageHeader eyebrow="Öğrenci" title="Panelin"
        lead="Profil analizini, kaydettiğin programları ve essay sürecini buradan takip edersin. Kalıcı veri Supabase bağlanınca aktif olur." /></div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={s.universities} label="Erişilebilir üniversite" />
        <Stat value={s.programs} label="Program" />
        <Stat value={s.countries} label="Ülke" />
        <Stat value={s.curated} label="Küratör onaylı" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/profil" className="card card-hover p-6"><h3 className="font-display text-lg text-ink">Profil Analizi</h3><p className="mt-1 text-sm text-ink-muted">Reach/Match/Safety önerileri al.</p></Link>
        <Link href="/essay" className="card card-hover p-6"><h3 className="font-display text-lg text-ink">Essay Koçluğu</h3><p className="mt-1 text-sm text-ink-muted">Keşiften final metne etik süreç.</p></Link>
        <Link href="/programlar" className="card card-hover p-6"><h3 className="font-display text-lg text-ink">Programlar</h3><p className="mt-1 text-sm text-ink-muted">Küratör onaylı gerçek programlar.</p></Link>
      </div>
    </div>
  );
}
