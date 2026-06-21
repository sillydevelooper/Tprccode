import { AdminHeader, AdminTable } from "@/components/admin/AdminTable";

export default function Page() {
  return (
    <div>
      <AdminHeader title="Kabul Şartları" count={0} lead="Programlara bağlı kabul şartları. Akademik/dil/belge şartları resmî kaynaktan teyit edilene kadar 'Doğrulama gerekli'." />
      <AdminTable columns={[{ header: "Kayıt", cell: () => null }]} rows={[]}
        empty="Henüz kayıt yok. Veriler küratör onayıyla veya ingestion pipeline ile eklenir; hiçbir alan uydurulmaz." />
    </div>
  );
}
