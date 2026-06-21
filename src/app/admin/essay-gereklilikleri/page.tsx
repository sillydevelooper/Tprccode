import { AdminHeader, AdminTable } from "@/components/admin/AdminTable";

export default function Page() {
  return (
    <div>
      <AdminHeader title="Essay Gereklilikleri" count={0} lead="Programların essay/niyet mektubu gereklilikleri. Prompt ve kelime limiti resmî kaynaktan doğrulanır." />
      <AdminTable columns={[{ header: "Kayıt", cell: () => null }]} rows={[]}
        empty="Henüz kayıt yok. Veriler küratör onayıyla veya ingestion pipeline ile eklenir; hiçbir alan uydurulmaz." />
    </div>
  );
}
