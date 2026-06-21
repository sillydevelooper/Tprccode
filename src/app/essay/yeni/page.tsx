"use client";
import { useState } from "react";
import Link from "next/link";
import { ESSAY_DISCOVERY_QUESTIONS, ESSAY_ETHICS_NOTE } from "@/lib/services/essay";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

export default function NewEssayPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [themes, setThemes] = useState<string[]>([]);
  const filled = Object.values(answers).filter((v) => v.trim().length > 20).length;

  function deriveThemes() {
    // Lightweight, on-device heuristic — surfaces recurring words as candidate themes.
    const text = Object.values(answers).join(" ").toLocaleLowerCase("tr");
    const stop = new Set(["için","ve","bir","bu","ile","daha","çok","gibi","ama","ben","sonra","kadar","olarak","oldu","ne"]);
    const freq: Record<string, number> = {};
    text.split(/[^a-zçğıöşü]+/i).filter((w) => w.length > 4 && !stop.has(w)).forEach((w) => (freq[w] = (freq[w] || 0) + 1));
    setThemes(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w));
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Essay Koçluğu", href: "/essay" }, { name: "Yeni keşif" }]} />
      <div className="mt-6"><PageHeader eyebrow="Keşif aşaması" title="Keşif Oturumu"
        lead="Soruları kendi sözcüklerinle yanıtla. Biz yazmayız; sen yazarsın, biz yapı çıkarırız." /></div>

      <p className="mt-4 rounded-card border border-verify/30 bg-verify-soft px-4 py-3 text-sm text-verify-ink">{ESSAY_ETHICS_NOTE}</p>

      <div className="mt-8 space-y-5">
        {ESSAY_DISCOVERY_QUESTIONS.map((q) => (
          <div key={q.id} className="card p-5">
            <label className="font-medium text-ink">{q.question_tr}</label>
            <p className="mt-1 text-xs text-ink-muted">{q.hint_tr}</p>
            <textarea rows={3} value={answers[q.id] || ""}
              onChange={(e) => setAnswers((s) => ({ ...s, [q.id]: e.target.value }))}
              className="mt-2 w-full rounded-card border border-line bg-white px-3 py-2 text-sm" />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={deriveThemes} disabled={filled < 2} className="btn-primary disabled:opacity-40">Temaları çıkar</button>
        <span className="text-sm text-ink-muted">{filled}/{ESSAY_DISCOVERY_QUESTIONS.length} soru dolduruldu</span>
      </div>

      {themes.length > 0 && (
        <div className="mt-6 card p-5">
          <h3 className="font-display text-lg text-ink">Aday temalar</h3>
          <p className="mt-1 text-sm text-ink-muted">Bunlar yanıtlarında öne çıkan kavramlar. Hangisi seni en iyi anlatıyor?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {themes.map((t) => <span key={t} className="badge border-verify/30 bg-verify-soft text-verify-ink">{t}</span>)}
          </div>
          <p className="mt-4 text-sm text-ink-muted">Sonraki adım: bir tema seç, ardından taslak planını birlikte kuralım.</p>
        </div>
      )}

      <div className="mt-8"><Link href="/essay" className="btn-ghost">Essay ana sayfası</Link></div>
    </div>
  );
}
