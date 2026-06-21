import { AdminHeader, AdminTable, type Column } from "@/components/admin/AdminTable";
import type { Lead } from "@/lib/types";

// Demo leads illustrate the CRM shape; real leads arrive via forms once persistence is connected.
const DEMO: Lead[] = [
  { id: "lead-1", name: "Örnek Aday", email: "aday@example.com", target_country: "Hollanda", target_field: "Bilgisayar Bilimi", stage: "new", source: "Profil analizi", created_at: "2026-06-21", notes: "Demo kayıt" },
];
const STAGE_TR: Record<Lead["stage"], string> = { new: "Yeni", contacted: "İletişime geçildi", qualified: "Nitelikli", consult_booked: "Görüşme planlandı", won: "Kazanıldı", lost: "Kaybedildi" };

export default function AdminLeads() {
  const cols: Column<Lead>[] = [
    { header: "Aday", cell: (l) => <span className="font-medium text-ink">{l.name}</span> },
    { header: "Hedef", cell: (l) => `${l.target_field} · ${l.target_country}` },
    { header: "Aşama", cell: (l) => <span className="badge border-line bg-parchment text-ink-soft">{STAGE_TR[l.stage]}</span> },
    { header: "Kaynak", cell: (l) => l.source },
  ];
  return <div><AdminHeader title="Lead Listesi" count={DEMO.length} lead="Profil/essay araçlarından gelen adaylar. Demo kayıt CRM yapısını gösterir." /><AdminTable columns={cols} rows={DEMO} /></div>;
}
