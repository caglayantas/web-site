import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  getPublishedProjects: vi.fn(async () => [
    { slug: "elektrik-enerji", updatedAt: new Date("2026-08-20T00:00:00Z") },
  ]),
  getPublishedKnowledgePosts: vi.fn(async () => [
    { slug: "marin-elektrik-bakimi", featured: true, publishedAt: new Date("2026-08-20T00:00:00Z"), updatedAt: new Date("2026-08-19T00:00:00Z") },
  ]),
}));

import { buildSitemapXml } from "./sitemap";

describe("dynamic sitemap", () => {
  it("contains canonical static routes and published knowledge detail URLs", async () => {
    const xml = await buildSitemapXml();
    expect(xml).toContain("https://www.perlamarine.com/");
    expect(xml).toContain("https://www.perlamarine.com/teknik-bilgiler/marin-elektrik-bakimi");
    expect(xml).toContain("https://www.perlamarine.com/projeler/elektrik-enerji");
    expect(xml).toContain("<changefreq>monthly</changefreq>");
    expect(xml).not.toContain("#");
    expect(xml).toContain("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");
  });
});
