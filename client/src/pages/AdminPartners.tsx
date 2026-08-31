import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createPartner, updatePartner, deletePartner, getAllPartners, uploadImage, type PartnerRow } from "@/lib/content";
import { Check, Crop, Handshake, ImagePlus, Pencil, Plus, Save, Trash2, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PartnerForm = {
  id?: number; name: string; logo: string; relationship: string; description: string; website: string;
  status: "draft" | "published"; sortOrder: number;
};

const emptyForm: PartnerForm = {
  name: "", logo: "", relationship: "", description: "", website: "", status: "draft", sortOrder: 0,
};

async function cropToWebp(bitmap: ImageBitmap, focalX: number, focalY: number, zoom: number, fileName: string) {
  const outputWidth = 1600;
  const outputHeight = 900;
  const aspect = outputWidth / outputHeight;
  const imageAspect = bitmap.width / bitmap.height;
  const baseHeight = imageAspect > aspect ? bitmap.height : bitmap.width / aspect;
  const baseWidth = baseHeight * aspect;
  const cropWidth = baseWidth / zoom;
  const cropHeight = cropWidth / aspect;
  const sx = Math.max(0, Math.min(bitmap.width - cropWidth, (bitmap.width - cropWidth) * focalX));
  const sy = Math.max(0, Math.min(bitmap.height - cropHeight, (bitmap.height - cropHeight) * focalY));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas kullanılamıyor");
  context.drawImage(bitmap, sx, sy, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.9));
  if (!blob) throw new Error("WebP dönüşümü başarısız");
  return new File([blob], `${fileName.replace(/\.[^.]+$/, "") || "logo"}.webp`, { type: "image/webp" });
}

function LogoField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState(value);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [focalX, setFocalX] = useState(.5);
  const [focalY, setFocalY] = useState(.5);
  const [zoom, setZoom] = useState(1);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  useEffect(() => { setPreview(value); }, [value]);
  useEffect(() => () => { bitmapRef.current?.close(); }, []);
  useEffect(() => () => { if (sourcePreview) URL.revokeObjectURL(sourcePreview); }, [sourcePreview]);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Lütfen bir görsel dosyası seçin.");
    if (file.size > 8 * 1024 * 1024) return setError("Logo 8 MB’dan küçük olmalı.");
    setError("");
    setIsPending(true);
    try {
      const bitmap = await createImageBitmap(file).catch(() => {
        throw new Error("Bu dosya bir görsel olarak açılamadı. Dosya bozuk olabilir veya bu formatı telefonunuzun tarayıcısı desteklemiyor olabilir.");
      });
      if (bitmap.width * bitmap.height > 40_000_000) {
        bitmap.close();
        return setError(`Bu görsel çok yüksek çözünürlüklü (${bitmap.width}×${bitmap.height}). Lütfen görseli küçültüp tekrar deneyin.`);
      }
      bitmapRef.current?.close();
      bitmapRef.current = bitmap;
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      setSourceFile(file);
      setSourcePreview(URL.createObjectURL(file));
      setFocalX(.5); setFocalY(.5); setZoom(1);
    } catch (probeError) {
      setError(probeError instanceof Error ? probeError.message : "Görsel açılamadı.");
    } finally {
      setIsPending(false);
    }
  };

  const applyCrop = async () => {
    if (!sourceFile || !bitmapRef.current) return;
    setError("");
    setIsPending(true);
    try {
      const webpFile = await cropToWebp(bitmapRef.current, focalX, focalY, zoom, sourceFile.name);
      const url = await uploadImage("partners", webpFile);
      onChange(url);
      setPreview(url);
      bitmapRef.current?.close();
      bitmapRef.current = null;
      setSourceFile(null);
      if (sourcePreview) URL.revokeObjectURL(sourcePreview);
      setSourcePreview("");
    } catch (uploadError) {
      const reason = uploadError instanceof Error ? uploadError.message : "Bilinmeyen hata";
      setError(`Görsel yüklenemedi: ${reason}. Lütfen tekrar deneyin.`);
    } finally {
      setIsPending(false);
    }
  };

  const cancelCrop = () => {
    bitmapRef.current?.close();
    bitmapRef.current = null;
    setSourceFile(null);
    if (sourcePreview) URL.revokeObjectURL(sourcePreview);
    setSourcePreview("");
  };

  return (
    <div className="admin-upload-field admin-project-form__full">
      <span>Marka logosu</span>
      <label className={`admin-upload-dropzone admin-upload-dropzone--cover${dragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void chooseFile(event.dataTransfer.files?.[0]); }}>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void chooseFile(event.target.files?.[0])} />
        <span className="admin-upload-dropzone__icon">{isPending ? <span className="admin-spinner" /> : <ImagePlus size={20} />}</span>
        <strong>{isPending ? "WebP hazırlanıyor ve yükleniyor…" : dragging ? "Bırakın" : value ? "Logoyu değiştir" : "Logo seçin veya sürükleyin"}</strong>
        <small>16:9 oranında kırpılıp yüklenir · maksimum 8 MB</small>
      </label>
      {preview && <img className="admin-upload-preview admin-upload-preview--cover" style={{ maxWidth: 160 }} src={preview} alt="Logo önizleme" />}
      {error && <small className="admin-form-error" role="alert">{error}</small>}
      {sourceFile && sourcePreview && (
        <div className="admin-cover-crop" role="dialog" aria-modal="true" aria-label="Logoyu kırp">
          <div className="admin-cover-crop__header">
            <div><strong>Logoyu kırp</strong><small>16:9 oranında kullanılacak alanı seçin.</small></div>
            <button type="button" className="admin-icon-button" onClick={cancelCrop} aria-label="Kırpmayı iptal et"><X size={17} /></button>
          </div>
          <div className="admin-cover-crop__stage">
            <img src={sourcePreview} alt="Kırpılacak görsel" onError={() => setError("Görsel önizlemesi yüklenemedi. Lütfen farklı bir dosya deneyin.")} style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%`, transform: `scale(${zoom})` }} />
          </div>
          <div className="admin-cover-crop__controls">
            <label><span><Crop size={15} /> Yatay odak</span><input type="range" min="0" max="1" step="0.01" value={focalX} onChange={(event) => setFocalX(Number(event.target.value))} aria-label="Yatay odak" /></label>
            <label><span><Crop size={15} /> Dikey odak</span><input type="range" min="0" max="1" step="0.01" value={focalY} onChange={(event) => setFocalY(Number(event.target.value))} aria-label="Dikey odak" /></label>
            <label><span><ZoomIn size={15} /> Yakınlaştırma</span><input type="range" min="1" max="2" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} aria-label="Yakınlaştırma" /></label>
          </div>
          <div className="admin-cover-crop__actions">
            <Button type="button" variant="outline" onClick={cancelCrop}>İptal</Button>
            <Button type="button" onClick={() => void applyCrop()} disabled={isPending}>{isPending ? "Yükleniyor…" : "Kırp ve WebP yükle"}</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PartnerFormPanel({ value, onChange, onCancel, onSaved }: { value: PartnerForm; onChange: (value: PartnerForm) => void; onCancel: () => void; onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const set = <K extends keyof PartnerForm>(key: K, next: PartnerForm[K]) => onChange({ ...value, [key]: next });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id, ...payload } = value;
    setIsSaving(true);
    setSaveError(false);
    try {
      if (id !== undefined) await updatePartner(id, payload);
      else await createPartner(payload);
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
        <div><p className="eyebrow">{value.id ? "Markayı düzenle" : "Yeni marka"}</p><h2>{value.id ? value.name : "Yeni ekle"}</h2></div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button>
      </div>
      <div className="admin-project-form__grid">
        <label>Marka adı<Input required value={value.name} onChange={(event) => set("name", event.target.value)} placeholder="Tikal Marine" /></label>
        <label>İlişki türü<Input required value={value.relationship} onChange={(event) => set("relationship", event.target.value)} placeholder="Ege Bölgesi Bayisi" /></label>
        <LogoField value={value.logo} onChange={(url) => set("logo", url)} />
        <label className="admin-project-form__full">Açıklama (opsiyonel)<Textarea value={value.description} onChange={(event) => set("description", event.target.value)} rows={3} placeholder="Kısa bir tanıtım cümlesi (opsiyonel)" /></label>
        <label className="admin-project-form__full">Marka web sitesi (opsiyonel)<Input type="url" value={value.website} onChange={(event) => set("website", event.target.value)} placeholder="https://" /></label>
        <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as PartnerForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
        <label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
      </div>
      {saveError && <p className="admin-form-error" role="alert">İçerik kaydedilemedi. Gerekli alanları kontrol edip tekrar deneyin.</p>}
      <div className="admin-project-form__actions">
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Kaydet"}</Button>
      </div>
    </form>
  );
}

export default function AdminPartners() {
  const [list, setList] = useState<PartnerRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllPartners().then((data) => { setList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<PartnerForm | null>(null);
  const editPartner = (partner: PartnerRow) => setForm({
    id: partner.id, name: partner.name, logo: partner.logo ?? "", relationship: partner.relationship,
    description: partner.description, website: partner.website, status: partner.status, sortOrder: partner.sortOrder,
  });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu markayı kaldırmak istediğinize emin misiniz?")) deletePartner(id).then(refresh); };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Markalarımız</h1><p>Bayilik ve iş ortaklıklarınızı, kullanım izni aldığınız marka logolarını kod değiştirmeden yönetin.</p></div>
          <Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni ekle</Button>
        </header>
        {form && <PartnerFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}
        <section className="admin-project-list" aria-label="Marka listesi">
          <div className="admin-project-list__header"><h2>Tüm markalar</h2><span>{list?.length ?? 0} kayıt</span></div>
          {list === null && !listError ? <p className="admin-empty">Yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">Liste yüklenemedi. Yönetici yetkinizi kontrol edin.</p> : list?.length ? list.map((partner) => (
            <article className="admin-project-row" key={partner.id}>
              {partner.logo ? <img className="admin-knowledge-cover" style={{ objectFit: "contain", background: "#fff" }} src={partner.logo} alt="" /> : <div className="admin-knowledge-row__icon"><Handshake size={28} /></div>}
              <div className="admin-project-row__copy">
                <div className="admin-project-row__meta">
                  <strong className={`admin-status admin-status--${partner.status}`}>{partner.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>
                </div>
                <h3>{partner.name}</h3>
                <p>{partner.relationship}</p>
                <small>sıra {partner.sortOrder}</small>
              </div>
              <div className="admin-project-row__actions">
                <Button variant="outline" size="sm" onClick={() => editPartner(partner)}><Pencil size={15} /> Düzenle</Button>
                <Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(partner.id)}><Trash2 size={15} /> Sil</Button>
              </div>
            </article>
          )) : <div className="admin-empty"><p>Henüz marka eklenmedi.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlkini ekle</Button></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
