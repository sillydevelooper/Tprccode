import { getAllUniversities, getAllCountries, getAllPrograms } from "@/lib/repositories";
import { AdminHeader, AdminTable, type Column } from "@/components/admin/AdminTable";
import { SourceBadge } from "@/components/Badges";
import type { SourceStatus } from "@/lib/types";

interface Row { domain: string; type: string; count: number; status: SourceStatus; sample: string; }

export default function AdminSources() {
  const byDomain = new Map<string, Row>();
  const add = (url: string, type: string, status: SourceStatus, label: string) => {
    let domain = "—";
    try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch { domain = url; }
    const cur = byDomain.get(domain);
    if (cur) cur.count += 1;
    else byDomain.set(domain, { domain, type, count: 1, status, sample: label });
  };
  getAllUniversities().forEach((u) => add(u.source_url, u.source_type, u.source_status, u.name));
  getAllPrograms().forEach((p) => add(p.source_url, p.source_type, p.source_status, p.name_tr));
  getAllCountries().forEach((c) => add(c.source_url, c.source_type, c.source_status, c.name_tr));

  const rows = [...byDomain.values()].sort((a, b) => b.count - a.count);
  const cols: Column<Row>[] = [
    { header: "Kaynak alan adı", cell: (r) => <span className="font-medium text-ink">{r.domain}</span> },
    { header: "Tür", cell: (r) => r.type },
    { header: "Kayıt", cell: (r) => r.count },
    { header: "Örnek", cell: (r) => <span className="text-ink-muted">{r.sample}</span> },
    { header: "Durum", cell: (r) => <SourceBadge status={r.status} /> },
  ];
  return (
    <div>
      <AdminHeader title="Kaynaklar" count={rows.length} lead="Katalogdaki her kaydın dayandığı kaynak alan adları. Bozuk/eskimiş kaynaklar burada izlenir ve yeniden kontrol planlanır." />
      <AdminTable columns={cols} rows={rows} />
    </div>
  );
}
