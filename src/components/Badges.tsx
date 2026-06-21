import type { SourceStatus, ReviewStatus, SourceMeta } from "@/lib/types";
import { SOURCE_STATUS_TR, REVIEW_STATUS_TR } from "@/lib/types";

const SOURCE_CLASS: Record<SourceStatus, string> = {
  verified: "border-verify/30 bg-verify-soft text-verify-ink",
  needs_review: "border-flag/30 bg-flag-soft text-flag",
  stale: "border-flag/30 bg-flag-soft text-flag",
  broken: "border-danger/30 bg-danger-soft text-danger",
  unknown: "border-line bg-parchment text-ink-muted",
};

const REVIEW_CLASS: Record<ReviewStatus, string> = {
  approved: "border-verify/30 bg-verify-soft text-verify-ink",
  needs_review: "border-flag/30 bg-flag-soft text-flag",
  rejected: "border-danger/30 bg-danger-soft text-danger",
  archived: "border-line bg-parchment text-ink-muted",
};

export function SourceBadge({ status }: { status: SourceStatus }) {
  return (
    <span className={`badge ${SOURCE_CLASS[status]}`} title="Kaynak durumu">
      <span aria-hidden>◆</span>
      Kaynak: {SOURCE_STATUS_TR[status]}
    </span>
  );
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`badge ${REVIEW_CLASS[status]}`} title="İnceleme durumu">
      <span aria-hidden>●</span>
      {REVIEW_STATUS_TR[status]}
    </span>
  );
}

export function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  return (
    <span className="badge border-line bg-white text-ink-muted" title="Güven skoru">
      Güven %{pct}
    </span>
  );
}

/**
 * Source verification box — shown on every public detail page. Makes provenance
 * legible and surfaces the "Doğrulama gerekli" stance front-and-center.
 */
export function SourceVerificationBox({ meta }: { meta: SourceMeta }) {
  const checked = meta.last_checked_at?.slice(0, 10) ?? "—";
  const next = meta.next_review_at?.slice(0, 10) ?? "—";
  return (
    <aside className="card p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow">Kaynak doğrulama</span>
        <SourceBadge status={meta.source_status} />
        <ReviewBadge status={meta.review_status} />
        <ConfidenceBadge score={meta.confidence_score} />
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-ink-muted">Kaynak</dt>
          <dd className="font-medium">
            <a href={meta.source_url} target="_blank" rel="noopener noreferrer"
               className="text-verify-ink underline decoration-verify/40 underline-offset-2 hover:decoration-verify">
              {meta.source_title}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-ink-muted">Tür</dt>
          <dd className="font-medium">{meta.source_type}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Son kontrol</dt>
          <dd className="font-medium">{checked}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Sonraki inceleme</dt>
          <dd className="font-medium">{next}</dd>
        </div>
      </dl>
      {meta.needs_human_review && (
        <p className="mt-4 rounded-card border border-flag/30 bg-flag-soft px-3 py-2 text-[13px] text-flag">
          Bu kaydın kabul/başvuru detayları henüz insan tarafından doğrulanmadı.
          İşaretli alanlar <strong>“Doğrulama gerekli”</strong> olarak gösterilir.
        </p>
      )}
    </aside>
  );
}

/** Renders a field value, styling the "Doğrulama gerekli" placeholder distinctly. */
export function FieldValue({ value }: { value: string }) {
  if (value === "Doğrulama gerekli") {
    return <span className="text-flag">Doğrulama gerekli</span>;
  }
  return <span>{value}</span>;
}
