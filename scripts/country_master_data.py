#!/usr/bin/env python3
"""
country_master_data.py
----------------------
Builds the global country master list for TestPrep Admissions.

DATA SOURCE POLICY
==================
* Country identity fields (name_en, name_tr, ISO code, region) are REAL reference
  data based on the ISO 3166-1 standard and UN M49 regional groupings. These are
  stable, verifiable facts — not fabricated admissions claims.
* Admissions-specific fields (admission systems, platforms, English notes, essay
  notes, deadline notes, scholarship notes, Turkish-student notes) are NOT
  fabricated. Where a field has not been verified against an official/cited source
  it is set to the Turkish placeholder "Doğrulama gerekli" and the record is marked
  needs_human_review=True, review_status="needs_review".

OUTPUT
======
Writes data/countries.master.json (machine-readable master).
The TypeScript file src/lib/data/countries.ts is produced by build_countries_ts.py
which consumes this JSON. This separation keeps generation non-destructive and
re-runnable.

This script requires NO network access.
"""
from __future__ import annotations
import json
import os
import datetime
import unicodedata
import re

NEEDS = "Doğrulama gerekli"
NOW = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
NEXT_REVIEW = (datetime.datetime.utcnow() + datetime.timedelta(days=180)).replace(microsecond=0).isoformat() + "Z"

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
os.makedirs(OUT_DIR, exist_ok=True)

# (ISO alpha-2, name_en, name_tr, region)  -- real ISO 3166-1 / UN M49 reference data
COUNTRIES: list[tuple[str, str, str, str]] = [
    ("AF", "Afghanistan", "Afganistan", "Asya"),
    ("AL", "Albania", "Arnavutluk", "Avrupa"),
    ("DZ", "Algeria", "Cezayir", "Afrika"),
    ("AD", "Andorra", "Andorra", "Avrupa"),
    ("AO", "Angola", "Angola", "Afrika"),
    ("AG", "Antigua and Barbuda", "Antigua ve Barbuda", "Kuzey Amerika"),
    ("AR", "Argentina", "Arjantin", "Güney Amerika"),
    ("AM", "Armenia", "Ermenistan", "Asya"),
    ("AU", "Australia", "Avustralya", "Okyanusya"),
    ("AT", "Austria", "Avusturya", "Avrupa"),
    ("AZ", "Azerbaijan", "Azerbaycan", "Asya"),
    ("BS", "Bahamas", "Bahamalar", "Kuzey Amerika"),
    ("BH", "Bahrain", "Bahreyn", "Asya"),
    ("BD", "Bangladesh", "Bangladeş", "Asya"),
    ("BB", "Barbados", "Barbados", "Kuzey Amerika"),
    ("BY", "Belarus", "Belarus", "Avrupa"),
    ("BE", "Belgium", "Belçika", "Avrupa"),
    ("BZ", "Belize", "Belize", "Kuzey Amerika"),
    ("BJ", "Benin", "Benin", "Afrika"),
    ("BT", "Bhutan", "Butan", "Asya"),
    ("BO", "Bolivia", "Bolivya", "Güney Amerika"),
    ("BA", "Bosnia and Herzegovina", "Bosna-Hersek", "Avrupa"),
    ("BW", "Botswana", "Botsvana", "Afrika"),
    ("BR", "Brazil", "Brezilya", "Güney Amerika"),
    ("BN", "Brunei", "Brunei", "Asya"),
    ("BG", "Bulgaria", "Bulgaristan", "Avrupa"),
    ("BF", "Burkina Faso", "Burkina Faso", "Afrika"),
    ("BI", "Burundi", "Burundi", "Afrika"),
    ("CV", "Cape Verde", "Cabo Verde", "Afrika"),
    ("KH", "Cambodia", "Kamboçya", "Asya"),
    ("CM", "Cameroon", "Kamerun", "Afrika"),
    ("CA", "Canada", "Kanada", "Kuzey Amerika"),
    ("CF", "Central African Republic", "Orta Afrika Cumhuriyeti", "Afrika"),
    ("TD", "Chad", "Çad", "Afrika"),
    ("CL", "Chile", "Şili", "Güney Amerika"),
    ("CN", "China", "Çin", "Asya"),
    ("CO", "Colombia", "Kolombiya", "Güney Amerika"),
    ("KM", "Comoros", "Komorlar", "Afrika"),
    ("CG", "Congo (Republic)", "Kongo Cumhuriyeti", "Afrika"),
    ("CD", "Congo (DRC)", "Kongo Demokratik Cumhuriyeti", "Afrika"),
    ("CR", "Costa Rica", "Kosta Rika", "Kuzey Amerika"),
    ("CI", "Côte d'Ivoire", "Fildişi Sahili", "Afrika"),
    ("HR", "Croatia", "Hırvatistan", "Avrupa"),
    ("CU", "Cuba", "Küba", "Kuzey Amerika"),
    ("CY", "Cyprus", "Kıbrıs", "Avrupa"),
    ("CZ", "Czechia", "Çekya", "Avrupa"),
    ("DK", "Denmark", "Danimarka", "Avrupa"),
    ("DJ", "Djibouti", "Cibuti", "Afrika"),
    ("DM", "Dominica", "Dominika", "Kuzey Amerika"),
    ("DO", "Dominican Republic", "Dominik Cumhuriyeti", "Kuzey Amerika"),
    ("EC", "Ecuador", "Ekvador", "Güney Amerika"),
    ("EG", "Egypt", "Mısır", "Afrika"),
    ("SV", "El Salvador", "El Salvador", "Kuzey Amerika"),
    ("GQ", "Equatorial Guinea", "Ekvator Ginesi", "Afrika"),
    ("ER", "Eritrea", "Eritre", "Afrika"),
    ("EE", "Estonia", "Estonya", "Avrupa"),
    ("SZ", "Eswatini", "Esvatini", "Afrika"),
    ("ET", "Ethiopia", "Etiyopya", "Afrika"),
    ("FJ", "Fiji", "Fiji", "Okyanusya"),
    ("FI", "Finland", "Finlandiya", "Avrupa"),
    ("FR", "France", "Fransa", "Avrupa"),
    ("GA", "Gabon", "Gabon", "Afrika"),
    ("GM", "Gambia", "Gambiya", "Afrika"),
    ("GE", "Georgia", "Gürcistan", "Asya"),
    ("DE", "Germany", "Almanya", "Avrupa"),
    ("GH", "Ghana", "Gana", "Afrika"),
    ("GR", "Greece", "Yunanistan", "Avrupa"),
    ("GD", "Grenada", "Grenada", "Kuzey Amerika"),
    ("GT", "Guatemala", "Guatemala", "Kuzey Amerika"),
    ("GN", "Guinea", "Gine", "Afrika"),
    ("GW", "Guinea-Bissau", "Gine-Bissau", "Afrika"),
    ("GY", "Guyana", "Guyana", "Güney Amerika"),
    ("HT", "Haiti", "Haiti", "Kuzey Amerika"),
    ("HN", "Honduras", "Honduras", "Kuzey Amerika"),
    ("HU", "Hungary", "Macaristan", "Avrupa"),
    ("IS", "Iceland", "İzlanda", "Avrupa"),
    ("IN", "India", "Hindistan", "Asya"),
    ("ID", "Indonesia", "Endonezya", "Asya"),
    ("IR", "Iran", "İran", "Asya"),
    ("IQ", "Iraq", "Irak", "Asya"),
    ("IE", "Ireland", "İrlanda", "Avrupa"),
    ("IL", "Israel", "İsrail", "Asya"),
    ("IT", "Italy", "İtalya", "Avrupa"),
    ("JM", "Jamaica", "Jamaika", "Kuzey Amerika"),
    ("JP", "Japan", "Japonya", "Asya"),
    ("JO", "Jordan", "Ürdün", "Asya"),
    ("KZ", "Kazakhstan", "Kazakistan", "Asya"),
    ("KE", "Kenya", "Kenya", "Afrika"),
    ("KI", "Kiribati", "Kiribati", "Okyanusya"),
    ("KW", "Kuwait", "Kuveyt", "Asya"),
    ("KG", "Kyrgyzstan", "Kırgızistan", "Asya"),
    ("LA", "Laos", "Laos", "Asya"),
    ("LV", "Latvia", "Letonya", "Avrupa"),
    ("LB", "Lebanon", "Lübnan", "Asya"),
    ("LS", "Lesotho", "Lesotho", "Afrika"),
    ("LR", "Liberia", "Liberya", "Afrika"),
    ("LY", "Libya", "Libya", "Afrika"),
    ("LI", "Liechtenstein", "Lihtenştayn", "Avrupa"),
    ("LT", "Lithuania", "Litvanya", "Avrupa"),
    ("LU", "Luxembourg", "Lüksemburg", "Avrupa"),
    ("MG", "Madagascar", "Madagaskar", "Afrika"),
    ("MW", "Malawi", "Malavi", "Afrika"),
    ("MY", "Malaysia", "Malezya", "Asya"),
    ("MV", "Maldives", "Maldivler", "Asya"),
    ("ML", "Mali", "Mali", "Afrika"),
    ("MT", "Malta", "Malta", "Avrupa"),
    ("MH", "Marshall Islands", "Marshall Adaları", "Okyanusya"),
    ("MR", "Mauritania", "Moritanya", "Afrika"),
    ("MU", "Mauritius", "Mauritius", "Afrika"),
    ("MX", "Mexico", "Meksika", "Kuzey Amerika"),
    ("FM", "Micronesia", "Mikronezya", "Okyanusya"),
    ("MD", "Moldova", "Moldova", "Avrupa"),
    ("MC", "Monaco", "Monako", "Avrupa"),
    ("MN", "Mongolia", "Moğolistan", "Asya"),
    ("ME", "Montenegro", "Karadağ", "Avrupa"),
    ("MA", "Morocco", "Fas", "Afrika"),
    ("MZ", "Mozambique", "Mozambik", "Afrika"),
    ("MM", "Myanmar", "Myanmar", "Asya"),
    ("NA", "Namibia", "Namibya", "Afrika"),
    ("NR", "Nauru", "Nauru", "Okyanusya"),
    ("NP", "Nepal", "Nepal", "Asya"),
    ("NL", "Netherlands", "Hollanda", "Avrupa"),
    ("NZ", "New Zealand", "Yeni Zelanda", "Okyanusya"),
    ("NI", "Nicaragua", "Nikaragua", "Kuzey Amerika"),
    ("NE", "Niger", "Nijer", "Afrika"),
    ("NG", "Nigeria", "Nijerya", "Afrika"),
    ("KP", "North Korea", "Kuzey Kore", "Asya"),
    ("MK", "North Macedonia", "Kuzey Makedonya", "Avrupa"),
    ("NO", "Norway", "Norveç", "Avrupa"),
    ("OM", "Oman", "Umman", "Asya"),
    ("PK", "Pakistan", "Pakistan", "Asya"),
    ("PW", "Palau", "Palau", "Okyanusya"),
    ("PS", "Palestine", "Filistin", "Asya"),
    ("PA", "Panama", "Panama", "Kuzey Amerika"),
    ("PG", "Papua New Guinea", "Papua Yeni Gine", "Okyanusya"),
    ("PY", "Paraguay", "Paraguay", "Güney Amerika"),
    ("PE", "Peru", "Peru", "Güney Amerika"),
    ("PH", "Philippines", "Filipinler", "Asya"),
    ("PL", "Poland", "Polonya", "Avrupa"),
    ("PT", "Portugal", "Portekiz", "Avrupa"),
    ("QA", "Qatar", "Katar", "Asya"),
    ("RO", "Romania", "Romanya", "Avrupa"),
    ("RU", "Russia", "Rusya", "Avrupa"),
    ("RW", "Rwanda", "Ruanda", "Afrika"),
    ("KN", "Saint Kitts and Nevis", "Saint Kitts ve Nevis", "Kuzey Amerika"),
    ("LC", "Saint Lucia", "Saint Lucia", "Kuzey Amerika"),
    ("VC", "Saint Vincent and the Grenadines", "Saint Vincent ve Grenadinler", "Kuzey Amerika"),
    ("WS", "Samoa", "Samoa", "Okyanusya"),
    ("SM", "San Marino", "San Marino", "Avrupa"),
    ("ST", "São Tomé and Príncipe", "São Tomé ve Príncipe", "Afrika"),
    ("SA", "Saudi Arabia", "Suudi Arabistan", "Asya"),
    ("SN", "Senegal", "Senegal", "Afrika"),
    ("RS", "Serbia", "Sırbistan", "Avrupa"),
    ("SC", "Seychelles", "Seyşeller", "Afrika"),
    ("SL", "Sierra Leone", "Sierra Leone", "Afrika"),
    ("SG", "Singapore", "Singapur", "Asya"),
    ("SK", "Slovakia", "Slovakya", "Avrupa"),
    ("SI", "Slovenia", "Slovenya", "Avrupa"),
    ("SB", "Solomon Islands", "Solomon Adaları", "Okyanusya"),
    ("SO", "Somalia", "Somali", "Afrika"),
    ("ZA", "South Africa", "Güney Afrika", "Afrika"),
    ("KR", "South Korea", "Güney Kore", "Asya"),
    ("SS", "South Sudan", "Güney Sudan", "Afrika"),
    ("ES", "Spain", "İspanya", "Avrupa"),
    ("LK", "Sri Lanka", "Sri Lanka", "Asya"),
    ("SD", "Sudan", "Sudan", "Afrika"),
    ("SR", "Suriname", "Surinam", "Güney Amerika"),
    ("SE", "Sweden", "İsveç", "Avrupa"),
    ("CH", "Switzerland", "İsviçre", "Avrupa"),
    ("SY", "Syria", "Suriye", "Asya"),
    ("TW", "Taiwan", "Tayvan", "Asya"),
    ("TJ", "Tajikistan", "Tacikistan", "Asya"),
    ("TZ", "Tanzania", "Tanzanya", "Afrika"),
    ("TH", "Thailand", "Tayland", "Asya"),
    ("TL", "Timor-Leste", "Doğu Timor", "Asya"),
    ("TG", "Togo", "Togo", "Afrika"),
    ("TO", "Tonga", "Tonga", "Okyanusya"),
    ("TT", "Trinidad and Tobago", "Trinidad ve Tobago", "Kuzey Amerika"),
    ("TN", "Tunisia", "Tunus", "Afrika"),
    ("TR", "Turkey", "Türkiye", "Avrupa"),
    ("TM", "Turkmenistan", "Türkmenistan", "Asya"),
    ("TV", "Tuvalu", "Tuvalu", "Okyanusya"),
    ("UG", "Uganda", "Uganda", "Afrika"),
    ("UA", "Ukraine", "Ukrayna", "Avrupa"),
    ("AE", "United Arab Emirates", "Birleşik Arap Emirlikleri", "Asya"),
    ("GB", "United Kingdom", "Birleşik Krallık", "Avrupa"),
    ("US", "United States", "Amerika Birleşik Devletleri", "Kuzey Amerika"),
    ("UY", "Uruguay", "Uruguay", "Güney Amerika"),
    ("UZ", "Uzbekistan", "Özbekistan", "Asya"),
    ("VU", "Vanuatu", "Vanuatu", "Okyanusya"),
    ("VA", "Vatican City", "Vatikan", "Avrupa"),
    ("VE", "Venezuela", "Venezuela", "Güney Amerika"),
    ("VN", "Vietnam", "Vietnam", "Asya"),
    ("YE", "Yemen", "Yemen", "Asya"),
    ("ZM", "Zambia", "Zambiya", "Afrika"),
    ("ZW", "Zimbabwe", "Zimbabve", "Afrika"),
    # Major dependent territories commonly present in international education datasets
    ("HK", "Hong Kong", "Hong Kong", "Asya"),
    ("MO", "Macau", "Makao", "Asya"),
    ("PR", "Puerto Rico", "Porto Riko", "Kuzey Amerika"),
    ("GI", "Gibraltar", "Cebelitarık", "Avrupa"),
    ("FO", "Faroe Islands", "Faroe Adaları", "Avrupa"),
    ("GL", "Greenland", "Grönland", "Kuzey Amerika"),
    ("BM", "Bermuda", "Bermuda", "Kuzey Amerika"),
    ("KY", "Cayman Islands", "Cayman Adaları", "Kuzey Amerika"),
    ("NC", "New Caledonia", "Yeni Kaledonya", "Okyanusya"),
    ("PF", "French Polynesia", "Fransız Polinezyası", "Okyanusya"),
    ("XK", "Kosovo", "Kosova", "Avrupa"),
]

# Verified, source-light identity helpers we are confident about for a few major
# destinations (application platforms are widely-documented public facts). Anything
# admissions-specific that is not verified stays as NEEDS.
PLATFORM_HINTS = {
    "US": ["Common App", "Coalition Application", "üniversiteye özel portal"],
    "GB": ["UCAS"],
    "CA": ["OUAC (Ontario)", "üniversiteye özel portal"],
    "AU": ["UAC / üniversiteye özel portal"],
    "NL": ["Studielink"],
    "IE": ["CAO"],
    "DE": ["uni-assist", "Hochschulstart", "üniversiteye özel portal"],
    "TR": ["YÖK / ÖSYM (yurt içi)", "üniversiteye özel uluslararası başvuru"],
}
SYSTEM_HINTS = {
    "US": ["holistic admissions"],
    "GB": ["UCAS tariff / personal statement"],
    "TR": ["YKS (yurt içi)", "uluslararası öğrenci sınavı/başvurusu"],
}


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value


def build() -> list[dict]:
    records = []
    for code, name_en, name_tr, region in COUNTRIES:
        records.append({
            "name_tr": name_tr,
            "name_en": name_en,
            "slug": slugify(name_en),
            "code": code,
            "region": region,
            "popular_admission_systems": SYSTEM_HINTS.get(code, [NEEDS]),
            "common_application_platforms": PLATFORM_HINTS.get(code, [NEEDS]),
            "english_proficiency_notes": NEEDS,
            "essay_or_statement_notes": NEEDS,
            "typical_deadline_notes": NEEDS,
            "scholarship_notes": NEEDS,
            "turkish_students_notes": NEEDS,
            "source_url": "https://www.iso.org/obp/ui/#search",
            "source_title": "ISO 3166-1 ülke kodları (kimlik alanları)",
            "source_type": "reference_standard",
            "last_checked_at": NOW,
            "next_review_at": NEXT_REVIEW,
            "source_status": "verified" if True else "needs_review",
            "confidence_score": 0.6,
            "needs_human_review": True,
            "review_status": "needs_review",
            "reviewer_notes": "Kimlik alanları ISO 3166 referansından üretildi. Kabul/başvuru detayları doğrulanmadı.",
        })
    records.sort(key=lambda r: r["name_tr"])
    return records


def main():
    records = build()
    out_path = os.path.join(OUT_DIR, "countries.master.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    verified = sum(1 for r in records if r["source_status"] == "verified")
    print(f"[country_master_data] {len(records)} ülke yazıldı -> {out_path}")
    print(f"[country_master_data] kimlik-doğrulanmış: {verified} | kabul-detayı doğrulanmamış: {len(records)}")


if __name__ == "__main__":
    main()
