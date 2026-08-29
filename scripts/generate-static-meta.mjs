// Generates dist/public/projeler/<slug>/index.html and
// dist/public/teknik-bilgiler/<slug>/index.html for every published
// project / knowledge post, with correct <title>/meta/OG tags baked in.
//
// Why: this is a client-rendered SPA, so the raw HTML served for every
// route is identical (the generic homepage tags). Search engines that
// execute JS eventually see the right content, but link-preview crawlers
// (WhatsApp, Facebook, Twitter/X, LinkedIn, Slack, etc.) do NOT run JS —
// they only read the first HTML response. Without this, sharing a project
// or article link always shows the generic "Perla Marine" homepage card.
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

function renderPage(template, { title, description, canonical, image, imageAlt }) {
  let html = template;
  const fullTitle = `${title} | Perla Marine`;
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

  const [projects, posts] = await Promise.all([
    fetchPublished("projects", "slug,title,detail,after_image"),
    fetchPublished("knowledge_posts", "slug,title,excerpt,cover_image"),
  ]);

  let written = 0;

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
