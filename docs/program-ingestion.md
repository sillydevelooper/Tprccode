# Program Ingestion

## Boru hattı
`build_program_ingestion_queue.py` (tier-0 küratör üniversitelerden başlar) →
`extract_programs.py` (resmî program-listesi sayfalarını cache-first tarar,
`discover → extract → strict` ile yalnızca gerçek derece programlarını tutar) →
`export_programs.py` (non-destructive TS) → `audit_programs.py`.

Tek komut: `npm run ingest:programs` (`run_program_ingestion_batch.py`).

## Strict filtreler
- Ad bir derece sinyali içermeli (BSc/BA/MSc/Lisans/Yüksek Lisans...).
- Gürültü (cookie/login/news...) elenir.
- Slug bazında dedupe.
- Alan, `classify_field()` ile çok dilli (EN/TR/DE/FR/NL/IT/ES) eşlenir.

## Honesty
Program **adı** resmî sayfadan gelir; **gereklilikler** (`exam/essay/deadline...`)
doğrulanana kadar `"Doğrulama gerekli"`dir.
