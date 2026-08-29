import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createService, updateService, deleteService, getAllServices, uploadImage, type ServiceRow } from "@/lib/content";
import { ICON_OPTIONS } from "@/components/ServiceGrid";
import { slugify } from "@/lib/markdown";
import { Check, Crop, ImagePlus, Pencil, Plus, Save, Trash2, Wrench, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ServiceForm = {
  id?: number; slug: string; title: string; icon: string; image: string; description: string;
  subtopics: string; eyebrow: string; intro: string; operations: string; note: string; cta: string;
  status: "draft" | "published"; sortOrder: number;
};

const emptyForm: ServiceForm = {
  slug: "", title: "", icon: "Wrench", image: "", description: "",
  subtopics: "", eyebrow: "", intro: "", operations: "", note: "",
  cta: "Bu hizmeti konuşun", status: "draft", sortOrder: 0,
};

const linesToList = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
const listToLines = (value: string[]) => value.join("\n");

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
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error("WebP dönüşümü başarısız");
  return new File([blob], `${fileName.replace(/\.[^.]+$/, "") || "kapak"}.webp`, { type: "image/webp" });
}

function CoverImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
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
  useEffect(() => () => { if (sourcePreview) URL.revokeObjectURL(sourcePreview); bitmapRef.current?.close(); }, [sourcePreview]);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Lütfen bir görsel dosyası seçin.");
    if (file.size > 8 * 1024 * 1024) return setError("Kapak görseli 8 MB’dan küçük olmalı.");
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
      const url = await uploadImage("services", webpFile);
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
      <span>Kart görseli</span>
      <label className={`admin-upload-dropzone admin-upload-dropzone--cover${dragging ? " is-dragging" : ""}`}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void chooseFile(event.dataTransfer.files?.[0]); }}>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void chooseFile(event.target.files?.[0])} />
        <span className="admin-upload-dropzone__icon">{isPending ? <span className="admin-spinner" /> : <ImagePlus size={20} />}</span>
        <strong>{isPending ? "WebP hazırlanıyor ve yükleniyor…" : dragging ? "Bırakın" : value ? "Görseli değiştir" : "Görsel seçin veya sürükleyin"}</strong>
        <small>Önce kırpılır, ardından 1600×900 WebP olarak yüklenir · maksimum 8 MB</small>
      </label>
      {preview && <img className="admin-upload-preview admin-upload-preview--cover" src={preview} alt="Kart görseli önizleme" />}
      {error && <small className="admin-form-error" role="alert">{error}</small>}
      {sourceFile && sourcePreview && (
        <div className="admin-cover-crop" role="dialog" aria-modal="true" aria-label="Kart görselini kırp">
          <div className="admin-cover-crop__header">
            <div><strong>Kart görselini kırp</strong><small>16:9 oranında kullanılacak alanı seçin.</small></div>
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

function ServiceFormPanel({ value, onChange, onCancel, onSaved }: { value: ServiceForm; onChange: (value: ServiceForm) => void; onCancel: () => void; onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const set = <K extends keyof ServiceForm>(key: K, next: ServiceForm[K]) => onChange({ ...value, [key]: next });
  const updateTitle = (title: string) => onChange({ ...value, title, slug: value.id ? value.slug : slugify(title) });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id, subtopics, operations, ...rest } = value;
    const payload = { ...rest, subtopics: linesToList(subtopics), operations: linesToList(operations) };
    setIsSaving(true);
    setSaveError(false);
    try {
      if (id !== undefined) await updateService(id, payload);
      else await createService(payload);
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
        <div><p className="eyebrow">{value.id ? "Hizmeti düzenle" : "Yeni hizmet"}</p><h2>{value.id ? value.title : "Yeni hizmet ekle"}</h2></div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button>
      </div>
      <div className="admin-project-form__grid">
        <label>URL anahtarı<Input required value={value.slug} onChange={(event) => set("slug", slugify(event.target.value))} placeholder="marin-elektrik" /></label>
        <label>İkon<select value={value.icon} onChange={(event) => set("icon", event.target.value)}>{Object.keys(ICON_OPTIONS).map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
        <label className="admin-project-form__full">Başlık (kart üstünde)<Input required value={value.title} onChange={(event) => updateTitle(event.target.value)} /></label>
        <CoverImageField value={value.image} onChange={(url) => set("image", url)} />
        <label className="admin-project-form__full">Kart açıklaması (kısa)<Textarea required value={value.description} onChange={(event) => set("description", event.target.value)} rows={3} /></label>
        <label className="admin-project-form__full">Kart alt başlıkları (her satıra bir tane)<Textarea value={value.subtopics} onChange={(event) => set("subtopics", event.target.value)} rows={4} placeholder={"Akü ve şarj sistemleri\nLityum akü ve BMS sistemleri"} /></label>
        <div className="admin-project-form__full" style={{ borderTop: "1px solid #e4ded4", paddingTop: 16, marginTop: 4 }}>
          <p className="admin-field-label" style={{ marginBottom: 12 }}>Açılır pencere (popup) içeriği</p>
        </div>
        <label>Popup üst etiketi (eyebrow)<Input required value={value.eyebrow} onChange={(event) => set("eyebrow", event.target.value)} placeholder="Marin elektrik bakım operasyonları" /></label>
        <label>Buton metni<Input required value={value.cta} onChange={(event) => set("cta", event.target.value)} placeholder="Elektrik bakım talebi oluştur" /></label>
        <label className="admin-project-form__full">Popup giriş metni<Textarea required value={value.intro} onChange={(event) => set("intro", event.target.value)} rows={3} /></label>
        <label className="admin-project-form__full">Bakım kapsamı listesi (her satıra bir tane)<Textarea value={value.operations} onChange={(event) => set("operations", event.target.value)} rows={6} placeholder={"Akü, şarj cihazı ve alternatör performans kontrolü\nLityum akü, BMS ve koruma devrelerinin durum değerlendirmesi"} /></label>
        <label className="admin-project-form__full">"Perla Marine yaklaşımı" notu<Textarea required value={value.note} onChange={(event) => set("note", event.target.value)} rows={3} /></label>
        <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as ServiceForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
        <label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
      </div>
      {saveError && <p className="admin-form-error" role="alert">İçerik kaydedilemedi. Gerekli alanları kontrol edip tekrar deneyin.</p>}
      <div className="admin-project-form__actions">
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Hizmeti kaydet"}</Button>
      </div>
    </form>
  );
}

export default function AdminServices() {
  const [list, setList] = useState<ServiceRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllServices().then((data) => { setList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<ServiceForm | null>(null);
  const editService = (service: ServiceRow) => setForm({
    id: service.id, slug: service.slug, title: service.title, icon: service.icon, image: service.image ?? "",
    description: service.description, subtopics: listToLines(service.subtopics), eyebrow: service.eyebrow,
    intro: service.intro, operations: listToLines(service.operations), note: service.note, cta: service.cta,
    status: service.status, sortOrder: service.sortOrder,
  });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu hizmeti kaldırmak istediğinize emin misiniz?")) deleteService(id).then(refresh); };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Hizmetlerimiz</h1><p>Hizmet kartlarını, görsellerini ve açılır pencere içeriklerini kod değiştirmeden yönetin.</p></div>
          <Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni hizmet</Button>
        </header>
        {form && <ServiceFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}
        <section className="admin-project-list" aria-label="Hizmet listesi">
          <div className="admin-project-list__header"><h2>Tüm hizmetler</h2><span>{list?.length ?? 0} kayıt</span></div>
          {list === null && !listError ? <p className="admin-empty">Hizmetler yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">Hizmet listesi yüklenemedi. Yönetici yetkinizi kontrol edin.</p> : list?.length ? list.map((service) => (
            <article className="admin-project-row" key={service.id}>
              {service.image ? <img className="admin-knowledge-cover" src={service.image} alt="" /> : <div className="admin-knowledge-row__icon"><Wrench size={28} /></div>}
              <div className="admin-project-row__copy">
                <div className="admin-project-row__meta">
                  <strong className={`admin-status admin-status--${service.status}`}>{service.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <small>/{service.slug} · sıra {service.sortOrder}</small>
              </div>
              <div className="admin-project-row__actions">
                <Button variant="outline" size="sm" onClick={() => editService(service)}><Pencil size={15} /> Düzenle</Button>
                <Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(service.id)}><Trash2 size={15} /> Sil</Button>
              </div>
            </article>
          )) : <div className="admin-empty"><p>Henüz hizmet yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk hizmeti ekle</Button></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
