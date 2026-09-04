// Vercel serverless function that generates sitemap.xml live, on every request,
// by querying Supabase directly. This replaces the old build-time-generated
// static file so newly published content (via the admin panel) appears in the
// sitemap immediately, without waiting for the next code deployment.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL?.trim() || "https://zroktbqjiyutdikwxbzk.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY?.trim() || "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO";
const SITE_URL = (process.env.PUBLIC_SITE_URL?.trim() || "https://www.perlamarine.com").replace(/\/+$/, "");

const staticRoutes = ["/", "/hakkimizda", "/hizmetler", "/hizmet-bolgelerimiz", "/projeler", "/referanslarimiz", "/teknik-bilgiler", "/iletisim", "/sss", "/kvkk", "/gizlilik", "/cerez", "/site-haritasi"];

const xmlEscape = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const formatDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : undefined);
const enPath = (trPath) => (trPath === "/" ? "/en" : `/en${trPath}`);

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

function bilingualEntry({ trPath, enPathValue, priority, changefreq, lastmod }) {
  const trLoc = `${SITE_URL}${trPath}`;
  const enLoc = `${SITE_URL}${enPathValue}`;
  const alternates = [
    { hreflang: "tr", href: trLoc },
    { hreflang: "en", href: enLoc },
    { hreflang: "x-default", href: trLoc },
  ];
  return [
    { loc: trLoc, priority, changefreq, lastmod, alternates },
    { loc: enLoc, priority, changefreq, lastmod, alternates },
  ];
}

export default async function handler(req, res) {
  const [projects, posts] = await Promise.all([
    fetchTable("projects", "slug,updated_at", "updated_at.desc"),
    fetchTable("knowledge_posts", "slug,featured,published_at,updated_at", "published_at.desc"),
  ]);

  const entries = [
    ...staticRoutes.flatMap((route) =>
      bilingualEntry({
        trPath: route,
        enPathValue: enPath(route),
        priority: route === "/" ? "1.0" : route === "/teknik-bilgiler" ? "0.9" : "0.7",
        changefreq: route === "/" ? "weekly" : "monthly",
      })
    ),
    ...projects.flatMap((p) =>
      bilingualEntry({
        trPath: `/projeler/${p.slug}`,
        enPathValue: `/en/projeler/${p.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: formatDate(p.updated_at),
      })
    ),
    ...posts.flatMap((p) =>
      bilingualEntry({
        trPath: `/teknik-bilgiler/${p.slug}`,
        enPathValue: `/en/teknik-bilgiler/${p.slug}`,
        priority: p.featured ? "0.8" : "0.7",
        changefreq: "monthly",
        lastmod: formatDate(p.published_at ?? p.updated_at),
      })
    ),
  ];

  const unique = Array.from(new Map(entries.map((e) => [e.loc, e])).values());
  const urls = unique
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : "";
      const alternates = e.alternates
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}" />`)
        .join("");
      return `  <url><loc>${xmlEscape(e.loc)}</loc>${lastmod}<changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority>${alternates}</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cached at the edge for an hour so frequent crawler hits don't all reach Supabase,
  // while newly published content still appears well within the same day.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
}
