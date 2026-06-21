import Link from "next/link";
import { getAllUniversities, getAllCountries, getAllPrograms } from "@/lib/repositories";
import { AdminHeader, AdminTable, StatusCell, type Column } from "@/components/admin/AdminTable";
import type { DataReviewTask } from "@/lib/types";

function buildQueue(): DataReviewTask[] {
  const tasks: DataReviewTask[] = [];
  for (const u of getAllUniversities()) {
    if (u.needs_human_review) tasks.push({
      id: `rt-${u.id}`, entity_type: "university", entity_id: u.id, entity_label: u.name,
      reason: "Kabul/sınav/essay detayları doğrulanmadı", status: u.review_status,
      source_status: u.source_status, assigned_to: null, created_at: u.last_checked_at,
    });
  }
  for (const p of getAllPrograms()) {
    if (p.needs_human_review) tasks.push({
      id: `rt-${p.id}`, entity_type: "program", entity_id: p.id, entity_label: `${p.name_tr} — ${p.university_name}`,
      reason: "Program gereklilikleri resmî kaynaktan teyit edilmeli", status: p.review_status,
      source_status: p.source_status, assigned_to: null, created_at: p.last_checked_at,
    });
  }
  for (const c of getAllCountries()) {
    if (c.needs_human_review) tasks.push({
      id: `rt-${c.code}`, entity_type: "country", entity_id: c.code, entity_label: c.name_tr,
      reason: "Ülke kabul/başvuru notları doğrulanmadı", status: c.review_status,
      source_status: c.source_status, assigned_to: null, created_at: c.last_checked_at,
    });
  }
  const order = { university: 0, program: 1, country: 2 } as Record<string, number>;
  return tasks.sort((a, b) => (order[a.entity_type] ?? 9) - (order[b.entity_type] ?? 9));
}

const TYPE_TR: Record<string, string> = { country: "Ülke", university: "Üniversite", program: "Program", requirement: "Gereklilik", deadline: "Son tarih", scholarship: "Burs" };

export default function AdminReview() {
  const tasks = buildQueue();
  const cols: Column<DataReviewTask>[] = [
    { header: "Tür", cell: (t) => <span className="badge border-line bg-parchment text-ink-soft">{TYPE_TR[t.entity_type]}</span> },
    { header: "Kayıt", cell: (t) => t.entity_label },
    { header: "Sebep", cell: (t) => <span className="text-ink-muted">{t.reason}</span> },
    { header: "Durum", cell: (t) => <StatusCell source={t.source_status} review={t.status} /> },
  ];
  return (
    <div>
      <AdminHeader title="Veri İnceleme" count={tasks.length} lead="Doğrulanmamış her kayıt buraya düşer. İnceleyen kişi resmî kaynakla teyit edip onaylar; onaylanmadan 'onaylı' olarak yayımlanmaz." />
      <p className="mb-4 text-sm text-ink-muted">Toplu denetim için <Link href="/admin/kaynaklar" className="text-verify-ink hover:underline">Kaynaklar</Link> sayfasına da bakabilirsin.</p>
      <AdminTable columns={cols} rows={tasks} empty="İnceleme bekleyen kayıt yok." />
    </div>
  );
}
