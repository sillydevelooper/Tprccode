// src/lib/seo/index.ts
import type { Metadata } from "next";

export const SITE = {
  name: "TestPrep Admissions",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://testprep-admissions.example",
  description:
    "Kaynak-öncelikli, denetim-öncelikli küresel üniversite kabul zekâsı. " +
    "Her veri kaynağa dayanır; doğrulanmamış bilgiler açıkça 'Doğrulama gerekli' olarak işaretlenir.",
  locale: "tr_TR",
};

const NO_GUARANTEE =
  "TestPrep Admissions kabul garantisi vermez; bilgiler resmî kaynaklardan teyit edilmelidir.";

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = SITE.baseUrl + opts.path;
  const description = (opts.description || SITE.description) + " " + NO_GUARANTEE;
  return {
    title: `${opts.title} · ${SITE.name}`,
    description,
    alternates: { canonical: url },
    robots: opts.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: opts.title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.baseUrl,
    description: SITE.description,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.baseUrl,
    inLanguage: "tr",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE.baseUrl + it.path,
    })),
  };
}

export function faqJsonLd(qa: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.q,
      acceptedAnswer: { "@type": "Answer", text: x.a },
    })),
  };
}

/** Inline <script> JSON-LD helper props. */
export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data) };
}
