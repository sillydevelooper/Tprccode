// src/lib/services/essay.ts
// Ethical essay coaching. We help with discovery, theme, outline, structure,
// clarity and authenticity. We DO NOT ghostwrite full essays and make no
// admission guarantees. The final essay is always student-owned & human-reviewed.
import type { EssayWorkflow } from "@/lib/types";

export interface DiscoveryQuestion { id: string; question_tr: string; hint_tr: string; }

export const ESSAY_DISCOVERY_QUESTIONS: DiscoveryQuestion[] = [
  { id: "q1", question_tr: "Seni en çok hangi an ya da deneyim şu anki hedefine yöneltti?", hint_tr: "Somut bir olay seç; duyguyu ve dönüm noktasını anlat." },
  { id: "q2", question_tr: "Bir şeyi değiştirmek ya da çözmek için kendi inisiyatifinle ne yaptın?", hint_tr: "Sorumluluk aldığın, başlattığın bir şeyi düşün." },
  { id: "q3", question_tr: "Hangi konuda saatlerce konuşabilir ya da çalışabilirsin? Neden?", hint_tr: "Gerçek merakını gösteren bir örnek ver." },
  { id: "q4", question_tr: "Bir başarısızlık ya da zorluktan ne öğrendin?", hint_tr: "Olaydan çok, sende neyin değiştiğine odaklan." },
  { id: "q5", question_tr: "Seçtiğin alan/üniversite ile değerlerin nasıl örtüşüyor?", hint_tr: "Genel klişe yerine sana özgü bir bağ kur." },
  { id: "q6", question_tr: "Mezun olduktan sonra ne yapmak istiyorsun ve bu program neden köprü?", hint_tr: "Net ama abartısız bir yön çiz." },
];

export const ESSAY_STAGES: { key: EssayWorkflow["stage"]; label_tr: string; desc_tr: string }[] = [
  { key: "discovery", label_tr: "Keşif", desc_tr: "Sorularla ham malzemeni çıkar." },
  { key: "theme", label_tr: "Tema", desc_tr: "Tekrar eden değerleri/temaları belirle." },
  { key: "outline", label_tr: "Taslak Plan", desc_tr: "Akışı ve bölümleri kur." },
  { key: "draft", label_tr: "İlk Yazım", desc_tr: "Kendi sesinle yaz — biz yapı ve netlik öneriyoruz." },
  { key: "review", label_tr: "İnceleme", desc_tr: "Danışman geri bildirimi ve özgünlük kontrolü." },
  { key: "final", label_tr: "Son Hâl", desc_tr: "Öğrenciye ait, insan-onaylı nihai metin." },
];

export const ESSAY_ETHICS_NOTE =
  "Bu araç tam essay yazmaz ve kabul garantisi vermez. Amacımız; senin gerçek " +
  "hikâyeni keşfetmen, yapı ve netlik kazanman. Nihai metin sana aittir ve insan " +
  "tarafından gözden geçirilir.";
