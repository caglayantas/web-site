import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());

const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("performance and advanced SEO safeguards", () => {
  it("preloads the LCP hero image and exposes crawler metadata", () => {
    const html = read("client/index.html");
    expect(html).toContain('rel="preload" as="image"');
    expect(html).toContain("perla-hero-medium-yacht-service_7ccec84c_3e23263b.webp");
    expect(html).toContain('name="robots" content="index, follow, max-image-preview:large"');
    expect(html).toContain('content="width=device-width, initial-scale=1.0"');
    expect(html).toContain('type="image/webp" fetchpriority="high"');
  });

  it("allows the storage CDN so redirected images render under the CSP", () => {
    const server = read("server/_core/index.ts");
    expect(server).toContain("img-src 'self' data: blob: https://d36hbw14aib5lz.cloudfront.net");
  });

  it("keeps the debug collector out of production public assets", () => {
    const viteConfig = read("vite.config.ts");
    expect(existsSync(resolve(root, "client/public/__manus__/debug-collector.js"))).toBe(false);
    expect(viteConfig).toContain('process.env.NODE_ENV === "development"');
    expect(viteConfig).toContain("__manus__/debug-collector.js");
  });

  it("keeps immutable caching for hashed production assets", () => {
    const viteServer = read("server/_core/vite.ts");
    expect(viteServer).toContain("max-age=31536000, immutable");
    expect(viteServer).toContain("express.static(distPath");
  });

  it("keeps the dynamic sitemap route and canonical domain aligned", () => {
    const sitemap = read("server/sitemap.ts");
    const robots = read("client/public/robots.txt");
    expect(sitemap).toContain("https://www.perlamarine.com");
    expect(robots).toContain("Sitemap: https://www.perlamarine.com/sitemap.xml");
  });
});

