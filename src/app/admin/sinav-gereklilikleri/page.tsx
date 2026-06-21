import { SUPPORTED_EXAMS, examRequirements } from "@/lib/data/requirements";
import { AdminHeader, AdminTable, type Column } from "@/components/admin/AdminTable";

export default function AdminExams() {
  const cols: Column<{ kind: string; label: string; group: string }>[] = [
    { header: "Sınav", cell: (e) => <span className="font-medium text-ink">{e.label}</span> },
    { header: "Anahtar", cell: (e) => <code className="text-xs">{e.kind}</code> },
    { header: "Grup", cell: (e) => e.group },
  ];
  return (
    <div>
      <AdminHeader title="Sınav Gereklilikleri" count={examRequirements.length}
        lead="Programlara bağlanan sınav gereklilikleri burada yönetilir. Hiçbir minimum skor uydurulmaz; teyit edilene kadar 'Doğrulama gerekli'." />
      <h2 className="h-display mb-3 text-lg">Desteklenen sınav kataloğu</h2>
      <AdminTable columns={cols} rows={SUPPORTED_EXAMS} />
    </div>
  );
}
