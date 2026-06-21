# TestPrep Admissions

Türkçe-öncelikli, **kaynak-öncelikli** ve **denetim-öncelikli** küresel üniversite
kabul zekâsı platformu. Next.js 14 (App Router) · TypeScript · Tailwind.

> İlke: Her veri bir kaynağa dayanır. Doğrulanmamış kabul bilgisi **asla uydurulmaz**;
> teyit edilene kadar arayüzde **“Doğrulama gerekli”** olarak işaretlenir. Kabul
> garantisi verilmez.

## Ne içeriyor
- **207 ülke** (gerçek ISO 3166), **119 gerçek üniversite / 20 ülke** (kendi web
  araştırmasıyla toplandı; küratör amiral gemilerinin kaynağı resmî siteleri),
  **12 gerçek program**.
- Herkese açık: ülke/üniversite/program liste + detay sayfaları, her detayda
  **Kaynak Doğrulama Kutusu** (kaynak/inceleme/güven rozetleri).
- Öğrenci araçları: **Profil Analizi** (Reach/Match/Safety + eksik analizi),
  **Essay Koçluğu** (etik: tam metin yazılmaz; keşif→tema→yapı).
- **Admin paneli** (13 sayfa): katalog, veri inceleme kuyruğu, kaynak kayıt
  defteri, sınav/kabul/essay/deadline yönetimi, öğrenci & CRM.
- Ölçeklenebilir **Python ingestion + audit** boru hattı.
- Supabase-ready Postgres şeması + dokümanlar.

## Kurulum
```bash
npm install
npm run dev          # http://localhost:3000
```
> Not: Bu paketin oluşturulduğu ortamda npm registry'ye ağ erişimi kapalıydı; bu
> yüzden `node_modules` dahil değildir ve burada `next build` çalıştırılmadı.
> Ağ erişimi olan bir ortamda yukarıdaki komutlar çalışır.

## Veri komutları
```bash
npm run data:countries        # ISO 3166 -> countries.master.json + countries.ts
npm run data:universities     # gerçek seed -> generated TS (offline)
npm run ingest:universities -- --countries NL TR DE GB CA   # ölçekleme (ağ)
npm run export:universities   # ingested -> generated TS (non-destructive)
npm run ingest:programs       # program boru hattı (ağ)
npm run audit                 # bütünlük denetimleri
npm run gates                 # tek CI kapısı (structural + publishing)
npm run calibrate             # inceleme kalibrasyonu
```

## Mimari
```
src/
  app/                 # App Router rotaları (public + profil/essay + admin)
  components/          # Badges (güven sistemi), layout, ui, admin
  lib/
    types/             # tüm veri modelleri (SourceMeta provenance mixin)
    data/              # countries.ts, universities/{_curated,generated}, programs/...
    repositories/      # UI yalnızca bunları çağırır (Supabase ile değiştirilebilir)
    services/          # profil eşleştirme, essay koçluğu
    seo/               # metadata + JSON-LD
scripts/               # Python: üreticiler, ingestion, audit, quality gates
database/              # schema.sql (Supabase-ready) + seed.sql
docs/                  # boru hattı, ingestion, audit, review, migration
data/                  # makine-okur master JSON + ingested + calibration
```

## İlkeler
1. **Kaynak-öncelikli** — her kayıtta `source_url` + sağlık durumu.
2. **Denetim-öncelikli** — doğrulanmamış her şey inceleme kuyruğunda; “onaylı”
   gibi yayımlanmaz.
3. **Küratör üstünlüğü** — küratör verisi üretileni her zaman geçersiz kılar; asla
   üzerine yazılmaz.
4. **Dürüstlük** — kabul şartı/skor/son tarih uydurulmaz; garanti verilmez.

Ayrıntılı durum için **STATUS.md**'ye bakın.
