import { SourceBadge, ReviewBadge } from "@/components/Badges";
import type { SourceStatus, ReviewStatus } from "@/lib/types";

export function AdminHeader({ title, lead, count }: { title: string; lead?: string; count?: number }) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-3">
        <h1 className="h-display text-2xl">{title}</h1>
        {count != null && <span className="badge border-line bg-parchment text-ink-soft">{count} kayıt</span>}
      </div>
      {lead && <p className="mt-2 max-w-2xl text-sm text-ink-muted">{lead}</p>}
    </header>
  );
}

export interface Column<T> { header: string; cell: (row: T) => React.ReactNode; className?: string; }

export function AdminTable<T>({ columns, rows, empty }: { columns: Column<T>[]; rows: T[]; empty?: string }) {
  if (!rows.length) {
    return <div className="card p-8 text-center text-sm text-ink-muted">{empty || "Kayıt yok."}</div>;
  }
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-parchment/60 text-left">
              {columns.map((c, i) => <th key={i} className={`px-4 py-3 font-semibold text-ink-soft ${c.className || ""}`}>{c.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-b border-line/70 last:border-0 hover:bg-parchment/40">
                {columns.map((c, ci) => <td key={ci} className={`px-4 py-3 align-top ${c.className || ""}`}>{c.cell(row)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatusCell({ source, review }: { source: SourceStatus; review: ReviewStatus }) {
  return <div className="flex flex-wrap gap-1.5"><SourceBadge status={source} /><ReviewBadge status={review} /></div>;
}
