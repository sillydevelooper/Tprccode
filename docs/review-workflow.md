# İnceleme İş Akışı (Review Workflow)

1. Ingestion her kaydı `needs_human_review=true`, `review_status='needs_review'`
   ile yazar.
2. `/admin/veri-inceleme` kuyruğu bu kayıtları türe göre listeler.
3. `build_review_calibration.py` çabayı yönlendirir: ülke ve güven bandına göre
   bekleyen kayıt sayıları (`data/review_calibration.json`).
4. Küratör resmî kaynakla teyit eder; alanları doldurur; `_curated.ts`'e taşır veya
   DB'de `is_curated=true`, `review_status='approved'` yapar.
5. Küratör verisi üretilen veriyi **her zaman** geçersiz kılar ve importer tarafından
   **üzerine yazılamaz**.

## Yayın ilkesi
Hiçbir kayıt, kabul içeriği doğrulanmadan herkese açık sayfada "onaylı" gibi
sunulmaz. Doğrulanmamış alanlar arayüzde turuncu **"Doğrulama gerekli"** rozetiyle
gösterilir.
