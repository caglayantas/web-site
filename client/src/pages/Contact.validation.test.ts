import { describe, expect, it } from "vitest";
import { validateContactForm } from "./Contact";

describe("validateContactForm", () => {
  it("validates a complete technical request", () => {
    expect(validateContactForm({ name: "Deniz Yatçılık", email: "info@example.com", service: "Marin elektrik", message: "Akü ve şarj sistemlerini kontrol etmek istiyoruz.", consent: "on" })).toEqual({});
  });

  it("returns accessible field errors for an incomplete request", () => {
    expect(validateContactForm({ name: "", email: "hatalı", service: "", message: "", consent: "" })).toEqual({
      name: "Ad soyad alanını doldurun.",
      email: "Geçerli bir e-posta adresi yazın.",
      service: "Bir ihtiyaç kategorisi seçin.",
      message: "Mevcut durumu ve hedefinizi kısaca paylaşın.",
      consent: "İletişim talebiniz için aydınlatma onayını işaretleyin.",
    });
  });
});
