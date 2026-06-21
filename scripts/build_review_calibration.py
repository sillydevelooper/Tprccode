#!/usr/bin/env python3
"""build_review_calibration.py — summarize the review queue so curators know where
to spend effort: counts by entity type, country, and confidence band. No network."""
from __future__ import annotations
import os, json, glob, ingest_common as ic
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
def main():
    unis = ic.load_json(os.path.join(ROOT, "data", "universities.master.json"), [])
    for fp in glob.glob(os.path.join(ROOT, "data", "ingested", "universities.*.json")):
        unis += ic.load_json(fp, [])
    by_country, by_band = {}, {"yüksek (>=0.8)": 0, "orta (0.5-0.8)": 0, "düşük (<0.5)": 0}
    for u in unis:
        if u.get("needs_human_review"):
            by_country[u["country_code"]] = by_country.get(u["country_code"], 0) + 1
        c = u.get("confidence_score", 0)
        band = "yüksek (>=0.8)" if c >= 0.8 else "orta (0.5-0.8)" if c >= 0.5 else "düşük (<0.5)"
        by_band[band] += 1
    report = {"generated_at": ic.now_iso(), "needs_review_by_country": dict(sorted(by_country.items(), key=lambda x: -x[1])), "by_confidence_band": by_band}
    ic.write_json(os.path.join(ROOT, "data", "review_calibration.json"), report)
    print("[calibration] data/review_calibration.json yazıldı")
    print("  güven bantları:", by_band)
if __name__ == "__main__":
    main()
