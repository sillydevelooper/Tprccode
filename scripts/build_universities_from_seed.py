#!/usr/bin/env python3
"""
build_universities_from_seed.py
-------------------------------
Offline, non-destructive builder that turns the REAL institution seed
(_real_universities_seed.py) into:

  * data/universities.master.json                       (machine master)
  * src/lib/data/universities/generated/<cc>.ts         (split by country code)
  * src/lib/data/universities/generated/index.ts        (merges batches)

It performs the same normalize -> classify -> dedupe -> export steps that the
network ingestion pipeline (ingest_universities.py) performs on Wikidata/OpenAlex
output, so the UI has real data to render today while the large-scale pipeline is
run later with network access.

NON-DESTRUCTIVE: curated records (src/lib/data/universities/_curated.ts) always win
and are never overwritten here. This script only writes the generated/ tree.
No network required.
"""
from __future__ import annotations
import json, os, re, unicodedata, datetime, importlib.util

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, ".."))
NEEDS = "Doğrulama gerekli"
NOW = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
NEXT = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=120)).replace(microsecond=0).isoformat().replace("+00:00", "Z")

# load seed module
spec = importlib.util.spec_from_file_location("seed", os.path.join(HERE, "_real_universities_seed.py"))
seed = importlib.util.module_from_spec(spec); spec.loader.exec_module(seed)

with open(os.path.join(ROOT, "data", "countries.master.json"), encoding="utf-8") as f:
    COUNTRIES = {c["code"]: c for c in json.load(f)}


def slugify(v: str) -> str:
    v = unicodedata.normalize("NFKD", v).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", v).strip("-").lower()


def domain_of(url: str | None) -> str | None:
    if not url or url == seed.CUR:
        return None
    m = re.sub(r"^https?://(www\.)?", "", url).split("/")[0].lower()
    return m or None


# raw_type -> institution_category
TYPE_MAP = {
    "research university": "university",
    "public university": "university",
    "private university": "university",
    "foundation university": "university",
    "technical university": "university",
    "institute of technology": "institute",
    "open university": "university",
    "national university": "university",
    "fine arts university": "university",
    "university of applied sciences": "college",
    "business school": "institute",
    "academy": "academy",
    "institute": "institute",
    "college": "college",
}
VISIBLE_CATS = {"curated_university", "university", "college", "institute", "academy", "school"}


def classify(name: str, raw_type: str):
    if name in seed.CURATED_PRIORITY_NAMES:
        cat, reason, conf = "curated_university", "Küratör onaylı öncelikli kurum", 0.95
    else:
        cat = TYPE_MAP.get(raw_type, "university")
        reason, conf = f"raw_type='{raw_type}' eşlemesinden sınıflandırıldı", 0.7
    visibility = "visible" if cat in VISIBLE_CATS else "review_only"
    priority = {"curated_university": 0, "university": 1, "college": 2,
                "institute": 2, "academy": 3}.get(cat, 4)
    return cat, visibility, priority, reason, conf


def build_record(t) -> dict:
    name, cc, city, raw_type, website, src = t
    country = COUNTRIES.get(cc, {})
    cat, visibility, priority, reason, conf = classify(name, raw_type)
    curated = (src == seed.CUR) or (name in seed.CURATED_PRIORITY_NAMES)
    source_url = website if src == seed.CUR else src
    source_status = "verified" if curated else "needs_review"
    return {
        "id": f"u-{cc.lower()}-{slugify(name)}",
        "name": name,
        "slug": slugify(name),
        "country_code": cc,
        "country_name": country.get("name_tr", cc),
        "city": city or NEEDS,
        "type": raw_type,
        "website_url": website if website and website != seed.CUR else (website or NEEDS),
        "admissions_url": NEEDS,
        "application_platforms": country.get("common_application_platforms", [NEEDS]),
        "popular_program_areas": [NEEDS],
        "general_international_admission_notes": NEEDS,
        "testing_notes": NEEDS,
        "english_proficiency_notes": NEEDS,
        "essay_requirement_notes": NEEDS,
        "scholarship_notes": NEEDS,
        "source_url": source_url,
        "source_title": "Resmî üniversite sitesi" if src == seed.CUR else "Wikipedia üniversite listesi (kimlik)",
        "source_type": "official_website" if src == seed.CUR else "reference_list",
        "last_checked_at": NOW,
        "next_review_at": NEXT,
        "source_status": source_status,
        "confidence_score": conf,
        "needs_human_review": True,                 # admissions content always unverified
        "review_status": "needs_review",
        "reviewer_notes": "Kimlik kaynaktan alındı; kabul/sınav/essay detayları doğrulanmadı.",
        "institution_category": cat,
        "directory_priority": priority,
        "public_visibility": visibility,
        "admissions_data_priority": priority,
        "classification_reason": reason,
        "classification_confidence": conf,
        "is_active": True,
    }


def dedupe(records):
    seen_dom, seen_key, out, dropped = {}, {}, [], 0
    for r in records:
        dom = domain_of(r["website_url"]) if r["website_url"] != NEEDS else None
        key = (slugify(r["name"]), r["country_code"])
        if dom and dom in seen_dom:
            dropped += 1; continue
        if key in seen_key:
            dropped += 1; continue
        if dom:
            seen_dom[dom] = True
        seen_key[key] = True
        out.append(r)
    return out, dropped


TS_HEADER = "// AUTO-GENERATED by scripts/build_universities_from_seed.py — do not edit by hand.\n// Source-based real data. Curated records live in ../_curated.ts and always win.\nimport type { University } from \"@/lib/types\";\n\n"


def write_ts(records):
    gen_dir = os.path.join(ROOT, "src", "lib", "data", "universities", "generated")
    os.makedirs(gen_dir, exist_ok=True)
    by_cc: dict[str, list] = {}
    for r in records:
        by_cc.setdefault(r["country_code"].lower(), []).append(r)
    batch_names = []
    for cc, recs in sorted(by_cc.items()):
        const = f"universities_{cc}"
        batch_names.append((cc, const))
        body = json.dumps(recs, ensure_ascii=False, indent=2)
        body = re.sub(r'^( *)"([a-zA-Z_][a-zA-Z0-9_]*)":', r"\1\2:", body, flags=re.M)
        with open(os.path.join(gen_dir, f"{cc}.ts"), "w", encoding="utf-8") as f:
            f.write(TS_HEADER + f"export const {const}: University[] = {body};\n")
    # index that merges batches
    lines = [TS_HEADER]
    for cc, const in batch_names:
        lines.append(f'import {{ {const} }} from "./{cc}";')
    lines.append("")
    arr = ", ".join("..." + const for _, const in batch_names)
    lines.append(f"export const generatedUniversities: University[] = [{arr}];")
    with open(os.path.join(gen_dir, "index.ts"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    return batch_names


def main():
    raw = [build_record(t) for t in seed.ALL]
    records, dropped = dedupe(raw)
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    with open(os.path.join(ROOT, "data", "universities.master.json"), "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    batches = write_ts(records)
    vis = sum(1 for r in records if r["public_visibility"] == "visible")
    cur = sum(1 for r in records if r["institution_category"] == "curated_university")
    print(f"[build_universities] {len(records)} kurum ({dropped} duplikasyon elendi)")
    print(f"[build_universities] görünür: {vis} | küratör: {cur} | ülke-batch: {len(batches)}")
    print(f"[build_universities] yazıldı: data/universities.master.json + generated/*.ts")


if __name__ == "__main__":
    main()
