import Link from "next/link";
import { getAllCountries } from "@/lib/repositories";
import { AdminHeader, AdminTable, StatusCell, type Column } from "@/components/admin/AdminTable";
import type { Country } from "@/lib/types";

export default function AdminCountries() {
  const rows = getAllCountries();
  const cols: Column<Country>[] = [
    { header: "Ülke", cell: (c) => <Link href={`/ulkeler/${c.slug}`} className="font-medium text-ink hover:underline">{c.name_tr}</Link> },
    { header: "Kod", cell: (c) => c.code },
    { header: "Bölge", cell: (c) => c.region },
    { header: "Durum", cell: (c) => <StatusCell source={c.source_status} review={c.review_status} /> },
  ];
  return <div><AdminHeader title="Ülkeler" count={rows.length} lead="Kimlik ISO 3166'dan. Kabul detayları teyit edilene kadar 'Doğrulama gerekli'." /><AdminTable columns={cols} rows={rows} /></div>;
}
