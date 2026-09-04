import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClientReference, updateClientReference, deleteClientReference, getAllClientReferences, uploadImage, type ClientReferenceRow } from "@/lib/content";
import { Award, Check, ImagePlus, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type ReferenceForm = {
  id?: number; companyName: string; logo: string; workSummary: string; workSummaryEn: string; website: string;
  showCompanyName: boolean; showWorkSummary: boolean;
  status: "draft" | "published"; sortOrder: number;
};

const emptyForm: ReferenceForm = {
  companyName: "", logo: "", workSummary: "", workSummaryEn: "", website: "", showCompanyName: true, showWorkSummary: true, status: "draft", sortOrder: 0,
};

function LogoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Lütfen bir görsel dosyası seçin.");
    if (file.size > 8 * 1024 * 1024) return setError("Logo 8 MB’dan küçük olmalı.");
    setError("");
    setIsPending(true);
    try {
      const url = await uploadImage("references", file);
      onChange(url);
    } catch (uploadError) {
      const reason = uploadError instanceof Error ? uploadError.message : "Bilinmeyen hata";
      setError(`Logo yüklenemedi: ${reason}. Lütfen tekrar deneyin.`);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="admin-upload-field admin-project-form__full">
      <span>Firma logosu (opsiyonel)</span>
      <label className={`admin-upload-dropzone${dragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void chooseFile(event.dataTransfer.files?.[0]); }}>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml" onChange={(event) => void chooseFile(event.target.files?.[0])} />
        <span className="admin-upload-dropzone__icon">{isPending ? <span className="admin-spinner" /> : <ImagePlus size={20} />}</span>
        <strong>{isPending ? "Yükleniyor…" : dragging ? "Bırakın" : value ? "Logoyu değiştir" : "Logo seçin veya sürükleyin"}</strong>
        <small>Orijinal oranıyla, kırpılmadan yüklenir · maksimum 8 MB</small>
      </label>
      {value && <img className="admin-upload-preview" style={{ maxWidth: 220, maxHeight: 110, objectFit: "contain", background: "#f6f1e6", padding: 12 }} src={value} alt="Logo önizleme" />}
      {error && <small className="admin-form-error" role="alert">{error}</small>}
    </div>
  );
}

function ReferenceFormPanel({ value, onChange, onCancel, onSaved }: { value: ReferenceForm; onChange: (value: ReferenceForm) => void; onCancel: () => void; onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const set = <K extends keyof ReferenceForm>(key: K, next: ReferenceForm[K]) => onChange({ ...value, [key]: next });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id, ...payload } = value;
    setIsSaving(true);
    setSaveError(false);
    try {
      if (id !== undefined) await updateClientReference(id, payload);
      else await createClientReference(payload);
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
        <div><p className="eyebrow">{value.id ? "Referansı düzenle" : "Yeni referans"}</p><h2>{value.id ? value.companyName : "Yeni firma referansı"}</h2></div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button>
      </div>
      <div className="admin-project-form__grid">
        <label>Firma adı<Input value={value.companyName} onChange={(event) => set("companyName", event.target.value)} placeholder="Örn. Setur Marinaları" /></label>
        <label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
        <label className="admin-project-form__full admin-checkbox-field">
          <input type="checkbox" checked={value.showCompanyName} onChange={(event) => set("showCompanyName", event.target.checked)} />
          Firma adını sitede logonun altında da göster (kapalıysa yalnızca SEO/görsel alt metni için kullanılır — logo bazen firma adını zaten içerdiğinden tekrar yazmaya gerek olmayabilir)
        </label>
        <LogoField value={value.logo} onChange={(url) => set("logo", url)} />
        <label className="admin-project-form__full">Yapılan iş / kapsam (opsiyonel)<Textarea value={value.workSummary} onChange={(event) => set("workSummary", event.target.value)} rows={3} placeholder="Örn. Filo genelinde marin elektrik bakımı ve lityum sistemi entegrasyonu" /></label>
        <label className="admin-project-form__full admin-checkbox-field">
          <input type="checkbox" checked={value.showWorkSummary} onChange={(event) => set("showWorkSummary", event.target.checked)} />
          Bu açıklamayı sitede göster (kapalıysa yalnızca panelde kayıtlı kalır)
        </label>
        <label className="admin-project-form__full">Firma web sitesi (opsiyonel)<Input type="url" value={value.website} onChange={(event) => set("website", event.target.value)} placeholder="https://" /></label>

        <div className="admin-project-form__full admin-en-section">
          <p className="admin-field-label admin-en-section__title">🇬🇧 İngilizce içerik (opsiyonel — boş bırakılırsa /en sayfasında Türkçe metin görünür)</p>
        </div>
        <label className="admin-project-form__full">Yapılan iş / kapsam (EN)<Textarea value={value.workSummaryEn} onChange={(event) => set("workSummaryEn", event.target.value)} rows={3} /></label>

        <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as ReferenceForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
      </div>
      {saveError && <p className="admin-form-error" role="alert">Referans kaydedilemedi. Alanları kontrol edip tekrar deneyin.</p>}
      <div className="admin-project-form__actions">
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Referansı kaydet"}</Button>
      </div>
    </form>
  );
}

export default function AdminReferences() {
  const [list, setList] = useState<ClientReferenceRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllClientReferences().then((data) => { setList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<ReferenceForm | null>(null);
  const editReference = (reference: ClientReferenceRow) => setForm({
    id: reference.id, companyName: reference.companyName, logo: reference.logo ?? "", workSummary: reference.workSummary,
    workSummaryEn: reference.workSummaryEn, website: reference.website, showCompanyName: reference.showCompanyName, showWorkSummary: reference.showWorkSummary,
    status: reference.status, sortOrder: reference.sortOrder,
  });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu referansı kaldırmak istediğinize emin misiniz?")) deleteClientReference(id).then(refresh); };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Referanslarımız</h1><p>Çalıştığınız firmaları ve onlar için yaptığınız işleri yönetin. Sadece yazılı izniniz olan firmaları yayınlayın.</p></div>
          <Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni referans</Button>
        </header>
        {form && <ReferenceFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}
        <section className="admin-project-list" aria-label="Referans listesi">
          <div className="admin-project-list__header"><h2>Tüm referanslar</h2><span>{list?.length ?? 0} kayıt</span></div>
          {list === null && !listError ? <p className="admin-empty">Referanslar yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">Referans listesi yüklenemedi.</p> : list?.length ? list.map((reference) => (
            <article className="admin-project-row" key={reference.id}>
              <div className="admin-knowledge-row__icon">{reference.logo ? <img src={reference.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <Award size={28} />}</div>
              <div className="admin-project-row__copy">
                <div className="admin-project-row__meta">
                  <strong className={`admin-status admin-status--${reference.status}`}>{reference.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>
                </div>
                <h3>{reference.companyName}</h3>
                <p>{reference.workSummary}</p>
                <small>sıra {reference.sortOrder}</small>
              </div>
              <div className="admin-project-row__actions">
                <Button variant="outline" size="sm" onClick={() => editReference(reference)}><Pencil size={15} /> Düzenle</Button>
                <Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(reference.id)}><Trash2 size={15} /> Sil</Button>
              </div>
            </article>
          )) : <div className="admin-empty"><p>Henüz referans yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk referansı ekle</Button></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
