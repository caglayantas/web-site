// Generates client/public/sitemap.xml at build time from published Supabase content.
// Runs before `vite build` so the static file is included in the output automatically.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim() || "https://zroktbqjiyutdikwxbzk.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY?.trim() || "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";
const SITE_URL = (process.env.PUBLIC_SITE_URL?.trim() || "https://www.perlamarine.com").replace(/\/+$/, "");

const staticRoutes = ["/", "/hakkimizda", "/hizmetler", "/projeler", "/teknik-bilgiler", "/iletisim", "/sss", "/kvkk", "/gizlilik", "/cerez", "/site-haritasi"];

const xmlEscape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const formatDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : undefined);

async function fetchTable(table, select, order) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&status=eq.published&order=${order}`;
  try {
    const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function build() {
  const [projects, posts] = await Promise.all([
    fetchTable("projects", "slug,updated_at", "updated_at.desc"),
    fetchTable("knowledge_posts", "slug,featured,published_at,updated_at", "published_at.desc"),
  ]);

  const entries = [
    ...staticRoutes.map((route) => ({ loc: `${SITE_URL}${route}`, priority: route === "/" ? "1.0" : route === "/teknik-bilgiler" ? "0.9" : "0.7", changefreq: route === "/" ? "weekly" : "monthly" })),
    ...projects.map((p) => ({ loc: `${SITE_URL}/projeler/${p.slug}`, priority: "0.7", changefreq: "monthly", lastmod: formatDate(p.updated_at) })),
    ...posts.map((p) => ({ loc: `${SITE_URL}/teknik-bilgiler/${p.slug}`, priority: p.featured ? "0.8" : "0.7", changefreq: "monthly", lastmod: formatDate(p.published_at ?? p.updated_at) })),
  ];

  const unique = Array.from(new Map(entries.map((e) => [e.loc, e])).values());
  const urls = unique.map((e) => {
    const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "";
    return `  <url><loc>${xmlEscape(e.loc)}</loc>${lastmod}<changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "client", "public", "sitemap.xml");
  writeFileSync(outPath, xml, "utf-8");
  console.log(`[sitemap] wrote ${unique.length} urls to ${outPath}`);
}

build();
