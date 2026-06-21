#!/usr/bin/env python3
"""audit_programs.py — integrity + quality audit over programs (curated + extracted)."""
from __future__ import annotations
import os, sys, json, ingest_common as ic
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
def main():
    recs = ic.load_json(os.path.join(ROOT, "data", "ingested", "programs.extracted.json"), [])
    hard, warn, seen = [], [], set()
    for r in recs:
        for f in ("id", "name_en", "slug", "university_id", "field", "source_url"):
            if not r.get(f): hard.append(f"{r.get('id','?')}: boş alan {f}")
        if r.get("field") == "other": warn.append(f"{r.get('id')}: alan sınıflandırılamadı")
        if r["slug"] in seen: warn.append(f"duplikasyon: {r['slug']}")
        seen.add(r["slug"])
        # quality gate: a "verified" program must not carry fabricated requirements
        if r.get("review_status") == "approved" and r.get("exam_requirement_summary") == ic.NEEDS:
            warn.append(f"{r['id']}: onaylı ama gereklilik doğrulanmamış")
    print("=== PROGRAM DENETİMİ ===")
    print(f"toplam: {len(recs)} | HARD: {len(hard)} | WARN: {len(warn)}")
    for h in hard[:20]: print("  [HARD]", h)
    for w in warn[:20]: print("  [WARN]", w)
    if hard: sys.exit(1)
if __name__ == "__main__":
    main()
