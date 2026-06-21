import { AdminHeader, AdminTable } from "@/components/admin/AdminTable";

export default function Page() {
  return (
    <div>
      <AdminHeader title="Öğrenci Profilleri" count={0} lead="Profil analizi yapan öğrenciler. Kalıcı veri Supabase bağlanınca burada listelenir." />
      <AdminTable columns={[{ header: "Kayıt", cell: () => null }]} rows={[]}
        empty="Henüz kayıt yok. Veriler küratör onayıyla veya ingestion pipeline ile eklenir; hiçbir alan uydurulmaz." />
    </div>
  );
}
