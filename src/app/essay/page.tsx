import Link from "next/link";
import { ESSAY_STAGES, ESSAY_DISCOVERY_QUESTIONS, ESSAY_ETHICS_NOTE } from "@/lib/services/essay";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Essay Koçluğu", path: "/essay", noindex: true });

export default function EssayPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Essay Koçluğu" }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Etik koçluk" title="Essay Koçluğu"
          lead="Senin gerçek hikâyeni keşfetmene yardım ederiz: keşif, tema, yapı ve netlik. Tam metin yazmayız; nihai metin sana aittir." />
      </div>

      <p className="mt-4 rounded-card border border-verify/30 bg-verify-soft px-4 py-3 text-sm text-verify-ink">
        {ESSAY_ETHICS_NOTE}
      </p>

      <h2 className="h-display mt-10 text-xl">Süreç</h2>
      <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ESSAY_STAGES.map((s, i) => (
          <li key={s.key} className="card p-5">
            <div className="text-sm font-semibold text-ink-muted">Aşama {i + 1}</div>
            <div className="mt-1 font-display text-lg text-ink">{s.label_tr}</div>
            <p className="mt-1 text-sm text-ink-muted">{s.desc_tr}</p>
          </li>
        ))}
      </ol>

      <h2 className="h-display mt-10 text-xl">Keşif soruları</h2>
      <p className="mt-1 text-sm text-ink-muted">Başlamak için bu sorular üzerinden düşün. Yanıtların ham malzemen olur.</p>
      <div className="mt-4 space-y-3">
        {ESSAY_DISCOVERY_QUESTIONS.map((q) => (
          <div key={q.id} className="card p-5">
            <p className="font-medium text-ink">{q.question_tr}</p>
            <p className="mt-1 text-sm text-ink-muted">{q.hint_tr}</p>
          </div>
        ))}
      </div>

      <div className="mt-8"><Link href="/essay/yeni" className="btn-primary">Keşif oturumuna başla</Link></div>
    </div>
  );
}
