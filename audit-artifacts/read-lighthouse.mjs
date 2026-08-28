import { readFileSync } from "node:fs";

const path = process.argv[2];
const report = JSON.parse(readFileSync(path, "utf8"));
const categories = Object.fromEntries(Object.entries(report.categories ?? {}).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]));
const audits = report.audits ?? {};
const metric = (id) => audits[id]?.numericValue ?? null;
console.log(JSON.stringify({ categories, metrics: { lcpMs: metric("largest-contentful-paint"), cls: metric("cumulative-layout-shift"), tbtMs: metric("total-blocking-time"), fcpMs: metric("first-contentful-paint"), speedIndexMs: metric("speed-index"), inpMs: metric("interaction-to-next-paint") }, lcpElement: audits["largest-contentful-paint-element"]?.details?.items?.[0] ?? null, network: (report.audits["network-requests"]?.details?.items ?? []).sort((a, b) => (b.transferSize ?? 0) - (a.transferSize ?? 0)).slice(0, 10).map((item) => ({ url: item.url, transferSize: item.transferSize, resourceType: item.resourceType })) , warnings: Object.values(audits).filter((audit) => audit.score !== null && audit.score < 1).slice(0, 12).map((audit) => ({ id: audit.id, title: audit.title, score: audit.score, displayValue: audit.displayValue })) }, null, 2));
