import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const projectSource = readFileSync(new URL("./AdminProjects.tsx", import.meta.url), "utf8");
const projectEditorSource = readFileSync(new URL("../hooks/useProjectEditor.ts", import.meta.url), "utf8");
const knowledgeSource = readFileSync(new URL("./AdminKnowledge.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../../../server/routers.ts", import.meta.url), "utf8");

describe("admin project media and detail management", () => {
  it("uses direct image upload instead of URL-only fields", () => {
    expect(projectSource).toContain("useProjectImageUpload");
    expect(projectSource).toContain('type="file"');
    expect(projectSource).toContain("beforeImage");
    expect(projectSource).toContain("afterImage");
  });

  it("exposes scope, systems and results in the project form", () => {
    expect(projectSource).toContain("Proje kapsamı");
    expect(projectSource).toContain("Kullanılan sistemler");
    expect(projectSource).toContain("Bakım sonucu");
    expect(routerSource).toContain("scope: z.string().optional()");
    expect(routerSource).toContain("systems: z.string().optional()");
    expect(routerSource).toContain("results: z.string().optional()");
  });
});

describe("technical knowledge content management", () => {
  it("provides admin CRUD fields for editorial content", () => {
    expect(knowledgeSource).toContain("trpc.knowledge.adminList.useQuery()");
    expect(knowledgeSource).toContain("trpc.knowledge.create.useMutation");
    expect(knowledgeSource).toContain("İçerik gövdesi");
    expect(knowledgeSource).toContain("featured");
    expect(knowledgeSource).toContain("MarkdownEditor");
    expect(knowledgeSource).toContain("seoTitle");
    expect(knowledgeSource).toContain("seoDescription");
    expect(knowledgeSource).toContain("trpc.knowledge.uploadImage.useMutation");
    expect(knowledgeSource).toContain("coverImage");
  });
});

describe("cover crop and WebP conversion", () => {
  it("opens a crop workflow and uploads a fixed 16:9 WebP output", () => {
    expect(knowledgeSource).toContain("cropToWebp");
    expect(knowledgeSource).toContain("canvas.toBlob(resolve, \"image/webp\", 0.86)");
    expect(knowledgeSource).toContain("1600×900 WebP olarak yüklenir");
    expect(knowledgeSource).toContain("contentType: \"image/webp\"");
    expect(knowledgeSource).toContain("Kırp ve WebP yükle");
  });

  it("provides accessible crop controls and cancellation", () => {
    expect(knowledgeSource).toContain('role="dialog"');
    expect(knowledgeSource).toContain("aria-label=\"Kapak görselini kırp\"");
    expect(knowledgeSource).toContain("Yatay odak");
    expect(knowledgeSource).toContain("Dikey odak");
    expect(knowledgeSource).toContain("Yakınlaştırma");
    expect(knowledgeSource).toContain("Kırpmayı iptal et");
  });
});

describe("markdown authoring and sitemap contracts", () => {
  it("supports markdown preview and predictable slug generation", () => {
    expect(knowledgeSource).toContain("renderMarkdownToHtml");
    expect(knowledgeSource).toContain("slugify(title)");
  });

  it("exposes published knowledge detail and dynamic sitemap routes", () => {
    expect(routerSource).toContain("bySlug: publicProcedure");
    expect(routerSource).toContain("getPublishedKnowledgePostBySlug");
  });
});

describe("rich text and advanced media upload", () => {
  it("supports drag and drop with local preview before project upload", () => {
    expect(projectSource).toContain("onDrop");
    expect(projectSource).toContain("URL.createObjectURL(file)");
    expect(projectSource).toContain("Görsel seçin veya sürükleyin");
  });

  it("refreshes public published caches after admin changes", () => {
    expect(projectSource).toContain("utils.projects.published.invalidate()");
    expect(knowledgeSource).toContain("utils.knowledge.published.invalidate()");
  });
});

describe("project form validation guidance", () => {
  it("identifies required fields and gives correction hints", () => {
    expect(projectSource).toContain("validateProjectForm");
    expect(projectSource).toContain("URL anahtarı zorunludur");
    expect(projectSource).toContain("Yalnızca küçük harf, rakam ve tire kullanın");
    expect(projectSource).toContain("Önce görselini seçin veya sürükleyerek yükleyin");
    expect(projectSource).toContain("Sonra görselini seçin veya sürükleyerek yükleyin");
  });

  it("renders an error summary, aria-invalid state, and focuses the first invalid field", () => {
    expect(projectSource).toContain("admin-form-summary");
    expect(projectSource).toContain("aria-invalid");
    expect(projectSource).toContain("requestAnimationFrame");
    expect(projectSource).toContain("document.getElementById(`${String(firstErrorKey)}-field`)");
  });
});

describe("new project authoring assistance", () => {
  it("generates a Turkish-character-safe slug from the title until the slug is edited", () => {
    expect(projectSource).toContain("function toSlug");
    expect(projectSource).toContain("nextValue.slug = toSlug(String(next))");
    expect(projectSource).toContain("setSlugTouched(true)");
    expect(projectSource).toContain("toLocaleLowerCase(\"tr-TR\")");
  });

  it("persists and restores a local draft without sending it to the server", () => {
    expect(projectSource).toContain("PROJECT_DRAFT_KEY");
    expect(projectEditorSource).toContain("window.localStorage.setItem");
    expect(projectSource).toContain("Taslağı geri yükle");
    expect(projectEditorSource).toContain("window.localStorage.removeItem");
  });

  it("renders the public-style live preview while the form is edited", () => {
    expect(projectSource).toContain("ProjectLivePreview");
    expect(projectSource).toContain("Sitede böyle görünecek");
    expect(projectSource).toContain("BeforeAfterSlider");
    expect(projectSource).toContain("Kapsam");
  });

  it("surfaces duplicate slug conflicts from the server", () => {
    expect(routerSource).toContain("Bu URL anahtarı zaten kullanılıyor");
    expect(routerSource).toContain("getProjectBySlug(input.slug)");
  });
});

  it("clears the local draft after a successful save", () => {
    expect(projectEditorSource).toContain("function clearProjectDraft");
    expect(projectSource).toContain("clearProjectDraft(); setForm(null)");
  });

describe("project validation error mapping", () => {
  it("matches the server minimum length and translates Zod detail errors", () => {
    expect(projectSource).toContain("value.detail.trim().length < 10");
    expect(projectSource).toContain("Kısa açıklama en az 10 karakter olmalıdır");
    expect(projectSource).toContain("formatProjectMutationError");
    expect(projectSource).toContain("issue?.path?.includes(\"detail\")");
  });
});

describe("project form feedback and save summary", () => {
  it("renders live character counts for all text fields", () => {
    expect(projectSource).toContain("function CharacterCount");
    expect(projectSource).toContain("value={value.title} max={220}");
    expect(projectSource).toContain("value={value.detail} max={500}");
    expect(projectSource).toContain("value={value.scope} max={800}");
    expect(projectSource).toContain("value={value.systems} max={800}");
    expect(projectSource).toContain("value={value.results} max={800}");
  });

  it("focuses and centers the server-reported invalid field", () => {
    expect(projectSource).toContain("function focusFormError");
    expect(projectSource).toContain("scrollIntoView({ behavior: \"smooth\", block: \"center\"");
    expect(projectSource).toContain("focus({ preventScroll: true })");
  });

  it("shows a saved project summary with a public preview link", () => {
    expect(projectSource).toContain("function SavedProjectSummary");
    expect(projectSource).toContain("Taslak önizlemeyi aç");
    expect(projectSource).toContain("/projeler#");
    expect(projectSource).toContain("setSavedProject(project)");
  });
});

describe("project publication quality guidance", () => {
  it("blocks placeholder content and requires meaningful published descriptions", () => {
    expect(projectSource).toContain("PLACEHOLDER_PROJECT_TEXT");
    expect(projectSource).toContain("Yayın için daha açıklayıcı bir proje başlığı yazın.");
    expect(projectSource).toContain("Yayın için yapılan işi ve sonucu en az 30 karakterle açıklayın.");
    expect(projectSource).toContain("Yayınlamadan önce test metinlerini gerçek proje bilgileriyle değiştirin.");
  });
});
