#!/usr/bin/env python3
"""audit_countries.py — integrity audit over the country master."""
from __future__ import annotations
import os, sys, ingest_common as ic

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def main():
    recs = ic.load_json(os.path.join(ROOT, "data", "countries.master.json"), [])
    hard, warn = [], []
    seen_codes, seen_slugs = set(), set()
    for r in recs:
        for f in ("name_tr", "name_en", "slug", "code", "region", "source_url"):
            if not r.get(f):
                hard.append(f"{r.get('code','?')}: zorunlu alan boş -> {f}")
        if r["code"] in seen_codes: hard.append(f"tekrarlı kod: {r['code']}")
        if r["slug"] in seen_slugs: hard.append(f"tekrarlı slug: {r['slug']}")
        seen_codes.add(r["code"]); seen_slugs.add(r["slug"])
        if len(r["code"]) != 2: warn.append(f"{r['code']}: ISO alpha-2 değil")
    print("=== ÜLKE DENETİMİ ===")
    print(f"toplam: {len(recs)} | HARD FAIL: {len(hard)} | WARN: {len(warn)}")
    for h in hard[:30]: print("  [HARD]", h)
    for w in warn[:10]: print("  [WARN]", w)
    if hard: sys.exit(1)

if __name__ == "__main__":
    main()
