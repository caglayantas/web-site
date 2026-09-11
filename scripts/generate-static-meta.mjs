// Generates a static dist/public/<route>/index.html — with correct
// <title>/meta/OG tags baked in — for:
//   1. every published service   (/hizmetler/<slug>, + /en/hizmetler/<slug>)
//   2. every published project   (/projeler/<slug>, + /en/projeler/<slug>)
//   3. every published knowledge post (/teknik-bilgiler/<slug>, + /en/...)
//   4. the core marketing pages  (/hizmetler, /iletisim, /hakkimizda, ...)
//      in both Turkish and English (/en/hizmetler, /en/iletisim, ...)
//
// Why: this is a client-rendered SPA, so without this step the raw HTML
// served for EVERY route is identical — the generic homepage title and
// description. Search engines that execute JS eventually see the right
// per-page content, but (a) that costs a render pass and can delay/dilute
// indexing of money pages, and (b) link-preview crawlers (WhatsApp,
// Facebook, Twitter/X, LinkedIn, Slack, etc.) never run JS at all — they
// only read the first HTML response. This step fixes both.
//
// IMPORTANT: keep STATIC_PAGES below in sync with the actual title/
// description each page sets client-side (Home.tsx, corporate/*New.tsx,
// ServiceRegions.tsx, References.tsx, ServiceFAQ.tsx, Legal.tsx) — this
// script can't import those files (it runs as plain Node after the Vite
// build), so the two are duplicated by hand. If you change a title or
// description in one of those files, mirror it here too, or this static
// version and the JS-rendered version will disagree (which is itself a
// "duplicate/inconsistent title" problem for search engines).
//
// Runs after `vite build` so it can use dist/public/index.html as the
// template and only needs to swap the <head> tags per page.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim() || "https://zroktbqjiyutdikwxbzk.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY?.trim() || "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";
const SITE_URL = (process.env.PUBLIC_SITE_URL?.trim() || "https://perlamarine.com").replace(/\/+$/, "");

const DIST_PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "public");
const TEMPLATE_PATH = path.join(DIST_PUBLIC, "index.html");

const escapeHtml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absoluteImage = (image) => (image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/manus-storage/perla-hero-medium-yacht-service_7ccec84c_3e23263b.webp`);
// Matches KnowledgePost.tsx: skip the " | Perla Marine" suffix if the title
// already mentions the brand (e.g. a custom SEO title that includes it).
const withBrand = (title) => (title.toLowerCase().includes("perla marine") ? title : `${title} | Perla Marine`);

// Real client-side title/description for each core page, TR + EN.
// path: "" means the site root (dist/public/index.html / dist/public/en/index.html).
const STATIC_PAGES = [
  {
    path: "",
    tr: { title: "Perla Marine | Tekne ve Yat Bakım-Onarım", description: "Perla Marine; İzmir, Bodrum, Marmaris ve Ege-Akdeniz kıyılarında tekne ve yat sahiplerine mühendislik disipliniyle bakım, onarım, refit ve teknik servis çözümleri sunar." },
    en: { title: "Perla Marine | Boat & Yacht Maintenance and Repair", description: "Perla Marine provides engineering-grade maintenance, repair, refit, and technical service solutions for boats and yachts." },
  },
  {
    path: "hakkimizda",
    tr: { title: "Hakkımızda | Perla Marine Tekne Bakım ve Servis", description: "Perla Marine'in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu, teknik servis misyonunu ve iş yapma standardını keşfedin." },
    en: { title: "About Us | Perla Marine Boat Maintenance & Service", description: "Discover Perla Marine's corporate identity, marine maintenance vision, technical service mission, and working standard." },
  },
  {
    path: "hizmetler",
    tr: { title: "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım", description: "Perla Marine'in kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve özel tekne çözümlerini inceleyin." },
    en: { title: "Services | Perla Marine Boat & Yacht Maintenance and Repair", description: "Explore Perla Marine's composite, marine electrical, electronics, mechanical, propulsion-steering, and boat-specific solutions." },
  },
  {
    path: "projeler",
    tr: { title: "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları", description: "Perla Marine'in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin." },
    en: { title: "Projects | Perla Marine Field Maintenance & Refit Work", description: "Explore Perla Marine's field work on boat and yacht maintenance, refit, electrical, mechanical, and propulsion systems." },
  },
  {
    path: "teknik-bilgiler",
    tr: { title: "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri", description: "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberlerini okuyun." },
    en: { title: "Technical Notes | Perla Marine Maintenance & Service Guides", description: "Read maintenance guides on marine electrical, propulsion, and mechanical systems for boat owners and manufacturer teams." },
  },
  {
    path: "iletisim",
    tr: { title: "İletişim | Perla Marine Tekne Teknik Check-up ve Servis", description: "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine'e aktarın; uygulanabilir sonraki adımı birlikte planlayalım." },
    en: { title: "Contact | Perla Marine Boat Technical Checkup and Service", description: "Tell Perla Marine about your boat's maintenance, repair, electrical, mechanical, or propulsion needs; let's plan the next step together." },
  },
  {
    path: "sss",
    tr: { title: "SSS | Perla Marine Tekne Bakım ve Teknik Servis", description: "Perla Marine'in tekne bakım-onarım, marin elektrik, lityum BMS, motor-tahrik ve mekanik tesisat hizmetleri hakkında sık sorulan soruların yanıtları." },
    en: { title: "FAQ | Perla Marine Boat Maintenance and Technical Service", description: "Answers to frequently asked questions about Perla Marine's boat maintenance and repair, marine electrical, lithium BMS, propulsion, and mechanical services." },
  },
  {
    path: "hizmet-bolgelerimiz",
    tr: { title: "İzmir Tekne Bakım, Bodrum Tekne Tamir | Perla Marine", description: "İzmir tekne bakım, Bodrum tekne tamir, Marmaris ve Kuşadası'nda tekne onarımı. Ege, Akdeniz ve Marmara kıyılarında bakım ve teknik servis hizmeti veriyoruz." },
    en: { title: "Coverage Areas — İzmir, Bodrum, Antalya | Perla Marine", description: "Perla Marine provides boat maintenance and repair at marinas along the İzmir, Bodrum, Marmaris, Kuşadası, Antalya, and Marmara coasts." },
  },
  {
    path: "referanslarimiz",
    tr: { title: "Referanslarımız — Çalıştığımız Firmalar | Perla Marine", description: "Perla Marine'in çalıştığı firmaları ve tekne sahiplerini, onlar için gerçekleştirdiği bakım ve onarım kapsamını inceleyin." },
    en: { title: "References — Companies We've Worked With | Perla Marine", description: "See the companies and boat owners Perla Marine has worked with, and the maintenance and repair scope carried out for each." },
  },
  {
    path: "kvkk",
    tr: { title: "KVKK Aydınlatma Metni | Perla Marine", description: "Perla Marine iletişim taleplerinde işlenen kişisel verilere ilişkin KVKK aydınlatma metni." },
    en: { title: "KVKK Notice | Perla Marine", description: "KVKK notice on personal data processed through Perla Marine contact requests." },
  },
  {
    path: "gizlilik",
    tr: { title: "Gizlilik Politikası | Perla Marine", description: "Perla Marine web sitesi ve iletişim kanallarında bilgi güvenliği ve gizlilik ilkeleri." },
    en: { title: "Privacy Policy | Perla Marine", description: "Information security and privacy principles on the Perla Marine website and communication channels." },
  },
  {
    path: "cerez",
    tr: { title: "Çerez Politikası | Perla Marine", description: "Perla Marine web sitesinde çerezlerin kullanımına ilişkin bilgilendirme." },
    en: { title: "Cookie Policy | Perla Marine", description: "Information about the use of cookies on the Perla Marine website." },
  },
  {
    path: "site-haritasi",
    tr: { title: "Site Haritası | Perla Marine", description: "Perla Marine ana sayfa, hizmet, proje, Teknik Bilgiler, SSS ve iletişim sayfalarına hızlı erişim." },
    en: { title: "Sitemap | Perla Marine", description: "Quick access to Perla Marine's home, services, projects, technical notes, FAQ, and contact pages." },
  },
];

async function fetchPublished(table, select) {
  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&status=eq.published`;
    const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function renderPage(template, { title, description, canonical, image, imageAlt, skipTitleSuffix = false }) {
  let html = template;
  const fullTitle = skipTitleSuffix ? title : withBrand(title);
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`);
  html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`);
  html = html.replace(/<meta property="og:image:alt" content=".*?" \/>/, `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`);
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  return html;
}

function writePage(routePath, { title, description, image, imageAlt }, template) {
  const dir = routePath ? path.join(DIST_PUBLIC, routePath) : DIST_PUBLIC;
  mkdirSync(dir, { recursive: true });
  const html = renderPage(template, {
    title,
    description,
    canonical: `${SITE_URL}/${routePath}`,
    image: absoluteImage(image),
    imageAlt,
    skipTitleSuffix: true, // titles above already include "| Perla Marine"
  });
  writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

async function build() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.log("[static-meta] dist/public/index.html not found, skipping (run after vite build)");
    return;
  }
  const template = readFileSync(TEMPLATE_PATH, "utf-8");

  const [projects, posts, services] = await Promise.all([
    fetchPublished("projects", "slug,title,title_en,detail,detail_en,after_image"),
    fetchPublished("knowledge_posts", "slug,title,title_en,excerpt,excerpt_en,seo_title,seo_title_en,seo_description,seo_description_en,cover_image"),
    fetchPublished("services", "slug,title,title_en,description,description_en,image"),
  ]);

  let written = 0;

  // Core static marketing pages, Turkish + English (/hizmetler, /en/hizmetler, ...)
  for (const page of STATIC_PAGES) {
    writePage(page.path, { ...page.tr, image: null, imageAlt: "Perla Marine tekne bakım ve teknik servis çalışması" }, template);
    written++;
    const enRoute = page.path ? `en/${page.path}` : "en";
    writePage(enRoute, { ...page.en, image: null, imageAlt: "Perla Marine boat maintenance and technical service" }, template);
    written++;
  }

  // Individual service pages (/hizmetler/<slug>) — the actual money pages.
  for (const service of services) {
    const dir = path.join(DIST_PUBLIC, "hizmetler", service.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), renderPage(template, {
      title: service.title,
      description: service.description,
      canonical: `${SITE_URL}/hizmetler/${service.slug}`,
      image: absoluteImage(service.image),
      imageAlt: `${service.title} hizmeti`,
    }), "utf-8");
    written++;
    if (service.title_en) {
      const enDir = path.join(DIST_PUBLIC, "en", "hizmetler", service.slug);
      mkdirSync(enDir, { recursive: true });
      writeFileSync(path.join(enDir, "index.html"), renderPage(template, {
        title: service.title_en,
        description: service.description_en || service.description,
        canonical: `${SITE_URL}/en/hizmetler/${service.slug}`,
        image: absoluteImage(service.image),
        imageAlt: `${service.title_en} service`,
      }), "utf-8");
      written++;
    }
  }

  for (const project of projects) {
    const dir = path.join(DIST_PUBLIC, "projeler", project.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), renderPage(template, {
      title: project.title,
      description: project.detail,
      canonical: `${SITE_URL}/projeler/${project.slug}`,
      image: absoluteImage(project.after_image),
      imageAlt: `${project.title} bakım projesi`,
    }), "utf-8");
    written++;
    if (project.title_en) {
      const enDir = path.join(DIST_PUBLIC, "en", "projeler", project.slug);
      mkdirSync(enDir, { recursive: true });
      writeFileSync(path.join(enDir, "index.html"), renderPage(template, {
        title: project.title_en,
        description: project.detail_en || project.detail,
        canonical: `${SITE_URL}/en/projeler/${project.slug}`,
        image: absoluteImage(project.after_image),
        imageAlt: `${project.title_en} maintenance project`,
      }), "utf-8");
      written++;
    }
  }

  for (const post of posts) {
    // Matches client/src/lib/markdown.ts:getKnowledgeMeta — a custom SEO
    // title/description (if set in the admin panel) wins over the plain
    // article title/excerpt. Keep this in sync if that helper changes.
    const trTitle = post.seo_title?.trim() || post.title;
    const trDescription = post.seo_description?.trim() || post.excerpt;
    const dir = path.join(DIST_PUBLIC, "teknik-bilgiler", post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), renderPage(template, {
      title: trTitle,
      description: trDescription,
      canonical: `${SITE_URL}/teknik-bilgiler/${post.slug}`,
      image: absoluteImage(post.cover_image),
      imageAlt: `${trTitle} kapak görseli`,
    }), "utf-8");
    written++;
    if (post.title_en) {
      const enTitle = post.seo_title_en?.trim() || post.title_en;
      const enDescription = post.seo_description_en?.trim() || post.excerpt_en || trDescription;
      const enDir = path.join(DIST_PUBLIC, "en", "teknik-bilgiler", post.slug);
      mkdirSync(enDir, { recursive: true });
      writeFileSync(path.join(enDir, "index.html"), renderPage(template, {
        title: enTitle,
        description: enDescription,
        canonical: `${SITE_URL}/en/teknik-bilgiler/${post.slug}`,
        image: absoluteImage(post.cover_image),
        imageAlt: `${enTitle} cover image`,
      }), "utf-8");
      written++;
    }
  }

  console.log(`[static-meta] wrote ${written} pages with page-specific meta tags`);
}

build();
