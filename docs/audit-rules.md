# Denetim Kuralları (Audit Rules)

## audit_countries.py / audit_universities.py / audit_programs.py
Bütünlük denetimi: zorunlu alanlar, tekrarlı slug/kod, görünür-ama-geçersiz kategori,
review bayrağı tutarlılığı. **HARD FAIL → exit 1** (CI'ı durdurur).

## quality_gates.py (tek CI girişi)
- **Structural hard fails:** boş zorunlu alan; duplikasyon; görünür kayıt eğitim
  kurumu değil.
- **Publishing hard fails:** `approved/verified` olduğu hâlde kabul/gereklilik hâlâ
  `"Doğrulama gerekli"` (yani "bitti" diyor ama bitmemiş).
- **Warning gates:** `field='other'`, düşük güven, eskimiş `next_review`.

Çıkış kodu 0 değilse yayın engellenir.
