import { describe, expect, it } from "vitest";
import { validateCorporateContact } from "./CorporatePages";
import { getKnowledgeCoverImage } from "@/lib/knowledge";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("corporate page regressions", () => {
  it("keeps About page SEO metadata and bakım-onarım positioning", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CorporatePages.tsx"), "utf8");
    expect(source).toContain("Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis");
    expect(source).toContain("Kurumsal iş ortaklığı");
    expect(source).toContain("Vizyonumuz");
    expect(source).toContain("Misyonumuz");
    expect(source).toContain("Size ne vaat ediyoruz?");
    expect(source).toContain("Bize neden güvenmelisiniz?");
    expect(source).toContain("about-vision-mission");
    expect(source).toContain("about-references");
    expect(source).toContain("about-profile-download");
    expect(source).toContain("main_592e54aa.pdf");
    expect(source).toContain("izinli ve doğrulanmış kayıtlarla");
  });

  it("fills missing Technical Knowledge cover images by topic", () => {
    expect(getKnowledgeCoverImage("Mekanik tesisat ve tekne bakım", "Pompa, vana ve hortum kontrolü")).toContain("perla-service-mechanical");
    expect(getKnowledgeCoverImage("Marin elektrik ve enerji sistemleri", "Lityum akü BMS bakımı")).toContain("perla-service-electrical");
    expect(getKnowledgeCoverImage("Motor, tahrik ve dümen sistemleri", "Şaft ve pervane bakım kontrolü")).toContain("perla-service-propulsion");
  });

  it("keeps the expanded service catalog visible on the public services page", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CorporatePages.tsx"), "utf8");
    expect(source).toContain("Yelken ve arma donanım");
    expect(source).toContain("Üretim danışmanlığı");
    expect(source).toContain("Tekneye özel çözümler");
  });

  it("keeps page-level SEO metadata and local navigation routes", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CorporatePages.tsx"), "utf8");
    const legal = readFileSync(resolve(process.cwd(), "client/src/pages/Legal.tsx"), "utf8");
    expect(source).toContain("Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım");
    expect(source).toContain("Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları");
    expect(source).toContain("Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri");
    expect(source).toContain("İletişim | Perla Marine Tekne Teknik Check-up ve Servis");
    expect(source).toContain("href=\"/iletisim\"");
    expect(legal).toContain("href=\"/teknik-bilgiler\">Teknik Bilgiler");
  });

  it("keeps public project detail route and canonical sitemap shape", () => {
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const sitemap = readFileSync(resolve(process.cwd(), "server/sitemap.ts"), "utf8");
    expect(app).toContain("/projeler/:slug");
    expect(app).toContain("LegacyBlogRedirect");
    expect(app).toContain("navigate(\"/teknik-bilgiler\", { replace: true })");
    expect(sitemap).toContain("/projeler/${project.slug}");
  });
});

describe("corporate contact form validation", () => {
  it("returns user-friendly errors for incomplete values", () => {
    const errors = validateCorporateContact({ name: "", email: "broken", service: "", message: "" }, false);
    expect(errors.name).toBe("Ad soyad alanını doldurun.");
    expect(errors.email).toBe("Geçerli bir e-posta adresi yazın.");
    expect(errors.service).toBe("Bir ihtiyaç kategorisi seçin.");
    expect(errors.message).toBe("Mevcut durumu ve hedefinizi paylaşın.");
    expect(errors.consent).toBe("Aydınlatma onayını işaretleyin.");
  });

  it("returns no errors for a complete request", () => {
    expect(validateCorporateContact({ name: "Perla Marine", email: "info@example.com", service: "Marin elektrik", message: "Akü ve şarj sistemi kontrolü" }, true)).toEqual({});
  });

  it("keeps the animated success message accessible and on-brand", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/CorporatePages.tsx"), "utf8");
    const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(source).toContain('id="contact-success"');
    expect(source).toContain('role="status" aria-live="polite"');
    expect(source).toContain('tabIndex={-1}');
    expect(source).toContain("successRef.current?.focus");
    expect(source).toContain("Teşekkür ederiz.");
    expect(styles).toContain(".new-contact-success__mark");
    expect(styles).toContain("@keyframes contactSuccessMark");
    expect(styles).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
