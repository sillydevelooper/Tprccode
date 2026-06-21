# Supabase'e Geçiş

Şu an statik repository katmanı kullanılıyor (Supabase **bağlı değil**).

## Adımlar
1. `database/schema.sql`'i Supabase SQL editöründe çalıştır.
2. `.env`'i doldur: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Importer ile `data/*.master.json` + küratör verisini yükle. **Kural:** importer
   `is_curated=true` satırlarını asla güncellemez:
   `insert ... on conflict do update ... where target.is_curated = false`.
4. `src/lib/repositories/*` içindeki fonksiyon gövdelerini Supabase sorgularıyla
   değiştir. **UI değişmez** — yalnızca repository implementasyonu değişir.
5. RLS politikalarını ekle: herkese açık tablolarda yalnızca
   `public_visibility='visible'` ve eğitim kategorileri okunabilir olsun; öğrenci/
   CRM tabloları yalnızca ilgili kullanıcıya/role açık olsun.

## Neden bu sıra
Repository soyutlaması sayesinde veri kaynağını değiştirmek arayüzü kırmaz; küratör
immutability'si geçiş sırasında insan emeğini korur.
