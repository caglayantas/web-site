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
import { setupVite, serveStatic } from "./vite";
import { buildSitemapXml } from "../sitemap";
import { assertProductionEnv } from "./env";

const securityHeaders = (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let analyticsOrigin = "";

  try {
    const analyticsUrl = process.env.VITE_ANALYTICS_ENDPOINT || "";

    if (analyticsUrl) {
      analyticsOrigin = new URL(analyticsUrl).origin;
    }
  } catch {
    analyticsOrigin = "";
  }

  res.removeHeader("X-Powered-By");

  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "SAMEORIGIN"
  );

  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  res.setHeader(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    let contentSecurityPolicy =
      "default-src 'self'; " +
      "base-uri 'self'; " +
      "frame-ancestors 'self'; " +
      "form-action 'self' https://wa.me; " +
      "img-src 'self' data: blob: https://d36hbw14aib5lz.cloudfront.net; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "script-src 'self' 'unsafe-inline'; " +
      "connect-src 'self'; " +
      "object-src 'none'; " +
      "upgrade-insecure-requests";

    if (analyticsOrigin) {
      contentSecurityPolicy =
        contentSecurityPolicy.replace(
          "connect-src 'self';",
          "connect-src 'self' " +
            analyticsOrigin +
            ";"
        );

      contentSecurityPolicy =
        contentSecurityPolicy.replace(
          "script-src 'self' 'unsafe-inline';",
          "script-src 'self' 'unsafe-inline' " +
            analyticsOrigin +
            ";"
        );
    }

    res.setHeader(
      "Content-Security-Policy",
      contentSecurityPolicy
    );
  }

  next();
};

export function createApp() {
  assertProductionEnv();

  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(securityHeaders);

  app.use(
    express.json({
      limit: "16mb",
    })
  );

  app.use(
    express.urlencoded({
      limit: "2mb",
      extended: true,
    })
  );

  registerStorageProxy(app);

  registerOAuthRoutes(app);

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const sitemap = await buildSitemapXml();

      res
        .type("application/xml")
        .send(sitemap);
    } catch (error) {
      console.error(
        "[SEO] Sitemap generation failed",
        error
      );

      res
        .status(503)
        .type("text/plain")
        .send(
          "Sitemap temporarily unavailable"
        );
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(
      process.cwd(),
      "dist",
      "public"
    );

    app.use(
      express.static(staticPath)
    );

    app.get("*", (req, res, next) => {
      if (
        req.path.startsWith("/api/") ||
        req.path === "/sitemap.xml"
      ) {
        return next();
      }

      res.sendFile(
        path.join(
          staticPath,
          "index.html"
        )
      );
    });
  } else {
    // Development mode
    // Vite is started by the development server.
  }

  return app;
}

export const app = createApp();

async function startServer() {
  const server = createServer(app);
  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  }

  const preferredPort = parseInt(
    process.env.PORT || "3000",
    10
  );

  const isPortAvailable = (
    port: number
  ): Promise<boolean> =>
    new Promise((resolve) => {
      const testServer = net.createServer();

      testServer.once(
        "error",
        () => resolve(false)
      );

      testServer.listen(
        port,
        () => {
          testServer.close(() =>
            resolve(true)
          );
        }
      );
    });

  let port = preferredPort;

  for (
    let current = preferredPort;
    current < preferredPort + 20;
    current++
  ) {
    if (
      await isPortAvailable(current)
    ) {
      port = current;
      break;
    }
  }

  if (port !== preferredPort) {
    console.log(
      "Port " +
        preferredPort +
        " is busy, using port " +
        port +
        " instead"
    );
  }

  server.listen(
    port,
    () => {
      console.log(
        "Server running on http://localhost:" +
          port +
          "/"
      );
    }
  );
}

if (
  process.env.NODE_ENV !==
  "production"
) {
  startServer().catch((error) => {
    console.error(
      "[Server] Failed to start:",
      error
    );

    process.exit(1);
  });
}
