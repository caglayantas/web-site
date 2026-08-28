import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");
const sliderSource = readFileSync(new URL("../components/BeforeAfterSlider.tsx", import.meta.url), "utf8");
const corporateSource = readFileSync(new URL("./CorporatePages.tsx", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../components/SiteHeader.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../index.css", import.meta.url), "utf8");
const indexHtml = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const faqSource = readFileSync(new URL("../components/ServiceFAQ.tsx", import.meta.url), "utf8");

describe("homepage before-after slider", () => {
  it("keeps a labelled slider handle and direct visual dragging", () => {
    expect(sliderSource).toContain('role="slider"');
    expect(sliderSource).toContain("onPointerDownCapture={handleSurfacePointerDown}");
    expect(sliderSource).toContain("onPointerDown={startDrag}");
    expect(sliderSource).toContain("event.currentTarget.setPointerCapture(event.pointerId)");
  });

  it("dismisses the hint after the first pointer, keyboard, or range interaction", () => {
    expect(sliderSource).toContain("const [showHint, setShowHint] = useState(true)");
    expect(sliderSource).toContain("dismissHint();");
    expect(sliderSource).toContain("{showHint &&");
    expect(sliderSource).toContain("onPointerDown={startDrag}");
  });

  it("shows desktop and mobile hint copy with a non-arrow icon", () => {
    expect(sliderSource).toContain("Tutarak sağa-sola sürükleyin");
    expect(sliderSource).toContain("Sürükleyin");
    expect(sliderSource).toContain("MoveHorizontal");
    expect(sliderSource).not.toContain("before-after-slider__arrow");
  });

  it("keeps keyboard movement bounded and accessible", () => {
    expect(sliderSource).toContain("Math.max(4, current - 5)");
    expect(sliderSource).toContain("Math.min(96, current + 5)");
    expect(sliderSource).toContain("ArrowLeft");
    expect(sliderSource).toContain("ArrowRight");
  });
});

describe("homepage SEO metadata", () => {
  it("includes Turkish title, description, canonical, social metadata, and organization schema", () => {
    expect(indexHtml).toContain('<html lang="tr">');
    expect(indexHtml).toContain('rel="canonical" href="https://www.perlamarine.com/"');
    expect(indexHtml).toContain('property="og:title"');
    expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"');
    expect(indexHtml).toContain('"@type": "Organization"');
    expect(indexHtml).toContain('"telephone": "+90 545 435 32 01"');
    expect(indexHtml).toContain('<title>Perla Marine | Tekne ve Yat Bakım-Onarım</title>');
    expect(indexHtml).toContain('name="description"');
    expect(indexHtml).toContain('Perla Marine, tekne ve yatlar için bakım-onarım');
  });
});

describe("dynamic FAQ SEO section", () => {
  it("reads published FAQ content and emits FAQPage structured data", () => {
    expect(faqSource).toContain("trpc.faq.published.useQuery");
    expect(faqSource).toContain('"@type": "FAQPage"');
    expect(faqSource).toContain("acceptedAnswer");
    expect(faqSource).toContain("Bakım veya onarım talebi");
  });
});

describe("homepage Technical Information hover contrast", () => {
  it("keeps journal card text readable on hover and focus", () => {
    expect(cssSource).toContain(".journal-card:hover, .journal-card:focus-visible { color: var(--navy)");
    expect(cssSource).toContain(".journal-card:hover h3, .journal-card:focus-visible h3 { color: var(--navy)");
    expect(cssSource).toContain(".journal-card:hover p, .journal-card:focus-visible p { color: #647287");
  });
});

describe("homepage compact contrast layout", () => {
  it("wraps the homepage in a compact layout and removes standalone divider components", () => {
    expect(source).toContain('className="home-page-compact"');
    expect(source).not.toContain("SectionDivider");
  });
});

describe("homepage carousel, process strip, and mobile CTA", () => {
  it("keeps projects, before-after, and process steps in one compact block", () => {
    expect(source).toContain('className="home-project-block"');
    expect(source.indexOf('id="projeler"')).toBeLessThan(source.indexOf('id="once-sonra"'));
    expect(source.indexOf('id="once-sonra"')).toBeLessThan(source.indexOf('className="home-process-strip"'));
    expect(cssSource).toContain(".home-project-block");
  });

  it("renders the three latest projects without circular arrow controls", () => {
    expect(source).toContain("trpc.projects.latestPublished.useQuery()");
    expect(source).toContain('filter((project) => project.status === "published")');
    expect(source).toContain("Son üç proje kartı");
    expect(source).not.toContain("aria-label=\"Önceki projeler\"");
    expect(source).not.toContain("aria-label=\"Sonraki projeler\"");
    expect(cssSource).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  });

  it("adds a concise step-by-step process strip without numeric labels", () => {
    expect(source).toContain("Nasıl çalışıyoruz?");
    expect(source).toContain("processSteps");
    expect(source).toContain("home-process-strip__steps");
    expect(source).not.toContain(">01<");
  });

  it("keeps a second simple hero CTA and improves mobile menu actions", () => {
    expect(source).toContain("Teknenizi anlatın");
    expect(headerSource).toContain("mobile-nav__intro");
    expect(headerSource).toContain("mobile-nav__actions");
  });
});

describe("database-backed project pages", () => {
  it("queries published projects and maps image fields to the public comparison model", () => {
    expect(corporateSource).toContain("trpc.projects.published.useQuery()");
    expect(corporateSource).toContain("before: project.beforeImage");
    expect(corporateSource).toContain("after: project.afterImage");
    expect(corporateSource).toContain("<BeforeAfterSlider");
  });

  it("keeps homepage project cards connected to latest published project data", () => {
    expect(source).toContain("trpc.projects.latestPublished.useQuery()");
    expect(source).toContain("const displayProjects");
    expect(source).toContain("<BeforeAfterSlider");
  });

  it("keeps the slider surface free from navigation while preserving the project section link", () => {
    expect(source).toContain("<article className=\"home-before-after-card\"");
    expect(source).toContain("Daha fazlasını gör");
    expect(source).not.toContain("<a href={`${SITE_URL}/projeler#${project.slug}`} className=\"home-before-after-card\"");
  });

  it("does not replace a successful empty published response with static content", () => {
    expect(source).toContain("projects.isError ? projectFallback : (projects.data ?? [])");
    expect(corporateSource).toContain("publishedProjects.isError ? projectCards : (publishedProjects.data ?? [])");
    expect(corporateSource).toContain("posts.isError ? knowledgeCards.map");
  });

  it("renders explicit loading and empty states for homepage data sections", () => {
    expect(source).toContain("projects.isLoading");
    expect(source).toContain("knowledge.isLoading");
    expect(source).toContain("home-content-skeleton");
    expect(source).toContain("home-content-empty");
  });

  it("keeps project lightbox previous navigation directional", () => {
    expect(corporateSource).toContain("current - 1 + 2");
    expect(corporateSource).toContain("aria-label=\"Önceki görsel\"");
  });

  it("routes the footer knowledge link to Teknik Bilgiler", () => {
    const footerSource = readFileSync(new URL("../components/SiteFooter.tsx", import.meta.url), "utf8");
    expect(footerSource).toContain("/teknik-bilgiler");
    expect(footerSource).toContain(">Teknik Bilgiler</a>");
  });

  it("uses the real contact mutation instead of a local-only success state", () => {
    expect(corporateSource).toContain("trpc.contact.submit.useMutation()");
    expect(corporateSource).toContain("submitContact.mutateAsync({ ...values, website: \"\" })");
    expect(corporateSource).toContain("submitContact.isPending");
  });
});
