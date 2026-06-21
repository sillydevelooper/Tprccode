import Link from "next/link";
import { getAllUniversities } from "@/lib/repositories";
import { AdminHeader, AdminTable, StatusCell, type Column } from "@/components/admin/AdminTable";
import { VISIBILITY_TR, type University } from "@/lib/types";

export default function AdminUniversities() {
  const rows = getAllUniversities();
  const cols: Column<University>[] = [
    { header: "Üniversite", cell: (u) => <Link href={`/universiteler/${u.slug}`} className="font-medium text-ink hover:underline">{u.name}</Link> },
    { header: "Ülke", cell: (u) => u.country_name },
    { header: "Kategori", cell: (u) => <span className="badge border-line bg-parchment text-ink-soft">{u.institution_category}</span> },
    { header: "Görünürlük", cell: (u) => VISIBILITY_TR[u.public_visibility] },
    { header: "Durum", cell: (u) => <StatusCell source={u.source_status} review={u.review_status} /> },
  ];
  return <div><AdminHeader title="Üniversiteler" count={rows.length} lead="Sınıflandırma, görünürlük ve kaynak durumu. review_only kayıtlar herkese açık dizinde görünmez." /><AdminTable columns={cols} rows={rows} /></div>;
}
