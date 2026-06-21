import { ESSAY_STAGES } from "@/lib/services/essay";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Essay Çalışması", path: "/essay", noindex: true });

export default function EssayWorkflowPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Essay Koçluğu", href: "/essay" }, { name: `Çalışma ${params.id}` }]} />
      <div className="mt-6"><PageHeader eyebrow="Çalışma alanı" title={`Essay #${params.id}`}
        lead="Bu çalışma alanı, kalıcı depolama (Supabase) bağlandığında keşif→tema→taslak→inceleme adımlarını saklar." /></div>
      <ol className="mt-8 space-y-3">
        {ESSAY_STAGES.map((s, i) => (
          <li key={s.key} className="card flex items-center gap-4 p-4">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm text-white">{i + 1}</span>
            <div><div className="font-display text-ink">{s.label_tr}</div><div className="text-sm text-ink-muted">{s.desc_tr}</div></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
