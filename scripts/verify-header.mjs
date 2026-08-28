import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://localhost:3000";
const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
const desktopLabels = await page.locator(".desktop-nav > a").allTextContents();
const desktopHrefs = await page.locator(".desktop-nav > a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
const whatsapp = await page.locator(".nav-whatsapp").getAttribute("href");
const contact = await page.locator(".nav-contact").getAttribute("href");
await page.setViewportSize({ width: 375, height: 812 });
await page.locator(".mobile-menu-button").click();
const mobileLabels = await page.locator("#mobile-navigation > a").allTextContents();
const mobileWhatsApp = await page.locator(".mobile-nav__social").getAttribute("href");
console.log(JSON.stringify({ desktopLabels, desktopHrefs, contact, whatsapp, mobileLabels, mobileWhatsApp }));
await browser.close();
