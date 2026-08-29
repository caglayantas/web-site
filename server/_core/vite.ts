import express from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: any, server: Server) {
  const serverOptions = { middlewareMode: true, hmr: { server }, allowedHosts: true as const };
  const vite = await createViteServer({ ...viteConfig, configFile: false, server: serverOptions, appType: "custom" });
  app.use(vite.middlewares);
  app.use("*", async (req: any, res: any, next: any) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(import.meta.dirname, "../..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) { vite.ssrFixStacktrace(e as Error); next(e); }
  });
}

const routeMetadata: Record<string, { title: string; description: string; image?: string }> = {
  "/": { title: "Perla Marine | Tekne ve Yat Bakım-Onarım", description: "Perla Marine, tekne ve yatlar için bakım-onarım, marin elektrik, kompozit, motor-tahrik, dümen ve mekanik tesisat çözümleri sunar." },
  "/hakkimizda": { title: "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis", description: "Perla Marine’in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu ve teknik servis çalışma standardını keşfedin." },
  "/hizmetler": { title: "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım", description: "Kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve tekneye özel bakım çözümlerini inceleyin." },
  "/projeler": { title: "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları", description: "Perla Marine’in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin." },
  "/teknik-bilgiler": { title: "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri", description: "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberleri." },
  "/iletisim": { title: "İletişim | Perla Marine Tekne Teknik Check-up ve Servis", description: "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın." },
  "/sss": { title: "SSS | Perla Marine Tekne Bakım ve Teknik Servis", description: "Perla Marine tekne bakım-onarım, marin elektrik, lityum BMS, motor-tahrik ve mekanik tesisat hizmetleri hakkında sık sorulan sorular." },
};
const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export function serveStatic(app: any) {
  // Vite copies client/public into dist/public. Serving server/public in production
  // was the reason the /manus-storage photos returned 404.
  const distPath = path.resolve(import.meta.dirname, "../..", "dist", "public");
  if (!fs.existsSync(distPath)) console.error(`Could not find the build directory: ${distPath}`);
  app.use(express.static(distPath, { maxAge: "1d", setHeaders: (res: any, filePath: string) => {
    if (filePath.includes(`${path.sep}assets${path.sep}`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  }}));
  app.use("*", (req: any, res: any) => {
    const requestedPath = (req.originalUrl.split("?")[0].replace(/\/$/, "") || "/");
    // Never let the SPA fallback swallow static files such as /manus-storage/*.webp.
    if (requestedPath.startsWith("/manus-storage/") || requestedPath.startsWith("/assets/")) return res.status(404).end();
    const matched = routeMetadata[requestedPath] || (requestedPath.startsWith("/teknik-bilgiler/") ? routeMetadata["/teknik-bilgiler"] : requestedPath.startsWith("/projeler/") ? routeMetadata["/projeler"] : null);
    const indexPath = path.resolve(distPath, "index.html");
    if (!matched) return res.sendFile(indexPath);
    let html = fs.readFileSync(indexPath, "utf-8");
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(matched.title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(matched.description)}" />`);
    const canonical = `https://www.perlamarine.com${requestedPath === "/" ? "/" : requestedPath}`;
    const image = matched.image || "https://www.perlamarine.com/manus-storage/perla-hero-medium-yacht-service_7ccec84c.jpg";
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
    html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(matched.title)}" />`);
    html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(matched.description)}" />`);
    html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
    html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`);
    html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", url: canonical, name: matched.title, description: matched.description, inLanguage: "tr-TR" }).replace(/</g, "\\u003c")}</script></head>`);
    return res.type("html").send(html);
  });
}
