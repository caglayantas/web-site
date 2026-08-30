import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createKnowledgePost, updateKnowledgePost, deleteKnowledgePost, getAllKnowledgePosts, uploadImage, type KnowledgePostRow } from "@/lib/content";
import { renderMarkdownToHtml, slugify } from "@/lib/markdown";
import { Check, Crop, Eye, FileText, ImagePlus, Pencil, Plus, Save, Trash2, X, ZoomIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type KnowledgeForm = { id?: number; slug: string; category: string; title: string; excerpt: string; coverImage: string; body: string; seoTitle: string; seoDescription: string; publishedAt: string; status: "draft" | "published"; featured: boolean; sortOrder: number };
const emptyForm: KnowledgeForm = { slug: "", category: "Marin elektrik", title: "", excerpt: "", coverImage: "", body: "## Teknik not\n\nİçeriğinizi markdown ile yazın.\n\n- Kontrol başlığı\n- Uygulama notu\n- Bakım önerisi", seoTitle: "", seoDescription: "", publishedAt: new Date().toISOString().slice(0, 16), status: "draft", featured: false, sortOrder: 0 };

async function fileToBase64(file: File) { const buffer = await file.arrayBuffer(); let binary = ""; const bytes = new Uint8Array(buffer); for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]); return btoa(binary); }
async function cropToWebp(bitmap: ImageBitmap, focalX: number, focalY: number, zoom: number, fileName: string) { const outputWidth = 1600; const outputHeight = 900; const aspect = outputWidth / outputHeight; const imageAspect = bitmap.width / bitmap.height; const baseHeight = imageAspect > aspect ? bitmap.height : bitmap.width / aspect; const baseWidth = baseHeight * aspect; const cropWidth = baseWidth / zoom; const cropHeight = cropWidth / aspect; const sx = Math.max(0, Math.min(bitmap.width - cropWidth, (bitmap.width - cropWidth) * focalX)); const sy = Math.max(0, Math.min(bitmap.height - cropHeight, (bitmap.height - cropHeight) * focalY)); const canvas = document.createElement("canvas"); canvas.width = outputWidth; canvas.height = outputHeight; const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas kullanılamıyor"); context.drawImage(bitmap, sx, sy, cropWidth, cropHeight, 0, 0, outputWidth, outputHeight); const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86)); if (!blob) throw new Error("WebP dönüşümü başarısız"); return new File([blob], `${fileName.replace(/\.[^.]+$/, "") || "kapak"}.webp`, { type: "image/webp" }); }

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
      const url = await uploadImage("knowledge", webpFile);
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
        <strong>{isPending ? "WebP hazırlanıyor ve yükleniyor…" : dragging ? "Bırakın" : value ? "Kapak görselini değiştir" : "Kapak görseli seçin veya sürükleyin"}</strong>
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

function MarkdownEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) { const [preview, setPreview] = useState(false); return <div className="markdown-editor"><div className="markdown-editor__toolbar"><span><FileText size={16} /> Markdown gövde</span><button type="button" onClick={() => setPreview((current) => !current)} aria-pressed={preview}><Eye size={15} /> {preview ? "Düzenle" : "Önizle"}</button></div>{preview ? <div className="markdown-editor__preview knowledge-card__body" dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(value) }} /> : <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={18} aria-label="Markdown teknik içerik gövdesi" placeholder="# Başlık\n\nTeknik içeriğinizi buraya yazın..." />}<small>Başlık, kalın metin, italik, bağlantı, madde listesi, alıntı ve kod bloğu desteklenir.</small></div>; }

function KnowledgeFormPanel({ value, onChange, onCancel, onSaved }: { value: KnowledgeForm; onChange: (value: KnowledgeForm) => void; onCancel: () => void; onSaved: () => void }) { const [isSaving, setIsSaving] = useState(false); const [saveError, setSaveError] = useState(false); const set = <K extends keyof KnowledgeForm>(key: K, next: KnowledgeForm[K]) => onChange({ ...value, [key]: next }); const updateTitle = (title: string) => onChange({ ...value, title, slug: value.id ? value.slug : slugify(title) }); const submit = async (event: React.FormEvent) => { event.preventDefault(); const { id, publishedAt, ...rest } = value; const payload = { ...rest, publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null }; setIsSaving(true); setSaveError(false); try { if (id !== undefined) await updateKnowledgePost(id, payload); else await createKnowledgePost(payload); onSaved(); } catch { setSaveError(true); } finally { setIsSaving(false); } }; return <form className="admin-project-form" onSubmit={submit}><div className="admin-project-form__header"><div><p className="eyebrow">{value.id ? "İçeriği düzenle" : "Yeni teknik bilgi"}</p><h2>{value.id ? value.title : "Markdown teknik bilgi ekle"}</h2></div><button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button></div><div className="admin-project-form__grid"><label>URL anahtarı<Input required value={value.slug} onChange={(event) => set("slug", slugify(event.target.value))} placeholder="lityum-bms-bakim-kontrolu" /></label><label>Kategori<Input required value={value.category} onChange={(event) => set("category", event.target.value)} placeholder="Elektrik ve enerji" /></label><label className="admin-project-form__full">Başlık<Input required value={value.title} onChange={(event) => updateTitle(event.target.value)} /></label><CoverImageField value={value.coverImage} onChange={(url) => set("coverImage", url)} /><label className="admin-project-form__full">Kısa özet<Textarea required value={value.excerpt} onChange={(event) => set("excerpt", event.target.value)} rows={3} /></label><label>SEO başlığı<Input value={value.seoTitle} maxLength={240} onChange={(event) => set("seoTitle", event.target.value)} placeholder="Boşsa yazı başlığı kullanılır" /></label><label>SEO açıklaması<Textarea value={value.seoDescription} maxLength={320} onChange={(event) => set("seoDescription", event.target.value)} rows={2} placeholder="Arama sonuçlarında görünecek açıklama" /></label><label>Yayın tarihi<Input type="datetime-local" value={value.publishedAt} onChange={(event) => set("publishedAt", event.target.value)} /></label><div className="admin-project-form__full"><span className="admin-field-label">İçerik gövdesi</span><MarkdownEditor value={value.body} onChange={(body) => set("body", body)} /></div><label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as KnowledgeForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select></label><label>Sıra<Input type="number" min={0} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} /></label><label className="admin-checkbox-field"><input type="checkbox" checked={value.featured} onChange={(event) => set("featured", event.target.checked)} /> Ana sayfada öne çıkar</label></div>{saveError && <p className="admin-form-error" role="alert">İçerik kaydedilemedi. Slug, SEO alanları ve markdown gövdesini kontrol edip tekrar deneyin.</p>}<div className="admin-project-form__actions"><Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button><Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "İçeriği kaydet"}</Button></div></form>; }

export default function AdminKnowledge() {
  const [postList, setPostList] = useState<KnowledgePostRow[] | null>(null);
  const [listError, setListError] = useState(false);
  const refresh = () => { getAllKnowledgePosts().then((data) => { setPostList(data); setListError(false); }).catch(() => setListError(true)); };
  useEffect(() => { refresh(); }, []);
  const [form, setForm] = useState<KnowledgeForm | null>(null);
  const editPost = (post: KnowledgePostRow) => setForm({ id: post.id, slug: post.slug, category: post.category, title: post.title, excerpt: post.excerpt, coverImage: post.coverImage ?? "", body: post.body, seoTitle: post.seoTitle ?? "", seoDescription: post.seoDescription ?? "", publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : "", status: post.status, featured: post.featured, sortOrder: post.sortOrder });
  const saved = () => { setForm(null); refresh(); };
  const handleRemove = (id: number) => { if (window.confirm("Bu içeriği kaldırmak istediğinize emin misiniz?")) deleteKnowledgePost(id).then(refresh); };
  return <DashboardLayout><div className="admin-projects-page"><header className="admin-page-header"><div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Teknik Bilgiler</h1><p>Markdown gövde, SEO alanları, kapak görseli ve yayın tarihiyle aylık bakım yazılarını kod değiştirmeden yönetin.</p></div><Button onClick={() => setForm(emptyForm)}><Plus size={17} /> Yeni içerik</Button></header>{form && <KnowledgeFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}<section className="admin-project-list" aria-label="Teknik bilgi listesi"><div className="admin-project-list__header"><h2>Tüm içerikler</h2><span>{postList?.length ?? 0} kayıt</span></div>{postList === null && !listError ? <p className="admin-empty">İçerikler yükleniyor…</p> : listError ? <p className="admin-form-error" role="alert">İçerik listesi yüklenemedi. Yönetici yetkinizi kontrol edin.</p> : postList?.length ? postList.map((post) => <article className="admin-project-row" key={post.id}>{post.coverImage ? <img className="admin-knowledge-cover" src={post.coverImage} alt="" /> : <div className="admin-knowledge-row__icon"><FileText size={28} /></div>}<div className="admin-project-row__copy"><div className="admin-project-row__meta"><span>{post.category}</span><strong className={`admin-status admin-status--${post.status}`}>{post.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong>{post.featured && <span className="admin-featured-badge">Öne çıkan</span>}</div><h3>{post.title}</h3><p>{post.excerpt}</p><small>/{post.slug} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("tr-TR") : "Yayın tarihi yok"}</small></div><div className="admin-project-row__actions"><Button variant="outline" size="sm" onClick={() => editPost(post)}><Pencil size={15} /> Düzenle</Button><Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => handleRemove(post.id)}><Trash2 size={15} /> Sil</Button></div></article>) : <div className="admin-empty"><p>Henüz teknik bilgi yok.</p><Button onClick={() => setForm(emptyForm)}><Plus size={16} /> İlk içeriği ekle</Button></div>}</section></div></DashboardLayout>;
}
