#!/usr/bin/env python3
"""fetch_wikidata.py — fetch universities for a country via Wikidata SPARQL.
Real query; NETWORK required. Returns raw records consumed by ingest_universities."""
from __future__ import annotations
import json, urllib.parse, ingest_common as ic

ENDPOINT = "https://query.wikidata.org/sparql"
# Q3918 = university; P17 = country; ISO 3166 alpha-2 via P297 on the country item.
QUERY = """
SELECT ?inst ?instLabel ?cityLabel ?website WHERE {
  ?country wdt:P297 "%s" .
  ?inst wdt:P31/wdt:P279* wd:Q3918 ; wdt:P17 ?country .
  OPTIONAL { ?inst wdt:P159 ?hq . ?hq wdt:P131* ?city . ?city wdt:P31/wdt:P279* wd:Q515 . }
  OPTIONAL { ?inst wdt:P856 ?website . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 1000
"""

def fetch_universities(cc: str, country_name_tr: str) -> list[dict]:
    url = ENDPOINT + "?" + urllib.parse.urlencode({"query": QUERY % cc, "format": "json"})
    data = json.loads(ic.cached_get(url, ttl_days=30))
    out = []
    for b in data.get("results", {}).get("bindings", []):
        name = b.get("instLabel", {}).get("value", "").strip()
        if not name or name.startswith("Q"):
            continue
        out.append({
            "name": name,
            "city": b.get("cityLabel", {}).get("value", ic.NEEDS) or ic.NEEDS,
            "raw_type": "university",
            "country_code": cc, "country_name": country_name_tr,
            "_website": b.get("website", {}).get("value"),
        })
    return out

if __name__ == "__main__":
    import sys
    cc = sys.argv[1] if len(sys.argv) > 1 else "NL"
    recs = fetch_universities(cc, cc)
    print(f"{cc}: {len(recs)} kurum (Wikidata)")
