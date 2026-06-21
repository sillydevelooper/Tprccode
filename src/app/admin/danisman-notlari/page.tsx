import { AdminHeader, AdminTable } from "@/components/admin/AdminTable";

export default function Page() {
  return (
    <div>
      <AdminHeader title="Danışman Notları" count={0} lead="Danışmanların öğrenci bazlı notları. Dahili/öğrenciyle paylaşılan ayrımıyla saklanır." />
      <AdminTable columns={[{ header: "Kayıt", cell: () => null }]} rows={[]}
        empty="Henüz kayıt yok. Veriler küratör onayıyla veya ingestion pipeline ile eklenir; hiçbir alan uydurulmaz." />
    </div>
  );
}
