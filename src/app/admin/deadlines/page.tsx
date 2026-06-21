import { AdminHeader, AdminTable } from "@/components/admin/AdminTable";

export default function Page() {
  return (
    <div>
      <AdminHeader title="Son Tarihler" count={0} lead="Başvuru döngüleri ve son tarihler. Hiçbir tarih uydurulmaz; resmî takvimden teyit edilir." />
      <AdminTable columns={[{ header: "Kayıt", cell: () => null }]} rows={[]}
        empty="Henüz kayıt yok. Veriler küratör onayıyla veya ingestion pipeline ile eklenir; hiçbir alan uydurulmaz." />
    </div>
  );
}
