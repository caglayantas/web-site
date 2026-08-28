import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { buildSitemapXml } from "../sitemap";
import { assertProductionEnv } from "./env";

const securityHeaders = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  const analyticsOrigin = (() => {
    try {
      return new URL(process.env.VITE_ANALYTICS_ENDPOINT || "").origin;
    } catch {
      return "";
    }
  })();
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    const externalAnalytics = analyticsOrigin ? ` ${analyticsOrigin}` : "";
    res.setHeader("Content-Security-Policy", `default-src 'self'; base-uri 'self'; frame-ancestors 'self'; form-action 'self' https://wa.me; img-src 'self' data: blob: https://d36hbw14aib5lz.cloudfront.net; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'${externalAnalytics}; connect-src 'self'${externalAnalytics}; object-src 'none'; upgrade-insecure-requests`);
  }
  next();
};

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  assertProductionEnv();
  const app = express();
  const server = createServer(app);
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(securityHeaders);
  // Keep enough room for the authenticated base64 image upload mutation without
  // allowing unnecessarily large bodies on every public endpoint.
  app.use(express.json({ limit: "16mb" }));
  app.use(express.urlencoded({ limit: "2mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      res.type("application/xml").send(await buildSitemapXml());
    } catch (error) {
      console.error("[SEO] Sitemap generation failed", error);
      res.status(503).type("text/plain").send("Sitemap temporarily unavailable");
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
