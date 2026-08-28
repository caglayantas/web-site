import { getPublishedKnowledgePosts, getPublishedProjects } from "./db";

const SITE_URL = (process.env.PUBLIC_SITE_URL?.trim() || "https://www.perlamarine.com").replace(/\/+$/, "");
const staticRoutes = ["/", "/hakkimizda", "/hizmetler", "/projeler", "/teknik-bilgiler", "/iletisim", "/sss", "/kvkk", "/gizlilik", "/cerez", "/site-haritasi"];
const xmlEscape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
const formatDate = (value: Date | null | undefined) => value ? value.toISOString().slice(0, 10) : undefined;

type SitemapEntry = { loc: string; priority: string; changefreq: string; lastmod?: string };

export async function buildSitemapXml() {
  const [posts, projects] = await Promise.all([getPublishedKnowledgePosts(), getPublishedProjects()]);
  const entries: SitemapEntry[] = [
    ...staticRoutes.map((route) => ({ loc: `${SITE_URL}${route}`, priority: route === "/" ? "1.0" : route === "/teknik-bilgiler" ? "0.9" : "0.7", changefreq: route === "/" ? "weekly" : "monthly" })),
    ...projects.map((project) => ({ loc: `${SITE_URL}/projeler/${project.slug}`, priority: "0.7", changefreq: "monthly", lastmod: formatDate(project.updatedAt) })),
    ...posts.map((post) => ({ loc: `${SITE_URL}/teknik-bilgiler/${post.slug}`, priority: post.featured ? "0.8" : "0.7", changefreq: "monthly", lastmod: formatDate(post.publishedAt ?? post.updatedAt) })),
  ];
  const unique = Array.from(new Map(entries.map((entry) => [entry.loc, entry])).values());
  const urls = unique.map((entry) => {
    const lastmod = entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : "";
    return `  <url><loc>${xmlEscape(entry.loc)}</loc>${lastmod}<changefreq>${entry.changefreq}</changefreq><priority>${entry.priority}</priority></url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}
