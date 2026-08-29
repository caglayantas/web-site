import "dotenv/config";
import express from "express";
import net from "net";
import path from "path";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { setupVite } from "./vite";
import { buildSitemapXml } from "../sitemap";
import { assertProductionEnv } from "./env";

const SUPABASE_URL = (process.env.VITE_SUPABASE_URL || "https://zroktbqjiyutdikwxbzk.supabase.co").trim();
const SUPABASE_KEY = (process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_7gwgIzWZ3n1w04RRCM7q9g_P-oFGkSO").trim();

const securityHeaders = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self' https://wa.me; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://zroktbqjiyutdikwxbzk.supabase.co; object-src 'none';");
  }
  next();
};

export function createApp() {
  assertProductionEnv();
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  app.use(express.json({ limit: "16mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));

  // Public contact endpoint. It uses the Supabase publishable/anon key only;
  // authorization is enforced by the contact_messages INSERT RLS policy.
  app.post("/api", async (req, res) => {
    try {
      const body = req.body || {};
      const name = String(body.name || "").trim();
      const email = String(body.email || "").trim();
      const service = String(body.service || "").trim();
      const message = String(body.message || "").trim();
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || !service || !message || body.consent !== true) {
        res.status(400).json({ success: false, error: "Geçersiz veya eksik form bilgisi." });
        return;
      }
      const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: "POST",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ name, email, service, message, consent: true }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error(`[ContactAPI] Supabase ${response.status}: ${detail}`);
        res.status(502).json({ success: false, error: "İletişim servisi şu anda kullanılamıyor." });
        return;
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("[ContactAPI] failed:", error);
      res.status(500).json({ success: false, error: "Sunucu hatası." });
    }
  });

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/sitemap.xml", async (_req, res) => {
    try { res.type("application/xml").send(await buildSitemapXml()); } catch { res.status(503).type("text/plain").send("Sitemap temporarily unavailable"); }
  });
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(process.cwd(), "dist", "public");
    app.use(express.static(staticPath, { index: "index.html" }));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/") || req.path === "/api" || req.path === "/sitemap.xml") return next();
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }
  return app;
}

export const app = createApp();

async function startServer() {
  const server = createServer(app);
  if (process.env.NODE_ENV !== "production") await setupVite(app, server);
  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  const isPortAvailable = (port: number): Promise<boolean> => new Promise((resolve) => { const testServer = net.createServer(); testServer.once("error", () => resolve(false)); testServer.listen(port, () => testServer.close(() => resolve(true))); });
  let port = preferredPort;
  for (let current = preferredPort; current < preferredPort + 20; current++) if (await isPortAvailable(current)) { port = current; break; }
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
if (process.env.NODE_ENV !== "production") startServer().catch((error) => { console.error("[Server] Failed to start:", error); process.exit(1); });
