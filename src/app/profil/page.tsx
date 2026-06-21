"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

const COUNTRIES = [["", "Farketmez"], ["US", "ABD"], ["GB", "Birleşik Krallık"], ["NL", "Hollanda"], ["DE", "Almanya"], ["CA", "Kanada"], ["IT", "İtalya"], ["FR", "Fransa"], ["CH", "İsviçre"], ["TR", "Türkiye"]];
const FIELDS = [["computer_science", "Bilgisayar Bilimi"], ["engineering", "Mühendislik"], ["economics", "Ekonomi"], ["business", "İşletme"], ["political_science", "Siyaset Bilimi"], ["international_relations", "Uluslararası İlişkiler"]];

export default function ProfilePage() {
  const router = useRouter();
  const [f, setF] = useState({
    ulke: "", alan: "computer_science", gpa: "", scale: "4", curriculum: "Ulusal lise",
    english: "IELTS planlanıyor", budget: "unknown", essay: "not_started", timeline: "",
    sat: "", ielts: "",
  });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  function submit() {
    const qs = new URLSearchParams({
      ulke: f.ulke, alan: f.alan, gpa: f.gpa, scale: f.scale, curriculum: f.curriculum,
      english: f.english, budget: f.budget, essay: f.essay, timeline: f.timeline,
      sat: f.sat, ielts: f.ielts,
    });
    router.push(`/profil/sonuc?${qs.toString()}`);
  }

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Ana sayfa", href: "/" }, { name: "Profil Analizi" }]} />
      <div className="mt-6">
        <PageHeader eyebrow="Araç" title="Profil Analizi"
          lead="Hedeflerini gir; Reach / Match / Safety önerileri ve eksik analizini al. Bu bir kabul değerlendirmesi değildir ve garanti vermez." />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label="Hedef ülke"><Select v={f.ulke} on={(v) => set("ulke", v)} opts={COUNTRIES} /></Field>
        <Field label="Hedef alan"><Select v={f.alan} on={(v) => set("alan", v)} opts={FIELDS} /></Field>
        <Field label="Not ortalaması (GPA)"><Input v={f.gpa} on={(v) => set("gpa", v)} placeholder="örn. 3.6 / 85" /></Field>
        <Field label="GPA ölçeği"><Select v={f.scale} on={(v) => set("scale", v)} opts={[["4", "4.0"], ["100", "100"], ["10", "10"]]} /></Field>
        <Field label="Müfredat"><Input v={f.curriculum} on={(v) => set("curriculum", v)} placeholder="IB / A-Level / Ulusal lise" /></Field>
        <Field label="İngilizce durumu"><Input v={f.english} on={(v) => set("english", v)} /></Field>
        <Field label="SAT (varsa)"><Input v={f.sat} on={(v) => set("sat", v)} placeholder="örn. 1450" /></Field>
        <Field label="IELTS/TOEFL (varsa)"><Input v={f.ielts} on={(v) => set("ielts", v)} placeholder="örn. IELTS 7.0" /></Field>
        <Field label="Bütçe bandı"><Select v={f.budget} on={(v) => set("budget", v)} opts={[["unknown", "Belirsiz"], ["low", "Düşük"], ["mid", "Orta"], ["high", "Yüksek"]]} /></Field>
        <Field label="Essay hazırlığı"><Select v={f.essay} on={(v) => set("essay", v)} opts={[["not_started", "Başlamadı"], ["draft", "Taslak"], ["reviewed", "İncelendi"], ["final", "Final"]]} /></Field>
        <Field label="Başvuru takvimi"><Input v={f.timeline} on={(v) => set("timeline", v)} placeholder="örn. 2026 Güz" /></Field>
      </div>

      <div className="mt-8">
        <button onClick={submit} className="btn-primary">Analizi oluştur</button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-sm"><span className="mb-1 block text-ink-muted">{label}</span>{children}</label>;
}
function Input({ v, on, placeholder }: { v: string; on: (v: string) => void; placeholder?: string }) {
  return <input value={v} placeholder={placeholder} onChange={(e) => on(e.target.value)}
    className="w-full rounded-card border border-line bg-white px-3 py-2 text-sm" />;
}
function Select({ v, on, opts }: { v: string; on: (v: string) => void; opts: string[][] }) {
  return <select value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-card border border-line bg-white px-3 py-2 text-sm">
    {opts.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
  </select>;
}
