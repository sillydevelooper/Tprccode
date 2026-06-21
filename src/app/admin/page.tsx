import Link from "next/link";
import { getPlatformStats, getAllUniversities, getAllCountries, getAllPrograms } from "@/lib/repositories";
import { Stat } from "@/components/ui/Primitives";
import { AdminHeader } from "@/components/admin/AdminTable";

export default function AdminOverview() {
  const s = getPlatformStats();
  const needsReview =
    getAllUniversities().filter((u) => u.needs_human_review).length +
    getAllCountries().filter((c) => c.needs_human_review).length +
    getAllPrograms().filter((p) => p.needs_human_review).length;

  return (
    <div>
      <AdminHeader title="Genel Bakış" lead="Kaynak-öncelikli + denetim-öncelikli katalogun durumu. Doğrulanmamış kayıtlar inceleme kuyruğundadır." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat value={s.countries} label="Ülke" />
        <Stat value={s.universities} label="Üniversite" />
        <Stat value={s.programs} label="Program" />
        <Stat value={needsReview} label="İnceleme bekleyen" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat value={s.visible} label="Yayında üniversite" />
        <Stat value={s.reviewOnly} label="Yalnızca inceleme" />
        <Stat value={s.curated} label="Küratör onaylı" />
      </div>

      <div className="mt-8 card p-6">
        <h2 className="font-display text-lg text-ink">Veri politikası</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-soft">
          <li>• Üniversite/program kimliği kaynaklardan toplanır; her kayıtta kaynak bağlantısı vardır.</li>
          <li>• Kabul şartı, skor, son tarih <strong>uydurulmaz</strong>; teyit edilene kadar “Doğrulama gerekli”dir.</li>
          <li>• Küratör verisi üretilen veriyi <strong>her zaman</strong> geçersiz kılar; üzerine yazılmaz.</li>
        </ul>
        <div className="mt-4 flex gap-3">
          <Link href="/admin/veri-inceleme" className="btn-primary">İnceleme kuyruğu</Link>
          <Link href="/admin/kaynaklar" className="btn-ghost">Kaynaklar</Link>
        </div>
      </div>
    </div>
  );
}
