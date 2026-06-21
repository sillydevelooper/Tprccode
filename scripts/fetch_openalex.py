#!/usr/bin/env python3
"""fetch_openalex.py — fetch institutions for a country via OpenAlex API.
Real paginated API; NETWORK required. Polite pool via OPENALEX_MAILTO."""
from __future__ import annotations
import os, json, ingest_common as ic

BASE = "https://api.openalex.org/institutions"

def fetch_institutions(cc: str, country_name_tr: str, max_pages: int = 5) -> list[dict]:
    mailto = os.environ.get("OPENALEX_MAILTO", "you@example.com")
    out, cursor = [], "*"
    for _ in range(max_pages):
        url = f"{BASE}?filter=country_code:{cc.lower()},type:education&per-page=200&cursor={cursor}&mailto={mailto}"
        data = json.loads(ic.cached_get(url, ttl_days=30))
        for r in data.get("results", []):
            out.append({
                "name": r.get("display_name", "").strip(),
                "city": (r.get("geo") or {}).get("city") or ic.NEEDS,
                "raw_type": r.get("type", "university") or "university",
                "country_code": cc, "country_name": country_name_tr,
                "_website": r.get("homepage_url"),
            })
        cursor = data.get("meta", {}).get("next_cursor")
        if not cursor:
            break
    return out

if __name__ == "__main__":
    import sys
    cc = sys.argv[1] if len(sys.argv) > 1 else "NL"
    print(f"{cc}: {len(fetch_institutions(cc, cc))} kurum (OpenAlex)")
