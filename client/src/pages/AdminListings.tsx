import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBoatListing, updateBoatListing, deleteBoatListing, getAllBoatListings, getListingsEnabled, setListingsEnabled, uploadImage, type BoatListingRow } from "@/lib/content";
import { Anchor, Check, Crop, ImagePlus, Pencil, Plus, Save, Trash2, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ListingForm = {
  id?: number; title: string; price: string; year: string; lengthMeters: string; engineInfo: string;
  location: string; description: string; coverImage: string; galleryImages: string[]; status: "draft" | "published"; sortOrder: number;
};

const emptyForm: ListingForm = {
  title: "", price: "", year: "", lengthMeters: "", engineInfo: "", location: "",
  description: "", coverImage: "", galleryImages: [], status: "draft", sortOrder: 0,
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
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error("WebP dönüşümü başarısız");
  return new File([blob], `${fileName.replace(/\.[^.]+$/, "") || "ilan"}.webp`, { type: "image/webp" });
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
  useEffect(() => () => { bitmapRef.current?.close(); }, []);
  useEffect(() => () => { if (sourcePreview) URL.revokeObjectURL(sourcePreview); }, [sourcePreview]);

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
      const url = await uploadImage("listings", webpFile);
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
      <span>Kapak görseli</span>
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
      {preview && <img className="admin-upload-preview admin-upload-preview--cover" src={preview} alt="Kapak görseli önizleme" />}
      {error && <small className="admin-form-error" role="alert">{error}</small>}
      {sourceFile && sourcePreview && (
        <div className="admin-cover-crop" role="dialog" aria-modal="true" aria-label="Kapak görselini kırp">
          <div className="admin-cover-crop__header">
            <div><strong>Kapak görselini kırp</strong><small>16:9 oranında kullanılacak alanı seçin.</small></div>
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

async function resizeToWebp(file: File, maxDimension: number): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) { bitmap.close(); throw new Error("Canvas kullanılamıyor"); }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  if (!blob) throw new Error("WebP dönüşümü başarısız");
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "foto"}.webp`, { type: "image/webp" });
}

function GalleryField({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setIsPending(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 10 * 1024 * 1024) { setError(`"${file.name}" 10 MB'dan büyük, atlandı.`); continue; }
        const webpFile = await resizeToWebp(file, 1600);
        const url = await uploadImage("listings", webpFile);
        uploaded.push(url);
      }
      onChange([...value, ...uploaded]);
    } catch (uploadError) {
      const reason = uploadError instanceof Error ? uploadError.message : "Bilinmeyen hata";
      setError(`Bazı fotoğraflar yüklenemedi: ${reason}`);
    } finally {
      setIsPending(false);
    }
  };

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="admin-upload-field admin-project-form__full">
      <span>Ek fotoğraflar</span>
      <label className="admin-upload-dropzone">
        <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple onChange={(event) => void addFiles(event.target.files)} />
        <span className="admin-upload-dropzone__icon">{isPending ? <span className="admin-spinner" /> : <ImagePlus size={20} />}</span>
        <strong>{isPending ? "Fotoğraflar yükleniyor…" : "Birden fazla fotoğraf seçin"}</strong>
        <small>Teknenin farklı açılardan fotoğraflarını ekleyin · her biri otomatik küçültülür</small>
      </label>
      {error && <small className="admin-form-error" role="alert">{error}</small>}
      {value.length > 0 && (
        <div className="admin-gallery-grid">
          {value.map((url, index) => (
            <div className="admin-gallery-grid__item" key={url}>
              <img src={url} alt={`Fotoğraf ${index + 1}`} />
              <button type="button" onClick={() => removeAt(index)} aria-label={`${index + 1}. fotoğrafı kaldır`}><X size={14} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingFormPanel({ value, onChange, onCancel, onSaved }: { value: ListingForm; onChange: (value: ListingForm) => void; onCancel: () => void; onSaved: () => void }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const set = <K extends keyof ListingForm>(key: K, next: ListingForm[K]) => onChange({ ...value, [key]: next });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { id, ...payload } = value;
    setIsSaving(true);
    setSaveError(false);
    try {
      if (id !== undefined) await updateBoatListing(id, payload);
      else await createBoatListing(payload);
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
        <div><p className="eyebrow">{value.id ? "İlanı düzenle" : "Yeni ilan"}</p><h2>{value.id ? value.title : "Yeni tekne ilanı"}</h2></div>
        <button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button>
      </div>
      <div className="admin-project-form__grid">
        <label className="admin-project-form__full">İlan başlığı<Input required value={value.title} onChange={(event) => set("title", event.target.value)} placeholder="Bavaria 34 Cruiser" /></label>
        <label>Fiyat<Input required value={value.price} onChange={(event) => set("price", event.target.value)} placeholder="Fiyat için arayınız / 1.250.000 TL" /></label>
        <label>Model yılı<Input value={value.year} onChange={(event) => set("year", event.target.value)} placeholder="2014" /></label>
        <label>Boy (metre)<Input value={value.lengthMeters} onChange={(event) => set("lengthMeters", event.target.value)} placeholder="10.4 m" /></label>
        <label>Motor bilgisi<Input value={value.engineInfo} onChange={(event) => set("engineInfo", event.target.value)} placeholder="Volvo Penta D4, 2x225 HP" /></label>
        <label>Konum<Input value={value.location} onChange={(event) => set("location", event.target.value)} placeholder="Çeşme, İzmir" /></label>
        <CoverImageField value={value.coverImage} onChange={(url) => set("coverImage", url)} />
        <GalleryField value={value.galleryImages} onChange={(urls) => set("galleryImages", urls)} />
        <label className="admin-project-form__full">Açıklama<Textarea required value={value.description} onChange={(event) => set("description", event.target.value)} rows={6} placeholder="Teknenin genel durumu, ekipmanları ve öne çıkan özellikleri..." /></label>
        <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as ListingForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label>
        <label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label>
      </div>
      {saveError && <p className="admin-form-error" role="alert">İçerik kaydedilemedi. Gerekli alanları kontrol edip tekrar deneyin.</p>}
      <div className="admin-project-form__actions">
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
        <Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "İlanı kaydet"}</Button>
      </div>
    </form>
  );
}

function ListingsToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => { getListingsEnabled().then(setEnabled).catch(() => setEnabled(false)); }, []);

  const toggle = async () => {
    if (enabled === null || isSaving) return;
    const next = !enabled;
    setIsSaving(true);
    try {
      await setListingsEnabled(next);
      setEnabled(next);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-listings-toggle">
      <div>
        <strong>İlanlar sayfası sitede {enabled ? "aktif" : "kapalı"}</strong>
        <p>{enabled ? "\"İlanlar\" menüde görünüyor ve yayınlanmış ilanlar sitede listeleniyor." : "Kapalıyken \"İlanlar\" menüde hiç görünmez, sayfaya erişilemez. İlan bilgilerini yine de burada hazırlayıp saklayabilirsiniz."}</p>
      </div>
      <button type="button" role="switch" aria-checked={enabled ?? false} className={`admin-toggle-switch${enabled ? " is-on" : ""}`} onClick={() => void toggle()} disabled={enabled === null || isSaving}>
        <span />
      </button>
    </div>
  );
}

export default function AdminListings() {
  const [list, setList] = useState<BoatListingRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllBoatListings().then((data) => { setList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<ListingForm | null>(null);
  const editListing = (listing: BoatListingRow) => setForm({
    id: listing.id, title: listing.title, price: listing.price, year: listing.year, lengthMeters: listing.lengthMeters,
    engineInfo: listing.engineInfo, location: listing.location, description: listing.description,
    coverImage: listing.coverImage ?? "", galleryImages: listing.galleryImages, status: listing.status, sortOrder: listing.sortOrder,
  });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu ilanı kaldırmak istediğinize emin misiniz?")) deleteBoatListing(id).then(refresh); };

  return (
    <DashboardLayout>
      <div className="admin-projects-page">
        <header className="admin-page-header">
          <div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Tekne İlanları</h1><p>Satılık/kiralık tekne ilanlarınızı hazırlayın ve isterseniz sitede yayınlayın.</p></div>
          <Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni ilan</Button>
        </header>
        <ListingsToggle />
        {form && <ListingFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}
        <section className="admin-project-list" aria-label="İlan listesi">
          <div className="admin-project-list__header"><h2>Tüm ilanlar</h2><span>{list?.length ?? 0} kayıt</span></div>
          {list === null && !listError ? <p className="admin-empty">İlanlar yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">İlan listesi yüklenemedi. Yönetici yetkinizi kontrol edin.</p> : list?.length ? list.map((listing) => (
            <article className="admin-project-row" key={listing.id}>
              {listing.coverImage ? <img className="admin-knowledge-cover" src={listing.coverImage} alt="" /> : <div className="admin-knowledge-row__icon"><Anchor size={28} /></div>}
              <div className="admin-project-row__copy">
                <div className="admin-project-row__meta">
                  <strong className={`admin-status admin-status--${listing.status}`}>{listing.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>
                </div>
                <h3>{listing.title}</h3>
                <p>{listing.price}{listing.year ? ` · ${listing.year}` : ""}{listing.location ? ` · ${listing.location}` : ""}</p>
                <small>sıra {listing.sortOrder}</small>
              </div>
              <div className="admin-project-row__actions">
                <Button variant="outline" size="sm" onClick={() => editListing(listing)}><Pencil size={15} /> Düzenle</Button>
                <Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(listing.id)}><Trash2 size={15} /> Sil</Button>
              </div>
            </article>
          )) : <div className="admin-empty"><p>Henüz ilan yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk ilanı ekle</Button></div>}
        </section>
      </div>
    </DashboardLayout>
  );
}
