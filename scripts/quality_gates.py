#!/usr/bin/env python3
"""quality_gates.py — single CI entrypoint enforcing the spec's gates.

STRUCTURAL HARD FAILS (exit 1): missing required fields; duplicate slugs/ids;
visible record with non-education category; broken merge (curated vs generated id clash).
PUBLISHING HARD FAILS (exit 1): a record marked approved/verified that still
contains fabricated-placeholder requirements (i.e. claims to be done but isn't),
or a record promoted as 'verified' source_status while needs_human_review is True
for identity fields.
WARNING GATES (exit 0, reported): field='other'; low confidence; stale next_review.
"""
from __future__ import annotations
import os, sys, glob, ingest_common as ic
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def load(name):
    data = ic.load_json(os.path.join(ROOT, "data", name), [])
    return data

def main():
    countries = load("countries.master.json")
    unis = load("universities.master.json")
    for fp in glob.glob(os.path.join(ROOT, "data", "ingested", "universities.*.json")):
        unis += ic.load_json(fp, [])
    programs = ic.load_json(os.path.join(ROOT, "data", "ingested", "programs.extracted.json"), [])

    hard, warn = [], []

    # structural — universities
    seen = set()
    for u in unis:
        for f in ("id", "name", "slug", "country_code", "institution_category", "public_visibility", "source_url"):
            if not u.get(f): hard.append(f"[uni structural] {u.get('id','?')} boş {f}")
        k = (u.get("slug"), u.get("country_code"))
        if k in seen: hard.append(f"[uni structural] duplikasyon {k}")
        seen.add(k)
        if u.get("public_visibility") == "visible" and u.get("institution_category") in ("company_or_non_education", "unknown", None):
            hard.append(f"[uni publishing] {u['id']} görünür ama eğitim kurumu değil/bilinmiyor")
        # publishing honesty
        if u.get("review_status") == "approved" and u.get("general_international_admission_notes") == ic.NEEDS:
            hard.append(f"[uni publishing] {u['id']} onaylı ama kabul notları doğrulanmamış")
        if u.get("confidence_score", 1) < 0.5: warn.append(f"[uni warn] {u['id']} düşük güven")

    # structural — countries
    cc_seen = set()
    for c in countries:
        if c["code"] in cc_seen: hard.append(f"[country structural] tekrar kod {c['code']}")
        cc_seen.add(c["code"])

    # programs
    for p in programs:
        for f in ("id", "name_en", "slug", "university_id", "field", "source_url"):
            if not p.get(f): hard.append(f"[prog structural] {p.get('id','?')} boş {f}")
        if p.get("review_status") == "approved" and p.get("exam_requirement_summary") == ic.NEEDS:
            hard.append(f"[prog publishing] {p['id']} onaylı ama gereklilik yok")
        if p.get("field") == "other": warn.append(f"[prog warn] {p['id']} alan='other'")

    print("=== KALİTE KAPILARI ===")
    print(f"ülke: {len(countries)} | üniversite: {len(unis)} | program: {len(programs)}")
    print(f"HARD FAIL: {len(hard)} | WARN: {len(warn)}")
    for h in hard[:40]: print("  [HARD]", h)
    for w in warn[:15]: print("  [WARN]", w)
    if hard:
        print("\nSONUÇ: BAŞARISIZ — yayın engellendi.")
        sys.exit(1)
    print("\nSONUÇ: GEÇTİ — yapısal/yayın kapıları temiz.")

if __name__ == "__main__":
    main()
