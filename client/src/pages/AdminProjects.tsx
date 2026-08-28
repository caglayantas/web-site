import DashboardLayout from "@/components/DashboardLayout";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useProjectDraft, useProjectImageUpload } from "@/hooks/useProjectEditor";
import { Check, Eye, ImagePlus, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

type ProjectForm = {
  id?: number;
  slug: string;
  label: string;
  title: string;
  detail: string;
  scope: string;
  systems: string;
  results: string;
  beforeImage: string;
  afterImage: string;
  status: "draft" | "published";
  sortOrder: number;
};

const emptyForm: ProjectForm = { slug: "", label: "", title: "", detail: "", scope: "", systems: "", results: "", beforeImage: "", afterImage: "", status: "draft", sortOrder: 0 };
const PROJECT_DRAFT_KEY = "perla-marine-project-draft-v2";
const PLACEHOLDER_PROJECT_TEXT = /(bvnmv|cnbv|asdasd|jhjh|mnbv|ngch|vngch)/i;

function clearProjectDraft() { if (typeof window !== "undefined") window.localStorage.removeItem(PROJECT_DRAFT_KEY); }

function toSlug(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR").replace(/[ıİ]/g, "i").replace(/[ğĞ]/g, "g").replace(/[üÜ]/g, "u").replace(/[şŞ]/g, "s").replace(/[öÖ]/g, "o").replace(/[çÇ]/g, "c").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}
type FormErrors = Partial<Record<keyof ProjectForm | "form", string>>;
type SavedProject = Omit<ProjectForm, "scope" | "systems" | "results"> & { id: number; scope: string | null; systems: string | null; results: string | null; createdAt?: Date; updatedAt?: Date };

function formatProjectMutationError(message: string): { message: string; field?: keyof ProjectForm } {
  try {
    const parsed = JSON.parse(message) as Array<{ path?: string[]; message?: string; code?: string; minimum?: number }>;
    const issue = Array.isArray(parsed) ? parsed[0] : undefined;
    if (issue?.path?.includes("detail") && issue.code === "too_small") return { field: "detail", message: "Kısa açıklama en az 10 karakter olmalıdır." };
    if (issue?.path?.includes("slug") && issue.code === "too_small") return { field: "slug", message: "URL anahtarı en az 2 karakter olmalıdır." };
    if (issue?.path?.includes("beforeImage") || issue?.path?.includes("afterImage")) return { field: issue.path.includes("beforeImage") ? "beforeImage" : "afterImage", message: "Önce ve Sonra görsellerinin yüklenmesi gerekiyor." };
  } catch { /* TRPC may already return a readable message */ }
  return { message };
}

function focusFormError(field?: keyof ProjectForm) {
  if (!field || typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    const element = document.getElementById(`${String(field)}-field`);
    element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    element?.focus({ preventScroll: true });
  });
}

function CharacterCount({ value, max }: { value: string; max: number }) {
  return <small className={`admin-character-count${value.length > max ? " is-over" : ""}`} aria-live="polite">{value.length}/{max}</small>;
}

function validateProjectForm(value: ProjectForm): FormErrors {
  const errors: FormErrors = {};
  if (!value.slug.trim()) errors.slug = "URL anahtarı zorunludur. Örnek: aku-guc-dagitim";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug.trim())) errors.slug = "Yalnızca küçük harf, rakam ve tire kullanın.";
  if (!value.label.trim()) errors.label = "Kategori adı eksik. Örnek: Marin elektrik";
  if (!value.title.trim()) errors.title = "Proje başlığını yazın.";
  else if (value.status === "published" && value.title.trim().length < 6) errors.title = "Yayın için daha açıklayıcı bir proje başlığı yazın.";
  if (!value.detail.trim()) errors.detail = "Kısa açıklama alanı boş bırakılamaz.";
  else if (value.detail.trim().length < 10) errors.detail = "Kısa açıklama en az 10 karakter olmalıdır. Sorunu ve yapılan işlemi biraz daha açıklayın.";
  else if (value.status === "published" && value.detail.trim().length < 30) errors.detail = "Yayın için yapılan işi ve sonucu en az 30 karakterle açıklayın.";
  if (value.status === "published" && [value.slug, value.label, value.title, value.detail].some((field) => PLACEHOLDER_PROJECT_TEXT.test(field))) errors.form = "Yayınlamadan önce test metinlerini gerçek proje bilgileriyle değiştirin.";
  if (!value.beforeImage) errors.beforeImage = "Önce görselini seçin veya sürükleyerek yükleyin.";
  if (!value.afterImage) errors.afterImage = "Sonra görselini seçin veya sürükleyerek yükleyin.";
  if (!Number.isFinite(value.sortOrder) || value.sortOrder < 0) errors.sortOrder = "Sıra değeri sıfır veya daha büyük olmalıdır.";
  return errors;
}

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
}

function ImageUploadField({ field, label, value, fieldError, onChange, onError }: { field: string; label: string; value: string; fieldError?: string; onChange: (url: string) => void; onError?: (message: string) => void }) {
  const upload = useProjectImageUpload();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value);
  const [dragging, setDragging] = useState(false);
  useEffect(() => { setPreview(value); }, [value]);
  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { const message = "Lütfen bir görsel dosyası seçin."; setError(message); onError?.(message); return; }
    if (file.size > 8 * 1024 * 1024) { const message = "Görsel boyutu 8 MB’dan küçük olmalı."; setError(message); onError?.(message); return; }
    setError("");
    onError?.("");
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    try {
      const data = await fileToBase64(file);
      const result = await upload.mutateAsync({ fileName: file.name, contentType: file.type as "image/jpeg", data });
      onChange(result.url);
      URL.revokeObjectURL(localPreview);
    } catch {
      const message = "Görsel yüklenemedi. Önizleme korunuyor; tekrar deneyin.";
      setError(message);
      onError?.(message);
    }
  };
  const visibleError = error || fieldError;
  return <div className={`admin-upload-field${visibleError ? " has-error" : ""}`}><span id={`${field}-label`}>{label}</span><label className={`admin-upload-dropzone${dragging ? " is-dragging" : ""}${visibleError ? " has-error" : ""}`} aria-describedby={visibleError ? `${field}-error` : undefined} aria-invalid={Boolean(visibleError)} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void handleFile(event.dataTransfer.files?.[0]); }}><input id={`${field}-field`} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void handleFile(event.target.files?.[0])} /><span className="admin-upload-dropzone__icon">{upload.isPending ? <Loader2 className="animate-spin" size={20} /> : <ImagePlus size={20} />}</span><strong>{upload.isPending ? "Görsel yükleniyor…" : dragging ? "Bırakın" : value ? "Görseli değiştir" : "Görsel seçin veya sürükleyin"}</strong><small>JPG, PNG, WebP · maksimum 8 MB</small></label>{preview && <img className="admin-upload-preview" src={preview} alt={`${label} önizleme`} />}{preview && !value && <small className="admin-upload-pending">Önizleme hazır · kaydetmeden önce yükleniyor</small>}{visibleError && <small id={`${field}-error`} className="admin-form-error" role="alert">{visibleError}</small>}</div>;
}

function SavedProjectSummary({ project, onClose }: { project: SavedProject; onClose: () => void }) {
  const previewUrl = project.status === "published" ? `/projeler#${encodeURIComponent(project.slug)}` : `/yonetim/projeler/preview/${encodeURIComponent(project.slug)}`;
  const previewLabel = project.status === "published" ? "Yayındaki görünümü aç" : "Taslak önizlemeyi aç";
  return <section className="admin-save-summary" role="status" aria-live="polite"><div><p className="eyebrow">Kayıt tamamlandı</p><h2>{project.title}</h2><p>Proje başarıyla kaydedildi. {project.status === "published" ? "Public sayfadaki görünümünü kontrol edebilirsiniz." : "Yayınlamadan önce tam sayfa taslak önizlemesini kontrol edebilirsiniz."}</p></div><div className="admin-save-summary__meta"><span>{project.label}</span><span>/{project.slug}</span></div><div className="admin-save-summary__actions"><a className="admin-save-summary__link" href={previewUrl}><Eye size={15} /> {previewLabel} <span aria-hidden="true">↗</span></a><Button type="button" variant="outline" onClick={onClose}>Kapat</Button></div></section>;
}

function ProjectLivePreview({ value }: { value: ProjectForm }) {
  const hasImages = Boolean(value.beforeImage && value.afterImage);
  return <aside className="admin-live-preview" aria-label="Public proje canlı önizlemesi"><div className="admin-live-preview__heading"><div><p className="eyebrow">Canlı önizleme</p><h3>Sitede böyle görünecek</h3></div><span>Public kart</span></div><article className="admin-live-preview__card"><div className="admin-live-preview__media">{hasImages ? <BeforeAfterSlider before={value.beforeImage} after={value.afterImage} beforeAlt="Önce görseli önizleme" afterAlt="Sonra görseli önizleme" label={value.title || "Proje"} /> : <div className="admin-live-preview__empty"><ImagePlus size={22} /><span>İki görsel yüklendiğinde karşılaştırma burada görünür.</span></div>}</div><div className="admin-live-preview__copy"><span className="admin-live-preview__label">{value.label || "Kategori"}</span><h4>{value.title || "Proje başlığı"}</h4><p>{value.detail || "Kısa açıklama burada görünecek."}</p><div className="admin-live-preview__facts"><div><strong>Kapsam</strong><span>{value.scope || "Henüz girilmedi"}</span></div><div><strong>Sistemler</strong><span>{value.systems || "Henüz girilmedi"}</span></div><div><strong>Sonuç</strong><span>{value.results || "Henüz girilmedi"}</span></div></div></div></article></aside>;
}

function ProjectFormPanel({ value, onChange, onCancel, onSaved }: { value: ProjectForm; onChange: (value: ProjectForm) => void; onCancel: () => void; onSaved: (project: SavedProject) => void }) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [slugTouched, setSlugTouched] = useState(Boolean(value.id));
  const handleMutationError = (message: string) => { const formatted = formatProjectMutationError(message); setErrors(formatted.field ? { form: formatted.message, [formatted.field]: formatted.message } : { form: formatted.message }); focusFormError(formatted.field); };
  const create = trpc.projects.create.useMutation({ onSuccess: onSaved, onError: (error) => handleMutationError(error.message) });
  const update = trpc.projects.update.useMutation({ onSuccess: onSaved, onError: (error) => handleMutationError(error.message) });
  const isSaving = create.isPending || update.isPending;
  const { draftAvailable, draftSavedAt, restoreDraft, discardDraft } = useProjectDraft(value, onChange);
  const set = <K extends keyof ProjectForm>(key: K, next: ProjectForm[K]) => {
    const nextValue = { ...value, [key]: next };
    if (key === "slug") setSlugTouched(true);
    if (key === "title" && !value.id && !slugTouched) nextValue.slug = toSlug(String(next));
    onChange(nextValue);
    setErrors((current) => { const nextErrors = { ...current }; delete nextErrors[key]; delete nextErrors.form; if (key === "title") delete nextErrors.slug; return nextErrors; });
  };
  const fieldProps = (key: keyof ProjectForm) => ({
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${String(key)}-error` : undefined,
  });
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateProjectForm(value);
    setErrors(nextErrors);
    const firstErrorKey = Object.keys(nextErrors)[0] as keyof ProjectForm | undefined;
    if (firstErrorKey) {
      requestAnimationFrame(() => document.getElementById(`${String(firstErrorKey)}-field`)?.focus());
      return;
    }
    const { id, ...rawPayload } = value;
    const payload = { ...rawPayload, slug: rawPayload.slug.trim(), label: rawPayload.label.trim(), title: rawPayload.title.trim(), detail: rawPayload.detail.trim(), scope: rawPayload.scope.trim(), systems: rawPayload.systems.trim(), results: rawPayload.results.trim() };
    if (id !== undefined) update.mutate({ id, ...payload });
    else create.mutate(payload);
  };
  const field = (key: keyof ProjectForm) => errors[key] ? " has-error" : "";
  const serverError = errors.form || create.error?.message || update.error?.message;
  const hint = (key: keyof ProjectForm, text: string) => errors[key] ? <small id={`${String(key)}-error`} className="admin-form-error" role="alert">{errors[key]}</small> : <small className="admin-form-hint">{text}</small>;
  return <form className="admin-project-form" onSubmit={submit} noValidate>
    <div className="admin-project-form__header"><div><p className="eyebrow">{value.id ? "Projeyi düzenle" : "Yeni proje"}</p><h2>{value.id ? value.title : "Saha çalışması ekle"}</h2></div><button type="button" className="admin-icon-button" onClick={onCancel} aria-label="Formu kapat"><X size={18} /></button></div>
    {draftAvailable && <div className="admin-draft-banner" role="status"><div><strong>Kaydedilmiş bir taslak bulundu.</strong><small>İsterseniz kaldığınız yerden devam edebilirsiniz.</small></div><div><Button type="button" size="sm" onClick={restoreDraft}>Taslağı geri yükle</Button><Button type="button" size="sm" variant="ghost" onClick={discardDraft}>Sil</Button></div></div>}
    {Object.keys(errors).length > 0 && <div className="admin-form-summary" role="alert" aria-live="polite"><strong>{serverError ? "Proje kaydedilemedi:" : "Projeyi kaydetmeden önce şu alanları düzeltin:"}</strong>{serverError && <p>{serverError}</p>}<ul>{Object.entries(errors).filter(([key, message]) => key !== "form" && Boolean(message)).map(([key, message]) => <li key={key}><a href={`#${key}-field`}>{message}</a></li>)}</ul></div>}
    <div className="admin-project-form__grid">
      <label className={field("slug")}>URL anahtarı<Input id="slug-field" maxLength={160} {...fieldProps("slug")} value={value.slug} onChange={(event) => set("slug", event.target.value)} placeholder="aku-guc-dagitim" />{hint("slug", slugTouched ? "Bu alanı manuel düzenliyorsunuz." : "Başlıktan otomatik oluşturulur; isterseniz sonradan değiştirebilirsiniz.")}<CharacterCount value={value.slug} max={160} /></label>
      <label className={field("label")}>Kategori<Input id="label-field" maxLength={120} {...fieldProps("label")} value={value.label} onChange={(event) => set("label", event.target.value)} placeholder="Marin elektrik" />{hint("label", "Projenin bağlı olduğu hizmet kategorisini yazın.")}<CharacterCount value={value.label} max={120} /></label>
      <label className={`admin-project-form__full${field("title")}`}>Proje başlığı<Input id="title-field" maxLength={220} {...fieldProps("title")} value={value.title} onChange={(event) => set("title", event.target.value)} placeholder="Akü ve güç dağıtım sistemi" />{hint("title", "Ziyaretçinin proje kartında göreceği kısa ve açıklayıcı başlık.")}<CharacterCount value={value.title} max={220} /></label>
      <label className={`admin-project-form__full${field("detail")}`}>Kısa açıklama<Textarea id="detail-field" maxLength={500} {...fieldProps("detail")} value={value.detail} onChange={(event) => set("detail", event.target.value)} placeholder="Yapılan bakım ve yenileme operasyonlarını açıklayın." rows={3} />{hint("detail", "Sorunu, yapılan müdahaleyi ve kapsamı en az 10 karakterle özetleyin.")}<CharacterCount value={value.detail} max={500} /></label>
      <label className="admin-project-form__full">Proje kapsamı<Textarea maxLength={800} value={value.scope} onChange={(event) => set("scope", event.target.value)} placeholder="Kontrol edilen ve uygulanan bakım adımlarını yazın." rows={3} /><small className="admin-form-hint">Kontrol edilen sistemleri ve uygulanan bakım adımlarını ayrıntılandırın.</small><CharacterCount value={value.scope} max={800} /></label>
      <label>Kullanılan sistemler<Textarea maxLength={800} value={value.systems} onChange={(event) => set("systems", event.target.value)} placeholder="Akü, BMS, pano, kablolama…" rows={3} /><small className="admin-form-hint">Virgülle ayırarak kullanılan sistemleri yazabilirsiniz.</small><CharacterCount value={value.systems} max={800} /></label>
      <label>Bakım sonucu<Textarea maxLength={800} value={value.results} onChange={(event) => set("results", event.target.value)} placeholder="Operasyon sonrasında elde edilen teknik durumu yazın." rows={3} /><small className="admin-form-hint">Bakım sonrasında elde edilen durumu ve gözlemlenen sonucu belirtin.</small><CharacterCount value={value.results} max={800} /></label>
      <ImageUploadField field="beforeImage" label="Önce görseli" fieldError={errors.beforeImage} onError={(message) => setErrors((current) => { const nextErrors = { ...current }; if (message) nextErrors.beforeImage = message; else delete nextErrors.beforeImage; return nextErrors; })} value={value.beforeImage} onChange={(url) => set("beforeImage", url)} />
      <ImageUploadField field="afterImage" label="Sonra görseli" fieldError={errors.afterImage} onError={(message) => setErrors((current) => { const nextErrors = { ...current }; if (message) nextErrors.afterImage = message; else delete nextErrors.afterImage; return nextErrors; })} value={value.afterImage} onChange={(url) => set("afterImage", url)} />
      <label>Durum<select value={value.status} onChange={(event) => set("status", event.target.value as ProjectForm["status"])}><option value="draft">Taslak</option><option value="published">Yayında</option></select><small className="admin-form-hint">Taslak kayıtlar public sayfalarda gösterilmez.</small></label>
      <label className={field("sortOrder")}>Sıra<Input id="sortOrder-field" type="number" min={0} {...fieldProps("sortOrder")} value={value.sortOrder} onChange={(event) => set("sortOrder", Number(event.target.value))} />{hint("sortOrder", "Küçük sayı listede daha üstte görünür.")}</label>
    </div>
    {draftSavedAt && !value.id && <p className="admin-draft-status" role="status">Taslak yerel olarak kaydedildi · {new Date(draftSavedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</p>}
    <div className="admin-project-form__actions"><Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button><Button type="submit" disabled={isSaving}><Save size={16} /> {isSaving ? "Kaydediliyor…" : "Projeyi kaydet"}</Button></div>
    <ProjectLivePreview value={value} />
  </form>;
}

export default function AdminProjects() {
  const projects = trpc.projects.adminList.useQuery();
  const utils = trpc.useUtils();
  const refreshProjects = () => { void Promise.all([projects.refetch(), utils.projects.published.invalidate()]); };
  const remove = trpc.projects.remove.useMutation({ onSuccess: refreshProjects });
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [savedProject, setSavedProject] = useState<SavedProject | null>(null);
  const editProject = (project: NonNullable<typeof projects.data>[number]) => { setSavedProject(null); setForm({ id: project.id, slug: project.slug, label: project.label, title: project.title, detail: project.detail, scope: project.scope ?? "", systems: project.systems ?? "", results: project.results ?? "", beforeImage: project.beforeImage, afterImage: project.afterImage, status: project.status, sortOrder: project.sortOrder }); };
  const startNewProject = () => { setSavedProject(null); setForm(emptyForm); };
  const saved = (project: SavedProject) => { clearProjectDraft(); setForm(null); setSavedProject(project); refreshProjects(); };
  return <DashboardLayout><div className="admin-projects-page"><header className="admin-page-header"><div><p className="eyebrow">Perla Marine · Yönetim</p><h1>Projeler</h1><p>Önce/sonra saha çalışmalarını görselleri yükleyerek ekleyin, detaylandırın ve yayına alın.</p></div><Button onClick={startNewProject}><Plus size={17} /> Yeni proje</Button></header>{savedProject && <SavedProjectSummary project={savedProject} onClose={() => setSavedProject(null)} />}{form && <ProjectFormPanel value={form} onChange={setForm} onCancel={() => setForm(null)} onSaved={saved} />}<section className="admin-project-list" aria-label="Proje listesi"><div className="admin-project-list__header"><h2>Tüm projeler</h2><span>{projects.data?.length ?? 0} kayıt</span></div>{projects.isLoading ? <p className="admin-empty">Projeler yükleniyor…</p> : projects.error ? <p className="admin-form-error" role="alert">Proje listesi yüklenemedi. Yönetici yetkinizi kontrol edin.</p> : projects.data?.length ? projects.data.map((project) => <article className="admin-project-row" key={project.id}><div className="admin-project-row__images"><img src={project.beforeImage} alt={`${project.title} önce`} /><img src={project.afterImage} alt={`${project.title} sonra`} /></div><div className="admin-project-row__copy"><div className="admin-project-row__meta"><span>{project.label}</span><strong className={`admin-status admin-status--${project.status}`}>{project.status === "published" ? <><Check size={13} /> Yayında</> : "Taslak"}</strong></div><h3>{project.title}</h3><p>{project.detail}</p><small>/{project.slug} · Sıra {project.sortOrder}</small></div><div className="admin-project-row__actions"><a className="admin-project-preview-link" href={project.status === "published" ? `/projeler#${encodeURIComponent(project.slug)}` : `/yonetim/projeler/preview/${encodeURIComponent(project.slug)}`}><Eye size={15} /> {project.status === "published" ? "Görünümü aç" : "Taslağı önizle"}</a><Button variant="outline" size="sm" onClick={() => editProject(project)}><Pencil size={15} /> Düzenle</Button><Button variant="ghost" size="sm" className="admin-delete-button" onClick={() => { if (window.confirm("Bu projeyi kaldırmak istediğinize emin misiniz?")) remove.mutate({ id: project.id }); }}><Trash2 size={15} /> Sil</Button></div></article>) : <div className="admin-empty"><p>Henüz proje yok.</p><Button onClick={startNewProject}><Plus size={16} /> İlk projeyi ekle</Button></div>}</section></div></DashboardLayout>;
}
