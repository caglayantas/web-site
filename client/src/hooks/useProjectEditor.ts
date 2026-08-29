import { useEffect, useState } from "react";

export type ProjectForm = {
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

export const emptyForm: ProjectForm = { slug: "", label: "", title: "", detail: "", scope: "", systems: "", results: "", beforeImage: "", afterImage: "", status: "draft", sortOrder: 0 };
export const PROJECT_DRAFT_KEY = "perla-marine-project-draft-v2";
export type FormErrors = Partial<Record<keyof ProjectForm | "form", string>>;
export type SavedProject = Omit<ProjectForm, "scope" | "systems" | "results"> & { id: number; scope: string | null; systems: string | null; results: string | null; createdAt?: Date; updatedAt?: Date };

export function clearProjectDraft() { if (typeof window !== "undefined") window.localStorage.removeItem(PROJECT_DRAFT_KEY); }

export function toSlug(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR").replace(/[ıİ]/g, "i").replace(/[ğĞ]/g, "g").replace(/[üÜ]/g, "u").replace(/[şŞ]/g, "s").replace(/[öÖ]/g, "o").replace(/[çÇ]/g, "c").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}

export function formatProjectMutationError(message: string): { message: string; field?: keyof ProjectForm } {
  try {
    const parsed = JSON.parse(message) as Array<{ path?: string[]; message?: string; code?: string }>;
    const issue = Array.isArray(parsed) ? parsed[0] : undefined;
    if (issue?.path?.includes("detail") && issue.code === "too_small") return { field: "detail", message: "Kısa açıklama en az 10 karakter olmalıdır." };
    if (issue?.path?.includes("slug") && issue.code === "too_small") return { field: "slug", message: "URL anahtarı en az 2 karakter olmalıdır." };
    if (issue?.path?.includes("beforeImage") || issue?.path?.includes("afterImage")) return { field: issue.path.includes("beforeImage") ? "beforeImage" : "afterImage", message: "Önce ve Sonra görsellerinin yüklenmesi gerekiyor." };
  } catch { /* TRPC may already return a readable message */ }
  return { message };
}

export function focusFormError(field?: keyof ProjectForm) {
  if (!field || typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    const element = document.getElementById(`${String(field)}-field`);
    element?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    element?.focus({ preventScroll: true });
  });
}

export function validateProjectForm(value: ProjectForm): FormErrors {
  const errors: FormErrors = {};
  if (!value.slug.trim()) errors.slug = "URL anahtarı zorunludur. Örnek: aku-guc-dagitim";
  else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug.trim())) errors.slug = "Yalnızca küçük harf, rakam ve tire kullanın.";
  if (!value.label.trim()) errors.label = "Kategori adı eksik. Örnek: Marin elektrik";
  if (!value.title.trim()) errors.title = "Proje başlığını yazın.";
  if (!value.detail.trim()) errors.detail = "Kısa açıklama alanı boş bırakılamaz.";
  else if (value.detail.trim().length < 10) errors.detail = "Kısa açıklama en az 10 karakter olmalıdır. Sorunu ve yapılan işlemi biraz daha açıklayın.";
  if (!value.beforeImage) errors.beforeImage = "Önce görselini seçin veya sürükleyerek yükleyin.";
  if (!value.afterImage) errors.afterImage = "Sonra görselini seçin veya sürükleyerek yükleyin.";
  if (!Number.isFinite(value.sortOrder) || value.sortOrder < 0) errors.sortOrder = "Sıra değeri sıfır veya daha büyük olmalıdır.";
  return errors;
}

export async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.length; index += 1) binary += String.fromCharCode(bytes[index]);
  return btoa(binary);
}

export function useProjectDraft(value: ProjectForm, onChange: (value: ProjectForm) => void) {
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (value.id || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(PROJECT_DRAFT_KEY);
      const draft = raw ? JSON.parse(raw) as Partial<ProjectForm> : null;
      setDraftAvailable(Boolean(draft && (draft.title || draft.detail || draft.slug)));
    } catch { setDraftAvailable(false); }
  }, [value.id]);

  useEffect(() => {
    if (value.id || typeof window === "undefined" || (!value.title && !value.detail && !value.slug)) return;
    try {
      const savedAt = Date.now();
      window.localStorage.setItem(PROJECT_DRAFT_KEY, JSON.stringify({ ...value, savedAt }));
      setDraftSavedAt(savedAt);
    } catch { /* local storage can be unavailable in private browsing */ }
  }, [value]);

  const restoreDraft = () => {
    try {
      const raw = window.localStorage.getItem(PROJECT_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<ProjectForm>;
      onChange({ ...emptyForm, ...draft, id: undefined });
      setDraftAvailable(false);
    } catch { setDraftAvailable(false); }
  };
  const discardDraft = () => { clearProjectDraft(); setDraftAvailable(false); };
  return { draftAvailable, draftSavedAt, restoreDraft, discardDraft };
}
