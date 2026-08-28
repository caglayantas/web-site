import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true, executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

const focusName = async () => page.evaluate(() => {
  const active = document.activeElement;
  return active ? {
    tag: active.tagName,
    text: (active.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
    aria: active.getAttribute("aria-label"),
    href: active.getAttribute("href"),
  } : null;
});

await page.locator(".mobile-menu-button").focus();
console.log("menu-button-before-open", await focusName());
await page.keyboard.press("Enter");
await page.waitForTimeout(100);
console.log("first-focus-after-open", await focusName());

const order = [];
for (let index = 0; index < 6; index += 1) {
  await page.keyboard.press("Tab");
  order.push(await focusName());
}
console.log("tab-order", JSON.stringify(order));

await page.keyboard.press("Escape");
await page.waitForTimeout(100);
console.log("focus-after-escape", await focusName());
console.log("menu-expanded-after-escape", await page.locator(".mobile-menu-button").getAttribute("aria-expanded"));

await page.keyboard.press("Shift+Tab");
console.log("shift-tab-after-close", await focusName());

await page.setViewportSize({ width: 1280, height: 720 });
await page.reload({ waitUntil: "networkidle" });
const translate = page.locator('.nav-translate');
console.log("translate-visible", await translate.isVisible());
console.log("translate-href", await translate.getAttribute("href"));

await browser.close();
