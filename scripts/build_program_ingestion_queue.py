#!/usr/bin/env python3
"""build_program_ingestion_queue.py — build a tiered crawl queue of program-listing
URLs, starting from tier-0 curated universities (real official domains). Output:
data/ingested/program_queue.json. No network (uses known official sites)."""
from __future__ import annotations
import os, json, ingest_common as ic

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def main():
    unis = ic.load_json(os.path.join(ROOT, "data", "universities.master.json"), [])
    queue = []
    for u in unis:
        tier = "tier_0_curated" if u.get("institution_category") == "curated_university" else "tier_2_priority"
        site = u.get("website_url")
        if not site or site == ic.NEEDS:
            continue
        queue.append({
            "university_id": u["id"], "university_name": u["name"], "country_code": u["country_code"],
            "crawl_tier": tier, "seed_url": site,
            "candidate_paths": ["/en/education/programmes", "/study", "/programs", "/courses", "/en/study", "/academics"],
            "status": "pending",
        })
    queue.sort(key=lambda q: 0 if q["crawl_tier"] == "tier_0_curated" else 1)
    ic.write_json(os.path.join(ROOT, "data", "ingested", "program_queue.json"), queue)
    print(f"[queue] {len(queue)} üniversite kuyruğa alındı (tier-0 önce).")

if __name__ == "__main__":
    main()
