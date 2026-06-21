# Üniversite Ingestion

## Yöntem (elle yapılanın otomatikleştirilmiş hâli)
İlk veri, otoriter "List of universities in <ülke>" sayfaları araştırılarak
toplandı (Hollanda, Türkiye) ve resmî alan adlarıyla doğrulanmış küresel amiral
gemileri eklendi. `ingest_universities.py` bu yöntemi tüm ülkelere ölçekler:

`fetch (cache-first) → parse → normalize → classify → dedupe → export`

## Kaynak seçenekleri
- **wikipedia** (varsayılan): ülke liste sayfası tabloları.
- **wikidata**: `fetch_wikidata.py` SPARQL (Q3918 university, P17 country).
- **openalex**: `fetch_openalex.py` institutions API (polite pool).

## Sınıflandırma
`ingest_common.classify_type()` ham türü `institution_category`'ye eşler. Eğitim
kurumu olmayan kayıtlar (hastane/şirket/ajans) `review_only` olur ve herkese açık
dizinde **görünmez**. Küratör öncelikli kurumlar `curated_university`dir.

## Non-destructive export
`export_universities.py` yalnızca `generated/` ağacını yazar. Küratör override'ları
korunur.
