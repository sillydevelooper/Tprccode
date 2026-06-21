#!/usr/bin/env python3
"""
ingest_universities.py
----------------------
Scale the REAL data approach to every country.

For each requested country it:
  1. fetches an authoritative "List of universities in <country>" page
     (cache-first) — the same method used to seed NL & TR by hand,
  2. parses institution rows (name, city, type) from the wiki tables,
  3. normalizes -> classifies -> dedupes,
  4. exports data/ingested/universities.<cc>.json (machine master).

The TS generation step (export_universities.py) merges these batches into
src/lib/data/universities/generated/ WITHOUT touching curated overrides.

USAGE
  python scripts/ingest_universities.py --countries NL TR DE GB CA
  python scripts/ingest_universities.py --all          # all 207 master countries
  python scripts/ingest_universities.py --source wikidata --countries DE

NETWORK REQUIRED for cache misses. Run locally / in CI with egress enabled.
Wikidata path uses SPARQL (see fetch_wikidata.py); default path uses Wikipedia.
"""
from __future__ import annotations
import argparse, re, sys, os
import ingest_common as ic

WIKI_LIST = "https://en.wikipedia.org/wiki/List_of_universities_in_{name}"
# country-name URL fragment overrides for Wikipedia
NAME_OVERRIDES = {"NL": "the_Netherlands", "US": "the_United_States", "GB": "the_United_Kingdom"}

ROW_RE = re.compile(r"\|\s*\[?\[?([^|\[\]]{3,90}?)\]?\]?\s*\|\s*([^|]*?)\s*\|\s*([^|\n]*)")


def country_url(name_en: str, cc: str) -> str:
    frag = NAME_OVERRIDES.get(cc, name_en.replace(" ", "_"))
    return WIKI_LIST.format(name=frag)


def parse_wiki_table(markup: str, cc: str, country_name: str) -> list[dict]:
    """Best-effort parser for the wiki list tables. Real extraction; tolerant of
    layout drift. Unknown cells default to NEEDS rather than being invented."""
    records = []
    for line in markup.splitlines():
        if "|" not in line:
            continue
        cells = [c.strip(" []") for c in line.split("|") if c.strip()]
        if not cells:
            continue
        name = cells[0]
        if len(name) < 3 or name.lower() in {"name", "established", "city", "type"}:
            continue
        if not re.search(r"[A-Za-zÀ-ÿĀ-ſ]", name):
            continue
        city = NEEDS = ic.NEEDS
        raw_type = "university"
        # heuristics: look for a city-ish and a type-ish cell
        for c in cells[1:]:
            cl = c.lower()
            if any(k in cl for k in ["university", "college", "institute", "academy", "school"]):
                raw_type = c
            elif re.match(r"^[A-ZÀ-Þ][a-zà-ÿ'\- ]{2,}$", c) and not c.isdigit():
                city = c
        records.append({"name": re.sub(r"\(.*?\)", "", name).strip(), "city": city,
                         "raw_type": raw_type, "country_code": cc, "country_name": country_name})
    return records


def normalize(rec: dict, curated: set[str]) -> dict:
    cat, reason, conf = ic.classify_type(rec["raw_type"], rec["name"], curated)
    visible = cat in {"curated_university", "university", "college", "institute", "academy", "school"}
    priority = {"curated_university": 0, "university": 1, "college": 2, "institute": 2, "academy": 3}.get(cat, 4)
    name, cc = rec["name"], rec["country_code"]
    return {
        "id": f"u-{cc.lower()}-{ic.slugify(name)}", "name": name, "slug": ic.slugify(name),
        "country_code": cc, "country_name": rec["country_name"], "city": rec["city"],
        "type": rec["raw_type"], "website_url": ic.NEEDS, "admissions_url": ic.NEEDS,
        "application_platforms": [ic.NEEDS], "popular_program_areas": [ic.NEEDS],
        "general_international_admission_notes": ic.NEEDS, "testing_notes": ic.NEEDS,
        "english_proficiency_notes": ic.NEEDS, "essay_requirement_notes": ic.NEEDS,
        "scholarship_notes": ic.NEEDS,
        "source_url": country_url(rec["country_name"], cc), "source_title": "Wikipedia üniversite listesi (kimlik)",
        "source_type": "reference_list", "last_checked_at": ic.now_iso(), "next_review_at": ic.next_review_iso(),
        "source_status": "needs_review", "confidence_score": conf, "needs_human_review": True,
        "review_status": "needs_review", "reviewer_notes": "Kimlik listeden; kabul detayları doğrulanmadı.",
        "institution_category": cat, "directory_priority": priority,
        "public_visibility": "visible" if visible else "review_only",
        "admissions_data_priority": priority, "classification_reason": reason,
        "classification_confidence": conf, "is_active": True,
    }


def dedupe(records: list[dict]) -> tuple[list[dict], int]:
    seen, out, dropped = set(), [], 0
    for r in records:
        key = (r["slug"], r["country_code"])
        if key in seen:
            dropped += 1; continue
        seen.add(key); out.append(r)
    return out, dropped


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--countries", nargs="*", default=[])
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--source", choices=["wikipedia", "wikidata"], default="wikipedia")
    args = ap.parse_args()

    root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    master = ic.load_json(os.path.join(root, "data", "countries.master.json"), [])
    by_cc = {c["code"]: c for c in master}
    try:
        import _real_universities_seed as seed
        curated = seed.CURATED_PRIORITY_NAMES
    except Exception:
        curated = set()

    targets = list(by_cc.keys()) if args.all else [c.upper() for c in args.countries]
    if not targets:
        print("En az bir ülke kodu ver (veya --all)."); sys.exit(2)

    for cc in targets:
        c = by_cc.get(cc)
        if not c:
            print(f"[skip] bilinmeyen ülke: {cc}"); continue
        url = country_url(c["name_en"], cc)
        try:
            if args.source == "wikidata":
                import fetch_wikidata
                raw_records = fetch_wikidata.fetch_universities(cc, c["name_tr"])
            else:
                markup = ic.cached_get(url)
                raw_records = parse_wiki_table(markup, cc, c["name_tr"])
        except Exception as e:  # network disabled or page missing
            print(f"[warn] {cc}: kaynak alınamadı ({e}). Ağ erişimi gerekli."); continue
        norm = [normalize(r, curated) for r in raw_records]
        deduped, dropped = dedupe(norm)
        out = os.path.join(root, "data", "ingested", f"universities.{cc.lower()}.json")
        ic.write_json(out, deduped)
        print(f"[ok] {cc}: {len(deduped)} kurum ({dropped} duplikasyon) -> {out}")


if __name__ == "__main__":
    main()
