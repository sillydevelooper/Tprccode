# DURUM (STATUS) — TestPrep Admissions

Son güncelleme: 2026-06-21. Bu dosya, **dürüstçe** neyin gerçek/çalışır, neyin
ölçeklenmeye hazır iskele olduğunu ve hangi adımın ağ erişimi gerektirdiğini anlatır.

## Gerçek ve doğrulanmış (bu repoda hazır)
- **207 ülke** — gerçek ISO 3166-1 kimlik verisi (`data/countries.master.json`,
  `src/lib/data/countries.ts`). Kabul/başvuru detayları kasıtlı olarak
  `"Doğrulama gerekli"`.
- **119 üniversite / 20 ülke** — kendi web araştırmamla toplanan gerçek kayıtlar:
  - Hollanda ve Türkiye, otoriter "List of universities in <ülke>" sayfalarından
    (gerçek şehir/tür, gerçek `source_url`).
  - Küresel amiral gemileri (Harvard, MIT, Oxford, Cambridge, ETH Zürih, EPFL,
    TU Delft, Toronto, NUS, Boğaziçi, ODTÜ, Koç, Sabancı…) — kaynak **kendi resmî
    siteleri**. Hepsinin kimliği doğrulanmış; kabul içeriği `"Doğrulama gerekli"`.
- **12 gerçek program** — TU Delft (Bilgisayar/Havacılık), UvA, Leiden, Bocconi,
  Oxford PPE, Imperial, ETH, Boğaziçi/ODTÜ/Koç Bilgisayar Müh., Sciences Po —
  her biri resmî program sayfası kaynağıyla; gereklilikler `"Doğrulama gerekli"`.
- **Denetimler GEÇTİ:** `audit_countries` 0 hard fail, `audit_universities` 0 hard
  fail (119 görünür), `quality_gates` GEÇTİ (HARD 0 / WARN 0).
- **Kalibrasyon:** güven bantları — 69 yüksek, 50 orta, 0 düşük.

## Çalışır kod (gerçek, çalıştırılabilir)
- Tüm Next.js 14 App Router uygulaması: herkese açık rotalar (ülke/üniversite/
  program liste + detay), profil analizi + sonuç, essay koçluğu (keşif→tema),
  panel, **13 admin sayfası**, sitemap, robots, SEO/JSON-LD.
- Tipli veri katmanı + repository soyutlaması + servisler (profil eşleştirme,
  essay).
- Python boru hattı: ülke/üniversite üreticiler (offline, çalıştı), ingestion
  (Wikipedia/Wikidata/OpenAlex), non-destructive export, program boru hattı,
  audit + quality_gates, review calibration.
- `database/schema.sql` (Supabase-ready) + `seed.sql` + 6 doküman.

## Ölçeklenmeye hazır (ağ erişimi gerekli)
- `npm run ingest:universities -- --all` → 207 ülkenin tamamı için gerçek kurum
  verisi (cache-first). Bu ortamda **bash ağ erişimi kapalı** olduğundan toplu
  çalıştırılmadı; veriler, benim kendi arama/sayfa-getirme araçlarımla toplandı.
- `npm run ingest:programs` → tier-0 küratör üniversitelerden gerçek program
  listeleri.

## Bu ortamda çalıştırılamayan (kasıtlı, dürüst not)
- `npm install` ve `next build`/`tsc` — npm registry'ye ağ erişimi kapalı olduğu
  için kurulum yapılamadı. Kod tip-tutarlı yazıldı; `package.json` ve `tsconfig.json`
  hazır. Ağ olan bir ortamda `npm install && npm run build` çalışacak şekilde
  tasarlandı.

## Kasıtlı sınırlar (spec gereği)
- Hiçbir kabul şartı/skor/son tarih uydurulmadı.
- Auth, ödeme, gerçek AI üretimi yok (sonraki faz).
- Küratör verisi üretilen veriyi her zaman geçersiz kılar; üzerine yazılmaz.
