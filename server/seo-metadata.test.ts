import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

describe("dynamic SEO metadata", () => {
  it("provides Helmet metadata for route-level client navigation", () => {
    const pageHead = read("client/src/components/PageHead.tsx");
    expect(pageHead).toContain('from "react-helmet-async"');
    expect(pageHead).toContain("og:url");
    expect(pageHead).toContain("twitter:image");
    expect(pageHead).toContain('"@type": "WebPage"');
  });

  it("injects route-specific social metadata and JSON-LD for crawlers", () => {
    const server = read("server/_core/vite.ts");
    expect(server).toContain('meta property="og:image"');
    expect(server).toContain('meta name="twitter:image"');
    expect(server).toContain('"@type": "WebPage"');
  });
});
