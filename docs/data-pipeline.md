# Veri Mimarisi ve Boru Hattı (Data Pipeline)

TestPrep Admissions iki ilkeye dayanır: **kaynak-öncelikli** (her veri bir kaynağa
bağlıdır) ve **denetim-öncelikli** (doğrulanmamış her kayıt inceleme kuyruğundadır).

## Katmanlar
1. **Master JSON** (`data/*.master.json`) — makine-okur ana kaynak. `scripts/` üretir.
2. **Üretilen TS** (`src/lib/data/**/generated/`) — uygulamanın okuduğu tipli veri.
3. **Küratör TS** (`src/lib/data/**/_curated.ts`) — insan onaylı veri. **Her zaman**
   üretilen veriyi geçersiz kılar; build scriptleri bu dosyalara dokunmaz.
4. **Repository** (`src/lib/repositories`) — UI yalnızca bunları çağırır; ileride
   Supabase sorgularıyla değiştirilebilir.

## Altın kural
Üniversite/program **kimliği** kaynaklardan toplanır. **Kabul şartı, skor, son tarih
asla uydurulmaz**; doğrulanana kadar `"Doğrulama gerekli"`dir ve `needs_human_review=true`.

## Çalıştırma
```
npm run data:countries        # 207 ülke (ISO 3166)
npm run data:universities     # gerçek seed -> TS (offline)
npm run ingest:universities -- --countries NL TR DE GB   # ölçekleme (ağ gerekli)
npm run export:universities   # ingested batch'leri TS'e (non-destructive)
npm run ingest:programs       # program boru hattı (ağ gerekli)
npm run audit && npm run gates
```
