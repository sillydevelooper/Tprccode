import Link from "next/link";
import { getAllPrograms } from "@/lib/repositories";
import { AdminHeader, AdminTable, StatusCell, type Column } from "@/components/admin/AdminTable";
import type { Program } from "@/lib/types";

export default function AdminPrograms() {
  const rows = getAllPrograms();
  const cols: Column<Program>[] = [
    { header: "Program", cell: (p) => <Link href={`/programlar/${p.slug}`} className="font-medium text-ink hover:underline">{p.name_tr}</Link> },
    { header: "Üniversite", cell: (p) => p.university_name },
    { header: "Alan", cell: (p) => p.field.replace(/_/g, " ") },
    { header: "Seviye", cell: (p) => p.degree_level },
    { header: "Durum", cell: (p) => <StatusCell source={p.source_status} review={p.review_status} /> },
  ];
  return <div><AdminHeader title="Programlar" count={rows.length} lead="Küratör onaylı gerçek programlar. Gereklilikler teyit edilene kadar 'Doğrulama gerekli'." /><AdminTable columns={cols} rows={rows} /></div>;
}
