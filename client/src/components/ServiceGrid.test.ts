import { describe, expect, it } from "vitest";
import { electricalOperations, serviceItems } from "./ServiceGrid";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cssSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("ServiceGrid interactive service content", () => {
  it("keeps hover and touch feedback readable on service cards", () => {
    expect(cssSource).toContain(".home-page-compact .service-card:hover h3");
    expect(cssSource).toContain(".home-page-compact .service-card:hover { box-shadow");
    expect(cssSource).toContain("@media (hover: none)");
    expect(cssSource).toContain(".home-page-compact .service-card:hover p");
  });

  it("keeps the dialog close control visible while modal content scrolls", () => {
    expect(cssSource).toContain(".service-modal__content [data-slot=\"dialog-close\"] { position: absolute");
    expect(cssSource).toContain(".service-modal__scroll { max-height");
  });

  it("keeps service detail dialog copy and actions high-contrast", () => {
    expect(cssSource).toContain(".service-modal__content .check-list--dark li span");
    expect(cssSource).toContain(".service-modal__content .button--navy:hover");
    expect(cssSource).toContain(".service-modal__content .service-modal__note");
  });

  it("includes production consulting, sailing rig equipment, and custom solutions", () => {
    expect(serviceItems.find((item) => item.id === "uretim-danismanligi")?.title).toBe("Üretim Danışmanlığı");
    expect(serviceItems.find((item) => item.id === "uretim-danismanligi")?.subtopics).toContain("Sistem yerleşimi ve servis erişimi");
    expect(serviceItems.find((item) => item.id === "yelken-arma")?.title).toBe("Yelken ve Arma Donanım");
    expect(serviceItems.find((item) => item.id === "tekneye-ozel-cozumler")?.title).toBe("Tekneye Özel Çözümler");
  });

  it("keeps Marin Elektrik as an interactive service with detailed maintenance operations", () => {
    const electrical = serviceItems.find((item) => item.id === "marin-elektrik");

    expect(electrical?.title).toBe("Marin Elektrik");
    expect(electrical?.subtopics).toContain("Lityum akü ve BMS sistemleri");
    expect(electricalOperations).toHaveLength(6);
    expect(electricalOperations.join(" ")).toContain("Güç dağıtım panoları");
  });
});
