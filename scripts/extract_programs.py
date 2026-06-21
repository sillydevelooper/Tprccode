#!/usr/bin/env python3
"""extract_programs.py — discover + extract + strict-filter programs for queued
universities. Cache-first crawl of official program-listing pages; NETWORK for
cache misses. Requirements are NEVER invented -> "Doğrulama gerekli".

Pipeline per university:
  discover()  -> resolve a working program-listing URL from candidate paths
  extract()   -> pull candidate program names from the page
  strict()    -> keep only real degree programs; classify field; dedupe
"""
from __future__ import annotations
import os, re, json, ingest_common as ic

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEGREE_RE = re.compile(r"\b(BSc|BA|BEng|LLB|MSc|MA|MEng|MBA|PhD|Bachelor|Master|Lisans|Yüksek Lisans)\b", re.I)
BAD = ["cookie", "login", "search", "news", "contact", "privacy", "©"]

def discover(seed: str, paths: list[str]) -> str | None:
    for p in paths:
        url = seed.rstrip("/") + p
        try:
            html = ic.cached_get(url)
            if "<html" in html.lower() and len(html) > 500:
                return url
        except Exception:
            continue
    return None

def extract(url: str) -> list[str]:
    try:
        html = ic.cached_get(url)
    except Exception:
        return []
    names = re.findall(r">([^<>{}]{6,90})</a>", html)
    return [re.sub(r"\s+", " ", n).strip() for n in names]

def strict(names: list[str]) -> list[dict]:
    out, seen = [], set()
    for n in names:
        if not DEGREE_RE.search(n):
            continue
        if any(b in n.lower() for b in BAD):
            continue
        key = ic.slugify(n)
        if not key or key in seen:
            continue
        seen.add(key)
        out.append({"name_en": n, "field": ic.classify_field(n)})
    return out

def to_record(university, prog) -> dict:
    name = prog["name_en"]
    return {
        "id": f"p-{university['country_code'].lower()}-{ic.slugify(university['name'])}-{ic.slugify(name)}"[:120],
        "name_tr": name, "name_en": name, "slug": ic.slugify(f"{university['name']}-{name}")[:120],
        "university_id": university["id"], "university_name": university["name"],
        "country_code": university["country_code"], "degree_level": "unknown", "field": prog["field"],
        "application_platform": ic.NEEDS, "academic_expectation_notes": ic.NEEDS,
        "exam_requirement_summary": ic.NEEDS, "english_requirement_summary": ic.NEEDS,
        "essay_requirement_summary": ic.NEEDS, "document_requirement_summary": ic.NEEDS,
        "deadline_summary": ic.NEEDS, "scholarship_notes": ic.NEEDS, "fit_notes": ic.NEEDS,
        "source_url": university["website_url"], "source_title": "Resmî program listesi sayfası",
        "source_type": "official_website", "last_checked_at": ic.now_iso(), "next_review_at": ic.next_review_iso(),
        "source_status": "needs_review", "confidence_score": 0.6, "needs_human_review": True,
        "review_status": "needs_review", "reviewer_notes": "Program adı resmî sayfadan; gereklilikler doğrulanmadı.",
    }

def main():
    queue = ic.load_json(os.path.join(ROOT, "data", "ingested", "program_queue.json"), [])
    all_recs = []
    for q in queue:
        url = discover(q["seed_url"], q["candidate_paths"])
        if not url:
            print(f"[skip] {q['university_name']}: program sayfası bulunamadı (ağ gerekli)"); continue
        progs = strict(extract(url))
        all_recs += [to_record(q, p) for p in progs]
        print(f"[ok] {q['university_name']}: {len(progs)} program")
    ic.write_json(os.path.join(ROOT, "data", "ingested", "programs.extracted.json"), all_recs)
    print(f"[extract] toplam {len(all_recs)} program -> data/ingested/programs.extracted.json")

if __name__ == "__main__":
    main()
