import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
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

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, {
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));

  // Fall through to index.html while adapting primary metadata to the requested route.
  app.use("*", (req, res) => {
    const requestedPath = (req.originalUrl.split("?")[0].replace(/\/$/, "") || "/");
    const matched = routeMetadata[requestedPath] || (requestedPath.startsWith("/teknik-bilgiler/") ? routeMetadata["/teknik-bilgiler"] : requestedPath.startsWith("/projeler/") ? routeMetadata["/projeler"] : null);
    const indexPath = path.resolve(distPath, "index.html");
    if (!matched) return res.sendFile(indexPath);
    let html = fs.readFileSync(indexPath, "utf-8");
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(matched.title)}</title>`);
    html = html.replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(matched.description)}" />`);
    html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="https://www.perlamarine.com${requestedPath === "/" ? "/" : requestedPath}" />`);
    html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(matched.title)}" />`);
    const canonical = `https://www.perlamarine.com${requestedPath === "/" ? "/" : requestedPath}`;
    const image = matched.image || "https://www.perlamarine.com/manus-storage/perla-hero-medium-yacht-service_7ccec84c.jpg";
    html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(matched.description)}" />`);
    html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
    html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(matched.title)}" />`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(matched.description)}" />`);
    html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`);
    const pageSchema = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", url: canonical, name: matched.title, description: matched.description, inLanguage: "tr-TR" }).replace(/</g, "\\u003c");
    html = html.replace("</head>", `<script type="application/ld+json">${pageSchema}</script></head>`);
    return res.type("html").send(html);
  });
}
