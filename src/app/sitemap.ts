import type { MetadataRoute } from "next";
import { getAllCountries, getPublicUniversities, getIndexableProgramSlugs } from "@/lib/repositories";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.baseUrl;
  const now = new Date();
  const staticPages = ["", "/ulkeler", "/universiteler", "/programlar"].map((p) => ({
    url: base + p, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8,
  }));
  const countries = getAllCountries().map((c) => ({
    url: `${base}/ulkeler/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6,
  }));
  // Only visible universities are promoted in the sitemap.
  const unis = getPublicUniversities({ pageSize: 100000 }).items.map((u) => ({
    url: `${base}/universiteler/${u.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6,
  }));
  const programs = getIndexableProgramSlugs().map((slug) => ({
    url: `${base}/programlar/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5,
  }));
  return [...staticPages, ...countries, ...unis, ...programs];
}
