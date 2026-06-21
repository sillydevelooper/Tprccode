-- TestPrep Admissions — seed
-- Production seeding is done by importing the generated JSON masters
-- (data/countries.master.json, data/universities.master.json, curated programs)
-- through an importer that respects is_curated immutability. Below are a few
-- REAL example rows to validate the schema after migration.

insert into countries (code, name_tr, name_en, slug, region,
  popular_admission_systems, common_application_platforms,
  source_url, source_title, source_type, source_status, confidence_score,
  needs_human_review, review_status, is_curated)
values
 ('NL','Hollanda','Netherlands','netherlands','Avrupa',
   array['Doğrulama gerekli'], array['Studielink'],
   'https://www.iso.org/obp/ui/#search','ISO 3166-1 ülke kodları','reference_standard','verified',0.6,true,'needs_review',false),
 ('TR','Türkiye','Turkey','turkey','Avrupa',
   array['YKS (yurt içi)','uluslararası öğrenci sınavı/başvurusu'],
   array['YÖK / ÖSYM (yurt içi)','üniversiteye özel uluslararası başvuru'],
   'https://www.iso.org/obp/ui/#search','ISO 3166-1 ülke kodları','reference_standard','verified',0.6,true,'needs_review',false)
on conflict (code) do nothing;

insert into universities (id, name, slug, country_code, city, type, website_url,
  institution_category, directory_priority, public_visibility, admissions_data_priority,
  classification_reason, classification_confidence,
  source_url, source_title, source_type, source_status, confidence_score,
  needs_human_review, review_status, is_curated)
values
 ('u-tr-bogazici-university','Boğaziçi University','bogazici-university','TR','İstanbul','public university',
   'https://www.boun.edu.tr','curated_university',0,'visible',0,'Küratör onaylı öncelikli kurum',0.95,
   'https://www.boun.edu.tr','Resmî üniversite sitesi','official_website','verified',0.95,true,'needs_review',true)
on conflict (id) do nothing;
