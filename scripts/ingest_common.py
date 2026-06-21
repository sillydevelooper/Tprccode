#!/usr/bin/env python3
"""
ingest_common.py
----------------
Shared utilities for the TestPrep Admissions ingestion pipeline.

Design goals (from spec):
  * cache-first: every remote fetch is cached on disk; re-runs are cheap & polite.
  * non-destructive: writers never clobber curated data.
  * honest: admissions-specific fields are never fabricated -> "Doğrulama gerekli".

NETWORK: functions that hit the network are clearly marked. In a sandbox without
egress they will raise; run locally / in CI with network enabled. The offline
builder (build_universities_from_seed.py) produces real data without network using
data already gathered via research.
"""
from __future__ import annotations
import os, re, json, time, hashlib, unicodedata, datetime
from urllib.parse import urlparse

NEEDS = "Doğrulama gerekli"
CACHE_DIR = os.environ.get("INGEST_CACHE_DIR", os.path.join(os.path.dirname(__file__), "..", ".cache", "ingest"))
USER_AGENT = os.environ.get("INGEST_USER_AGENT", "TestPrepAdmissionsBot/0.1 (+contact: you@example.com)")
os.makedirs(CACHE_DIR, exist_ok=True)


def now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def next_review_iso(days: int = 120) -> str:
    return (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()


def domain_of(url: str | None) -> str | None:
    if not url:
        return None
    try:
        host = urlparse(url).hostname or ""
    except ValueError:
        return None
    return host.replace("www.", "").lower() or None


def cache_path(key: str) -> str:
    return os.path.join(CACHE_DIR, hashlib.sha256(key.encode()).hexdigest() + ".cache")


def cached_get(url: str, *, ttl_days: int = 30, sleep: float = 1.0) -> str:
    """Cache-first HTTP GET. Returns response text. NETWORK when cache misses."""
    path = cache_path(url)
    if os.path.exists(path):
        age = time.time() - os.path.getmtime(path)
        if age < ttl_days * 86400:
            with open(path, encoding="utf-8") as f:
                return f.read()
    # --- network section ---
    import urllib.request
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:  # noqa: S310
        text = resp.read().decode("utf-8", errors="replace")
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    time.sleep(sleep)  # politeness
    return text


# raw_type substrings -> institution_category
TYPE_RULES: list[tuple[str, str]] = [
    ("institute of technology", "institute"),
    ("university of applied sciences", "college"),
    ("technical university", "university"),
    ("research university", "university"),
    ("foundation university", "university"),
    ("private university", "university"),
    ("public university", "university"),
    ("open university", "university"),
    ("fine arts", "university"),
    ("business school", "institute"),
    ("medical center", "medical_center"),
    ("academy", "academy"),
    ("college", "college"),
    ("institute", "institute"),
    ("university", "university"),
]
NON_EDUCATION_HINTS = ["hospital", "ministry", "gmbh", "inc.", "company", "agency", "council"]


def classify_type(raw_type: str, name: str, curated_names: set[str]) -> tuple[str, str, float]:
    if name in curated_names:
        return "curated_university", "Küratör onaylı öncelikli kurum", 0.95
    low = (raw_type or "").lower()
    for hint in NON_EDUCATION_HINTS:
        if hint in low or hint in name.lower():
            return "company_or_non_education", f"'{hint}' ipucu — eğitim kurumu değil", 0.5
    for needle, cat in TYPE_RULES:
        if needle in low:
            return cat, f"raw_type '{needle}' eşleşmesi", 0.75
    return "unknown", "Tür belirlenemedi", 0.4


# Program field classification: keyword -> ProgramField (multilingual)
FIELD_MAP: dict[str, str] = {
    # English
    "computer science": "computer_science", "computing": "computer_science", "informatics": "computer_science",
    "software": "computer_science", "artificial intelligence": "data_science_ai", "data science": "data_science_ai",
    "engineering": "engineering", "mechanical": "engineering", "electrical": "engineering", "civil": "engineering",
    "aerospace": "engineering", "business": "business", "management": "business", "economics": "economics",
    "finance": "finance", "psychology": "psychology", "medicine": "medicine_health", "medical": "medicine_health",
    "nursing": "nursing", "pharmacy": "pharmacy", "public health": "public_health", "law": "law",
    "political science": "political_science", "international relations": "international_relations",
    "architecture": "architecture", "design": "design", "biology": "biology", "physics": "physics",
    "mathematics": "mathematics", "chemistry": "chemistry", "philosophy": "philosophy", "sociology": "sociology",
    "communication": "communications_media", "media": "communications_media", "education": "education",
    "environmental": "environmental_science", "agriculture": "agriculture", "music": "music",
    "film": "film_cinema", "cinema": "film_cinema", "theatre": "theater", "theater": "theater",
    "social work": "social_work", "translation": "translation", "theology": "theology",
    "neuroscience": "biology", "criminal justice": "law", "hospitality": "hospitality",
    # Turkish
    "bilgisayar": "computer_science", "yapay zeka": "data_science_ai", "veri bilimi": "data_science_ai",
    "mühendislik": "engineering", "işletme": "business", "ekonomi": "economics", "iktisat": "economics",
    "psikoloji": "psychology", "tıp": "medicine_health", "hukuk": "law", "siyaset": "political_science",
    "uluslararası ilişkiler": "international_relations", "mimarlık": "architecture", "tasarım": "design",
    "fizik": "physics", "matematik": "mathematics", "kimya": "chemistry", "felsefe": "philosophy",
    "sosyoloji": "sociology", "iletişim": "communications_media", "eğitim": "education", "müzik": "music",
    # German / French / Dutch / Italian / Spanish (samples)
    "informatik": "computer_science", "wirtschaft": "business", "rechtswissenschaft": "law",
    "informatique": "computer_science", "économie": "economics", "droit": "law",
    "economia": "economics", "ingegneria": "engineering", "economía": "economics", "derecho": "law",
    "rechten": "law", "geneeskunde": "medicine_health",
}


def classify_field(name: str) -> str:
    low = name.lower()
    for kw, field in FIELD_MAP.items():
        if kw in low:
            return field
    return "other"


def write_json(path: str, data) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_json(path: str, default=None):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)
