import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://localhost:3000";
const routes = ["/", "/hakkimizda", "/hizmetler", "/projeler", "/teknik-bilgiler", "/iletisim"];
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const results = [];
for (const route of routes) {
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  results.push({ route, title: await page.locator("h1").first().textContent(), pageHero: await page.locator(".page-hero").count() });
}
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const nav = await page.locator(".desktop-nav > a").allTextContents();
console.log(JSON.stringify({ routes: results, nav }));
await browser.close();
