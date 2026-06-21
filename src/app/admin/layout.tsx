import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const SECTIONS: { title: string; links: [string, string][] }[] = [
  { title: "Genel", links: [["/admin", "Genel Bakış"], ["/admin/veri-inceleme", "Veri İnceleme"], ["/admin/kaynaklar", "Kaynaklar"]] },
  { title: "Katalog", links: [["/admin/ulkeler", "Ülkeler"], ["/admin/universiteler", "Üniversiteler"], ["/admin/programlar", "Programlar"]] },
  { title: "Kabul verisi", links: [["/admin/kabul-sartlari", "Kabul Şartları"], ["/admin/sinav-gereklilikleri", "Sınav Gereklilikleri"], ["/admin/essay-gereklilikleri", "Essay Gereklilikleri"], ["/admin/deadlines", "Son Tarihler"]] },
  { title: "Öğrenci & CRM", links: [["/admin/ogrenci-profilleri", "Öğrenci Profilleri"], ["/admin/danisman-notlari", "Danışman Notları"], ["/admin/lead-listesi", "Lead Listesi"]] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <div className="mb-4 rounded-card border border-flag/30 bg-flag-soft px-3 py-2 text-xs text-flag">
          Yönetim paneli · indexlenmez
        </div>
        <nav className="space-y-5">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <div className="eyebrow mb-2">{s.title}</div>
              <ul className="space-y-1">
                {s.links.map(([href, label]) => (
                  <li key={href}><Link href={href} className="block rounded-card px-2.5 py-1.5 text-sm text-ink-soft hover:bg-parchment hover:text-ink">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
