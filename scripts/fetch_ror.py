#!/usr/bin/env python3
"""fetch_ror.py — fetch universities for a country from ROR (Research Organization
Registry), an authoritative, governed, openly-licensed registry of research
organizations.

Why ROR instead of Wikipedia/Wikidata: wiki sources are community-editable, so a
record's identity can change at any time and is not a reliable provenance anchor.
ROR records are curated under a governance process and carry STABLE identifiers
(https://ror.org/<id>), official websites and country/locality data — a far better
"source-first" anchor for admissions intelligence.

Real query against the public ROR v2 API; cache-first (NETWORK on cache miss).
Returns raw records consumed by ingest_universities.normalize(). Admissions-specific
fields are never invented here — only verifiable identity is taken from ROR.
"""
from __future__ import annotations
import json, urllib.parse, ingest_common as ic

API = "https://api.ror.org/v2/organizations"
PER_PAGE = 20  # ROR v2 fixed page size


def _display_name(org: dict) -> str:
    names = org.get("names", []) or []
    for n in names:
        if "ror_display" in (n.get("types") or []) and n.get("value"):
            return n["value"].strip()
    for n in names:
        if n.get("value"):
            return n["value"].strip()
    return ""


def _city(org: dict) -> str:
    for loc in org.get("locations", []) or []:
        d = loc.get("geonames_details") or {}
        if d.get("name"):
            return d["name"]
    return ic.NEEDS


def _website(org: dict):
    for link in org.get("links", []) or []:
        if link.get("type") == "website" and link.get("value"):
            return link["value"]
    return None


def _raw_type(name: str) -> str:
    low = name.lower()
    if "institute of technology" in low or "technical university" in low:
        return "technical university"
    if "university of applied sciences" in low:
        return "university of applied sciences"
    if "academy" in low:
        return "academy"
    if "institute" in low:
        return "institute"
    if "college" in low:
        return "college"
    return "university"


def fetch_universities(cc: str, country_name_tr: str, *, max_pages: int = 50) -> list[dict]:
    """Return raw identity records for active education organizations in <cc>."""
    out: list[dict] = []
    page = 1
    while page <= max_pages:
        params = {
            "filter": f"locations.geonames_details.country_code:{cc.upper()},types:education",
            "page": page,
        }
        url = API + "?" + urllib.parse.urlencode(params)
        data = json.loads(ic.cached_get(url, ttl_days=30))
        items = data.get("items", []) or []
        if not items:
            break
        for org in items:
            if (org.get("status") or "active") != "active":
                continue
            name = _display_name(org)
            if not name:
                continue
            out.append({
                "name": name,
                "city": _city(org),
                "raw_type": _raw_type(name),
                "country_code": cc.upper(),
                "country_name": country_name_tr,
                "_website": _website(org),
                "_source_url": org.get("id"),  # stable, citable ROR identifier
                "_source_title": "ROR — Research Organization Registry (kimlik)",
                "_source_type": "reference_standard",
            })
        total = data.get("number_of_results", 0)
        if page * PER_PAGE >= total:
            break
        page += 1
    return out


if __name__ == "__main__":
    import sys
    cc = sys.argv[1] if len(sys.argv) > 1 else "FI"
    recs = fetch_universities(cc, cc)
    print(f"{cc}: {len(recs)} kurum (ROR)")
