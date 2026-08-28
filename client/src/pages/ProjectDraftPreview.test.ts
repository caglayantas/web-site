import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(new URL("./ProjectDraftPreview.tsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("../../../server/routers.ts", import.meta.url), "utf8");
const adminSource = readFileSync(new URL("./AdminProjects.tsx", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("./ProjectDetail.tsx", import.meta.url), "utf8");

describe("project draft preview", () => {
  it("uses the admin-only preview query and displays a draft status", () => {
    expect(pageSource).toContain("trpc.projects.preview.useQuery");
    expect(pageSource).toContain("TASLAK ÖNİZLEME");
    expect(pageSource).toContain("Yayınlanmadan önce kontrol");
    expect(pageSource).toContain("Taslak kayıt public projeler listesinde gösterilmez.");
  });

  it("renders the complete project presentation with comparison and technical facts", () => {
    expect(pageSource).toContain("<BeforeAfterSlider");
    expect(pageSource).toContain("value.scope");
    expect(pageSource).toContain("value.systems");
    expect(pageSource).toContain("value.results");
    expect(pageSource).toContain("Projeyi düzenle");
  });

  it("registers a dedicated management route and links drafts to it", () => {
    expect(appSource).toContain("/yonetim/projeler/preview/:slug");
    expect(adminSource).toContain("/yonetim/projeler/preview/${encodeURIComponent(project.slug)}");
  });

  it("protects preview reads with adminProcedure and reports missing drafts", () => {
    expect(routerSource).toContain("preview: adminProcedure");
    expect(routerSource).toContain("getProjectPreviewBySlug(input.slug)");
    expect(routerSource).toContain("Taslak proje bulunamadı.");
  });

  it("avoids repeated public detail retries for invalid project slugs", () => {
    expect(detailSource).toContain("retry: false");
    expect(detailSource).toContain("<NotFound />");
  });
});
