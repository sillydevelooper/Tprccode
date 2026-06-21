import Link from "next/link";
import type { University, Program, Country } from "@/lib/types";
import { SourceBadge, ReviewBadge } from "@/components/Badges";

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href ? <Link href={it.href} className="hover:text-ink">{it.name}</Link> : <span className="text-ink">{it.name}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <header className="max-w-3xl">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="h-display text-3xl sm:text-4xl">{title}</h1>
      {lead && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>}
    </header>
  );
}

export function CountryCard({ c }: { c: Country }) {
  return (
    <Link href={`/ulkeler/${c.slug}`} className="card card-hover block p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-lg text-ink">{c.name_tr}</span>
        <span className="text-xs font-semibold text-ink-muted">{c.code}</span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">{c.region}</p>
      <div className="mt-4"><SourceBadge status={c.source_status} /></div>
    </Link>
  );
}

export function UniversityCard({ u }: { u: University }) {
  return (
    <Link href={`/universiteler/${u.slug}`} className="card card-hover block p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg leading-snug text-ink">{u.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">
            {u.city !== "Doğrulama gerekli" ? `${u.city}, ` : ""}{u.country_name}
          </p>
        </div>
        {u.institution_category === "curated_university" && (
          <span className="badge border-verify/30 bg-verify-soft text-verify-ink">Küratör</span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SourceBadge status={u.source_status} />
        <ReviewBadge status={u.review_status} />
      </div>
    </Link>
  );
}

export function ProgramCard({ p }: { p: Program }) {
  return (
    <Link href={`/programlar/${p.slug}`} className="card card-hover block p-5">
      <h3 className="font-display text-lg leading-snug text-ink">{p.name_tr}</h3>
      <p className="mt-1 text-sm text-ink-muted">{p.university_name}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-muted">{p.field.replace(/_/g, " ")}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <SourceBadge status={p.source_status} />
        <ReviewBadge status={p.review_status} />
      </div>
    </Link>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card grid place-items-center p-12 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      {hint && <p className="mt-2 max-w-md text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="card p-5">
      <div className="font-display text-3xl text-ink">{value}</div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}
