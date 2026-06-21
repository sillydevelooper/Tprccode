import Link from "next/link";

const NAV = [
  { href: "/ulkeler", label: "Ülkeler" },
  { href: "/universiteler", label: "Üniversiteler" },
  { href: "/programlar", label: "Programlar" },
  { href: "/profil", label: "Profil Analizi" },
  { href: "/essay", label: "Essay Koçluğu" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-parchment/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-card bg-ink text-white font-display text-sm">TA</span>
          <span className="font-display text-lg text-ink">TestPrep <span className="text-verify-ink">Admissions</span></span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-ink-soft hover:text-ink">
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/profil" className="btn-primary text-sm">Ücretsiz analiz</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-white">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-lg text-ink">TestPrep Admissions</span>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Kaynak-öncelikli, denetim-öncelikli küresel kabul zekâsı. Kabul garantisi vermeyiz;
            doğrulanmamış bilgiler “Doğrulama gerekli” olarak işaretlenir.
          </p>
        </div>
        <FooterCol title="Keşfet" links={[["/ulkeler", "Ülkeler"], ["/universiteler", "Üniversiteler"], ["/programlar", "Programlar"]]} />
        <FooterCol title="Araçlar" links={[["/profil", "Profil Analizi"], ["/essay", "Essay Koçluğu"], ["/dashboard", "Panel"]]} />
        <FooterCol title="Şeffaflık" links={[["/admin/kaynaklar", "Kaynaklar"], ["/admin/veri-inceleme", "Veri İnceleme"]]} />
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} TestPrep Admissions</span>
          <span>Bilgiler resmî kaynaklardan teyit edilmelidir. Kabul garantisi yoktur.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="eyebrow mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([href, label]) => (
          <li key={href}><Link href={href} className="text-ink-soft hover:text-ink">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
