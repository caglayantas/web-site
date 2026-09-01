import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRegion, updateRegion, deleteRegion, getAllRegions, type RegionRow, type MarinaPoint } from "@/lib/content";
import { Check, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type RegionForm = {
  id?: number; regionKey: string; name: string; nameEn: string; intro: string; introEn: string;
  marinas: MarinaPoint[]; status: "draft" | "published"; sortOrder: number;
};

const emptyForm: RegionForm = {
  regionKey: "", name: "", nameEn: "", intro: "", introEn: "", marinas: [], status: "draft", sortOrder: 0,
};

const slugify = (value: string) =>
  value.toLowerCase().trim()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function MarinaListEditor({ marinas, onChange }: { marinas: MarinaPoint[]; onChange: (marinas: MarinaPoint[]) => void }) {
  const update = (index: number, changes: Partial<MarinaPoint>) => {
    onChange(marinas.map((m, i) => (i === index ? { ...m, ...changes } : m)));
  };
  const remove = (index: number) => onChange(marinas.filter((_, i) => i !== index));
  const add = () => onChange([...marinas, { name: "" }]);

  return (
    <div className="admin-marina-editor">
      {marinas.map((marina, index) => (
        <div className="admin-marina-editor__row" key={index}>
          <Input
            value={marina.name}
            onChange={(event) => update(index, { name: event.target.value })}
            placeholder="Marina adı"
          />
          <Input
            value={marina.lat ?? ""}
            onChange={(event) => update(index, { lat: event.target.value === "" ? undefined : Number(event.target.value) })}
            placeholder="Enlem (opsiyonel)"
            type="number"
            step="any"
          />
          <Input
            value={marina.lng ?? ""}
            onChange={(event) => update(index, { lng: event.target.value === "" ? undefined : Number(event.target.value) })}
            placeholder="Boylam (opsiyonel)"
            type="number"
            step="any"
          />
          <button type="button" className="admin-icon-button" onClick={() => remove(index)} aria-label="Marinayı kaldır"><X size={16} /></button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}><Plus size={15} /> Marina ekle</Button>
      <p className="admin-form-hint">
        Enlem/boylam girersen bu marina haritada pin olarak görünür (opsiyonel). Google Haritalar'da marinaya sağ tıklayıp koordinatları kopyalayabilirsin.
      </p>
    </div>
  );
}

function RegionFormPanel({ value, onChange, onCancel, onSaved }: { value: RegionForm; onChange: (value: RegionForm) => void; onCancel: () => void; onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const set = <K extends keyof RegionForm>(key: K, next: RegionForm[K]) => onChange({ ...value, [key]: next });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id, ...payload } = value;
    const cleanedMarinas = payload.marinas.filter((m) => m.name.trim() !== "");
    setIsSaving(true);
    setSaveError(false);
    try {
      if (id !== undefined) await updateRegion(id, { ...payload, marinas: cleanedMarinas });
      else await createRegion({ ...payload, marinas: cleanedMarinas });
      onSaved();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="admin-project-form" onSubmit={submit}>
      <div className="admin-project-form__header">
        <div><p className="eyebrow">{value.id ? "Bölgeyi düzenle" : "Yeni bölge"}</p><h2>{value.id ? value.name : "Yeni hizmet bölgesi"}</h2></div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button>
      </div>
      <div className="admin-project-form__grid">
        <label>URL anahtarı<Input required value={value.regionKey} onChange={(event) => set("regionKey", slugify(event.target.value))} placeholder="izmir" /></label>
        <label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
        <label className="admin-project-form__full">Bölge adı<Input required value={value.name} onChange={(event) => set("name", event.target.value)} placeholder="İzmir" /></label>
        <label className="admin-project-form__full">Açıklama<Textarea required value={value.intro} onChange={(event) => set("intro", event.target.value)} rows={3} /></label>
        <label className="admin-project-form__full">Marinalar<MarinaListEditor marinas={value.marinas} onChange={(marinas) => set("marinas", marinas)} /></label>

        <div className="admin-project-form__full admin-en-section">
          <p className="admin-field-label admin-en-section__title">🇬🇧 İngilizce içerik (opsiyonel — boş bırakılırsa /en sayfasında Türkçe metin görünür)</p>
        </div>
        <label className="admin-project-form__full">Bölge adı (EN)<Input value={value.nameEn} onChange={(event) => set("nameEn", event.target.value)} /></label>
        <label className="admin-project-form__full">Açıklama (EN)<Textarea value={value.introEn} onChange={(event) => set("introEn", event.target.value)} rows={3} /></label>

        <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as RegionForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
      </div>
      {saveError && <p className="admin-form-error" role="alert">Bölge kaydedilemedi. Alanları kontrol edip tekrar deneyin.</p>}
      <div className="admin-project-form__actions">
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Bölgeyi kaydet"}</Button>
      </div>
    </form>
  );
}

export default function AdminRegions() {
  const [list, setList] = useState<RegionRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllRegions().then((data) => { setList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<RegionForm | null>(null);
  const editRegion = (region: RegionRow) => setForm({
    id: region.id, regionKey: region.regionKey, name: region.name, nameEn: region.nameEn,
    intro: region.intro, introEn: region.introEn, marinas: region.marinas, status: region.status, sortOrder: region.sortOrder,
  });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu bölgeyi kaldırmak istediğinize emin misiniz?")) deleteRegion(id).then(refresh); };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Hizmet Bölgelerimiz</h1><p>Bölgeleri, açıklamaları ve marina listelerini yönetin. Haritada pin görünmesi için marinaya opsiyonel koordinat ekleyebilirsiniz.</p></div>
          <Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni bölge</Button>
        </header>
        {form && <RegionFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}
        <section className="admin-project-list" aria-label="Bölge listesi">
          <div className="admin-project-list__header"><h2>Tüm bölgeler</h2><span>{list?.length ?? 0} kayıt</span></div>
          {list === null && !listError ? <p className="admin-empty">Bölgeler yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">Bölge listesi yüklenemedi.</p> : list?.length ? list.map((region) => (
            <article className="admin-project-row" key={region.id}>
              <div className="admin-knowledge-row__icon"><MapPin size={28} /></div>
              <div className="admin-project-row__copy">
                <div className="admin-project-row__meta">
                  <strong className={`admin-status admin-status--${region.status}`}>{region.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>
                </div>
                <h3>{region.name}</h3>
                <p>{region.marinas.length} marina{region.marinas.filter((m) => m.lat !== undefined).length > 0 ? ` · ${region.marinas.filter((m) => m.lat !== undefined).length} haritada pinli` : ""}</p>
                <small>sıra {region.sortOrder}</small>
              </div>
              <div className="admin-project-row__actions">
                <Button variant="outline" size="sm" onClick={() => editRegion(region)}><Pencil size={15} /> Düzenle</Button>
                <Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(region.id)}><Trash2 size={15} /> Sil</Button>
              </div>
            </article>
          )) : <div className="admin-empty"><p>Henüz bölge yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk bölgeyi ekle</Button></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
