import { chromium } from 'playwright';

const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto(`${baseUrl}/hizmetler`, { waitUntil: 'networkidle' });
const serviceIds = ['kompozit-cozumler', 'marin-elektrik', 'marin-elektronigi', 'isitma-sogutma', 'mekanik-tesisat', 'motor-tahrik-dumen', 'yelken-arma', 'guverte-ekipmanlari', 'tekneye-ozel-cozumler'];
const dialogResults = [];
for (const id of serviceIds) {
  await page.locator(`#${id}`).click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor();
  const dialogMotion = id === serviceIds[0] ? await dialog.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return { animationName: style.animationName, animationDuration: style.animationDuration };
  }) : undefined;
  dialogResults.push({ id, title: await dialog.locator('[data-slot="dialog-title"]').textContent(), dialogMotion });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(260);
}

await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
await page.waitForTimeout(160);
const progressAtTop = await page.locator('.back-to-top__indicator').getAttribute('stroke-dashoffset');
const toneAtTop = await page.locator('.back-to-top').getAttribute('class');
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }));
await page.waitForTimeout(160);
const progressAtBottom = await page.locator('.back-to-top__indicator').getAttribute('stroke-dashoffset');
const toneAtBottom = await page.locator('.back-to-top').getAttribute('class');
const midScroll = await page.evaluate(() => Math.round((document.documentElement.scrollHeight - window.innerHeight) * 0.52));
await page.evaluate((scrollTop) => window.scrollTo({ top: scrollTop, behavior: 'auto' }), midScroll);
await page.waitForTimeout(160);
const toneAtMid = await page.locator('.back-to-top').getAttribute('class');
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }));
await page.waitForTimeout(160);
const backToTopVisible = await page.locator('.back-to-top--visible').isVisible();
const positionCheck = await page.locator('.back-to-top--visible').evaluate((element) => {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return { position: style.position, right: Math.round(window.innerWidth - rect.right), bottom: Math.round(window.innerHeight - rect.bottom) };
});
const backToTop = page.locator('.back-to-top--visible');
await backToTop.hover();
await page.waitForTimeout(260);
const hoverStyles = await backToTop.evaluate((element) => {
  const style = window.getComputedStyle(element);
  const after = window.getComputedStyle(element, '::after');
  return { transform: style.transform, filter: style.filter, afterOpacity: after.opacity };
});
await backToTop.click();
await page.waitForTimeout(1100);
const scrollPositionAfterClick = await page.evaluate(() => window.scrollY);

await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
await page.locator('.button--gold').first().hover();
await page.waitForTimeout(220);
const ctaHoverStyles = await page.locator('.button--gold').first().evaluate((element) => {
  const style = window.getComputedStyle(element);
  return { transform: style.transform, filter: style.filter };
});

await page.goto(`${baseUrl}/iletisim`, { waitUntil: 'networkidle' });
await page.locator('button[type="submit"]').click();
const errorSummary = await page.locator('.form-error-summary').isVisible();
await page.locator('input[name="name"]').fill('Perla Marine Test');
await page.locator('input[name="email"]').fill('test@example.com');
await page.locator('select[name="service"]').selectOption({ label: 'Marin elektrik' });
await page.locator('textarea[name="message"]').fill('Elektrik bakım değerlendirmesi için test talebi.');
await page.locator('input[name="consent"]').check();
await page.locator('button[type="submit"]').click();
const success = await page.locator('.form-success').isVisible();

console.log(JSON.stringify({ dialogCount: dialogResults.length, dialogTitlesPresent: dialogResults.every((result) => Boolean(result.title)), dialogMotion: dialogResults[0]?.dialogMotion, ctaHoverStyles, backToTopVisible, positionCheck, progressAtTop, progressAtBottom, progressChanged: progressAtTop !== progressAtBottom, toneAtTop, toneAtMid, toneAtBottom, hoverStyles, scrollPositionAfterClick, errorSummaryVisible: errorSummary, successVisible: success }));
await browser.close();
