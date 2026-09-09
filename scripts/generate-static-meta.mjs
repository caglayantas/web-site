// Generates a static dist/public/<route>/index.html — with correct
// <title>/meta/OG tags baked in — for:
//   1. every published service   (/hizmetler/<slug>)
//   2. every published project   (/projeler/<slug>)
//   3. every published knowledge post (/teknik-bilgiler/<slug>)
//   4. the core marketing pages  (/hizmetler, /iletisim, /hakkimizda, ...)
//
// Why: this is a client-rendered SPA, so without this step the raw HTML
// served for EVERY route is identical — the generic homepage title and
// description. Search engines that execute JS eventually see the right
// per-page content, but (a) that costs a render pass and can delay/dilute
// indexing of money pages, and (b) link-preview crawlers (WhatsApp,
// Facebook, Twitter/X, LinkedIn, Slack, etc.) never run JS at all — they
// only read the first HTML response. This step fixes both.
//
// IMPORTANT: keep STATIC_PAGES below in sync with the `metadata` map in
// client/src/components/PageHead.tsx — this script can't import that file
// (it runs as plain Node after the Vite build), so the two are duplicated
// by hand. If you change a title/description in PageHead.tsx, mirror it
// here too.
//
// Runs after `vite build` so it can use dist/public/index.html as the
// template and only needs to swap the <head> tags per page.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim() || "https://zroktbqjiyutdikwxbzk.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY?.trim() || "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";
const SITE_URL = (process.env.PUBLIC_SITE_URL?.trim() || "https://www.perlamarine.com").replace(/\/+$/, "");

const DIST_PUBLIC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "dist", "public");
const TEMPLATE_PATH = path.join(DIST_PUBLIC, "index.html");

const escapeHtml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const absoluteImage = (image) => (image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/manus-storage/perla-hero-medium-yacht-service_7ccec84c_3e23263b.webp`);

// Mirrors the `metadata` map in client/src/components/PageHead.tsx.
// path: "" means the site root (dist/public/index.html itself).
const STATIC_PAGES = [
  { path: "hakkimizda", title: "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis", description: "Perla Marine'in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu ve teknik servis çalışma standardını keşfedin." },
  { path: "hizmetler", title: "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım", description: "Kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve tekneye özel bakım çözümlerini inceleyin." },
  { path: "projeler", title: "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları", description: "Perla Marine'in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin." },
  { path: "teknik-bilgiler", title: "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri", description: "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberleri." },
  { path: "iletisim", title: "İletişim | Perla Marine Tekne Teknik Check-up ve Servis", description: "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine'e aktarın." },
  { path: "sss", title: "SSS | Perla Marine Tekne Bakım ve Teknik Servis", description: "Perla Marine tekne bakım-onarım ve teknik servis hizmetleri hakkında sık sorulan sorular." },
  { path: "hizmet-bolgelerimiz", title: "Hizmet Bölgelerimiz | Perla Marine Tekne Bakım ve Onarım", description: "Perla Marine'in İzmir merkezli olarak Ege, Akdeniz ve Marmara kıyılarında hizmet verdiği bölgeleri inceleyin." },
  { path: "referanslarimiz", title: "Referanslarımız | Perla Marine Tekne Bakım ve Onarım", description: "Perla Marine'in bugüne kadar hizmet verdiği tekne sahipleri ve iş ortaklarından referanslar." },
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
  const fullTitle = skipTitleSuffix ? title : `${title} | Perla Marine`;
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

async function build() {
  if (!existsSync(TEMPLATE_PATH)) {
    console.log("[static-meta] dist/public/index.html not found, skipping (run after vite build)");
    return;
  }
  const template = readFileSync(TEMPLATE_PATH, "utf-8");

  const [projects, posts, services] = await Promise.all([
    fetchPublished("projects", "slug,title,detail,after_image"),
    fetchPublished("knowledge_posts", "slug,title,excerpt,cover_image"),
    fetchPublished("services", "slug,title,description,image"),
  ]);

  let written = 0;

  // Core static marketing pages (/hizmetler, /iletisim, /hakkimizda, ...)
  for (const page of STATIC_PAGES) {
    const dir = path.join(DIST_PUBLIC, page.path);
    mkdirSync(dir, { recursive: true });
    const html = renderPage(template, {
      title: page.title,
      description: page.description,
      canonical: `${SITE_URL}/${page.path}`,
      image: absoluteImage(null),
      imageAlt: "Perla Marine tekne bakım ve teknik servis çalışması",
      skipTitleSuffix: true, // these titles already end in "| Perla Marine ..."
    });
    writeFileSync(path.join(dir, "index.html"), html, "utf-8");
    written++;
  }

  // Individual service pages (/hizmetler/<slug>) — the actual money pages.
  for (const service of services) {
    const dir = path.join(DIST_PUBLIC, "hizmetler", service.slug);
    mkdirSync(dir, { recursive: true });
    const html = renderPage(template, {
      title: service.title,
      description: service.description,
      canonical: `${SITE_URL}/hizmetler/${service.slug}`,
      image: absoluteImage(service.image),
      imageAlt: `${service.title} hizmeti`,
    });
    writeFileSync(path.join(dir, "index.html"), html, "utf-8");
    written++;
  }

  for (const project of projects) {
    const dir = path.join(DIST_PUBLIC, "projeler", project.slug);
    mkdirSync(dir, { recursive: true });
    const html = renderPage(template, {
      title: project.title,
      description: project.detail,
      canonical: `${SITE_URL}/projeler/${project.slug}`,
      image: absoluteImage(project.after_image),
      imageAlt: `${project.title} bakım projesi`,
    });
    writeFileSync(path.join(dir, "index.html"), html, "utf-8");
    written++;
  }

  for (const post of posts) {
    const dir = path.join(DIST_PUBLIC, "teknik-bilgiler", post.slug);
    mkdirSync(dir, { recursive: true });
    const html = renderPage(template, {
      title: post.title,
      description: post.excerpt,
      canonical: `${SITE_URL}/teknik-bilgiler/${post.slug}`,
      image: absoluteImage(post.cover_image),
      imageAlt: `${post.title} kapak görseli`,
    });
    writeFileSync(path.join(dir, "index.html"), html, "utf-8");
    written++;
  }

  console.log(`[static-meta] wrote ${written} pages with page-specific meta tags`);
}

build();
