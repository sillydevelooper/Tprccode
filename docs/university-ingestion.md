# Üniversite Ingestion

## Yöntem
`ingest_universities.py` kurum kimliğini otoriter bir kaynaktan ölçekli çeker:

`fetch (cache-first) → parse → normalize → classify → dedupe → export`

## Kaynak seçenekleri (`--source`)
- **ror** (varsayılan, önerilen): [ROR — Research Organization Registry]
  (https://ror.org). Yönetişimli, küratörlü, açık lisanslı resmî araştırma kurumu
  kütüğü. **Kararlı kimlik** (`https://ror.org/<id>`), resmî web sitesi ve ülke/şehir
  verisi sağlar. `fetch_ror.py`, ROR v2 API'sini
  (`locations.geonames_details.country_code` + `types:education` filtresi) kullanır.
  Çekilen kaynak: api.ror.org — egress allowlist'inde açık olmalı.
- **wikidata**: `fetch_wikidata.py` SPARQL (Q3918 university, P17 country).
- **wikipedia**: ülke liste sayfası tabloları.

> Neden ROR varsayılan? Wikipedia/Wikidata **topluluk tarafından düzenlenebilir** —
> bir kaydın kimliği herhangi bir an değişebilir, bu yüzden kaynak-öncelikli kabul
> verisi için zayıf bir köken kanıtıdır. ROR küratörlüdür ve kararlı kimlik taşır;
> bu yüzden birincil kimlik kaynağıdır. Wikidata/Wikipedia yalnızca yedek olarak tutulur.

## Köken (provenance) saklama
Her kayıt çekildiği kaynağı saklar: `source_url` (ROR'da kararlı `ror.org/<id>`),
`source_type` (`reference_standard`), `website_url` (kurumun resmî sitesi, ROR'dan).
Kabul/sınav/essay/son-tarih alanları **asla uydurulmaz** → `"Doğrulama gerekli"`,
ve her kayıt `needs_human_review=true`, `review_status="needs_review"` kalır.

## Sınıflandırma
`ingest_common.classify_type()` ham türü `institution_category`'ye eşler. Eğitim
kurumu olmayan kayıtlar (hastane/şirket/ajans) `review_only` olur ve herkese açık
dizinde **görünmez**. Küratör öncelikli kurumlar `curated_university`dir.

## Non-destructive export
`export_universities.py` yalnızca `generated/` ağacını yazar. Küratör override'ları
korunur.
