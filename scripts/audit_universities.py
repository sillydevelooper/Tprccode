#!/usr/bin/env python3
"""audit_universities.py — quality + integrity audit over the university dataset.
Reports (does not delete). Hard-fail conditions exit non-zero for CI gating."""
from __future__ import annotations
import os, sys, json, ingest_common as ic

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def load_all():
    master = ic.load_json(os.path.join(ROOT, "data", "universities.master.json"), [])
    import glob
    for fp in glob.glob(os.path.join(ROOT, "data", "ingested", "universities.*.json")):
        master += ic.load_json(fp, [])
    return master

def main():
    recs = load_all()
    hard, warn = [], []
    seen = {}
    for r in recs:
        for f in ("id", "name", "slug", "country_code", "source_url", "institution_category", "public_visibility"):
            if not r.get(f):
                hard.append(f"{r.get('id','?')}: zorunlu alan boş -> {f}")
        key = (r.get("slug"), r.get("country_code"))
        if key in seen:
            warn.append(f"duplikasyon: {key}")
        seen[key] = True
        if r.get("public_visibility") == "visible" and r.get("institution_category") in (None, "unknown", "company_or_non_education"):
            hard.append(f"{r['id']}: görünür ama kategori geçersiz ({r.get('institution_category')})")
        if not r.get("needs_human_review", True) and r.get("review_status") != "approved":
            warn.append(f"{r['id']}: review bayrağı tutarsız")
    total = len(recs)
    visible = sum(1 for r in recs if r.get("public_visibility") == "visible")
    needs = sum(1 for r in recs if r.get("needs_human_review"))
    print("=== UNIVERSITE DENETİMİ ===")
    print(f"toplam: {total} | görünür: {visible} | inceleme bekleyen: {needs}")
    print(f"HARD FAIL: {len(hard)} | WARN: {len(warn)}")
    for h in hard[:30]: print("  [HARD]", h)
    for w in warn[:20]: print("  [WARN]", w)
    if hard:
        sys.exit(1)

if __name__ == "__main__":
    main()
