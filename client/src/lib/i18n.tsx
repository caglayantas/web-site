import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocation } from "wouter";

export type Lang = "tr" | "en";

const dict = {
  tr: {
    "nav.home": "Ana Sayfa",
    "nav.about": "Hakkımızda",
    "nav.services": "Hizmetler",
    "nav.regions": "Bölgelerimiz",
    "nav.projects": "Projeler",
    "nav.knowledge": "Teknik Bilgiler",
    "nav.listings": "İlanlar",
    "nav.contact": "Bize Ulaşın",
    "footer.explore": "Keşfedin",
    "footer.about": "Hakkımızda",
    "footer.services": "Hizmetler",
    "footer.regions": "Hizmet Bölgelerimiz",
    "footer.knowledge": "Teknik Bilgiler",
    "footer.faq": "SSS",
    "footer.sitemap": "Site haritası",
    "footer.contact": "İletişim",
    "footer.getInTouch": "Bize ulaşın",
    "footer.tagline": "Denizde güven, detaylarda başlayan özenli bakım ve doğru uygulamayla büyür.",
    "footer.legal": "Yasal",
    "footer.kvkk": "KVKK Aydınlatma",
    "footer.privacy": "Gizlilik Politikası",
    "footer.cookie": "Çerez Politikası",
    "footer.rights": "Tüm hakları saklıdır.",
    "footer.cookiePrefs": "Çerez tercihlerini değiştir",
    "cookie.text": "Sitemizde temel işlevler için zorunlu çerezler ve, izniniz dahilinde, ziyaretçi istatistiklerini anlamamıza yardımcı olan analiz çerezleri kullanıyoruz. Detaylar için",
    "cookie.policyLink": "Çerez Politikamızı",
    "cookie.reject": "Reddet",
    "cookie.preferences": "Tercihler",
    "cookie.accept": "Kabul Et",
    "cookie.prefsTitle": "Çerez tercihleri",
    "cookie.prefsDesc": "Hangi çerez kategorilerine izin vereceğinizi seçin. Detaylar için",
    "cookie.necessary": "Zorunlu çerezler",
    "cookie.necessaryDesc": "Sitenin temel işlevleri için gereklidir, kapatılamaz.",
    "cookie.analytics": "Analiz çerezleri",
    "cookie.analyticsDesc": "Ziyaretçi istatistiklerini anlamamıza yardımcı olur (Google Analytics).",
    "cookie.back": "Geri",
    "cookie.savePrefs": "Tercihleri Kaydet",
    "contact.title1": "Teknenizi anlatın.",
    "contact.title2": "Sonraki adımı birlikte planlayalım.",
    "contact.intro": "Mevcut durumu, önceliğinizi ve ihtiyaç duyduğunuz zamanı paylaşın; doğru bakım-onarım kapsamını birlikte netleştirelim.",
    "contact.channelsEyebrow": "İletişim Kanalları",
    "contact.channelsTitle": "İhtiyacınız için uygun yolu seçin.",
    "contact.channelsIntro": "Form üzerinden kapsamlı bilgi paylaşabilir, WhatsApp veya e-posta üzerinden doğrudan yazabilirsiniz.",
    "contact.whatsapp": "WhatsApp ile yazın",
    "contact.formEyebrow": "Teknik Değerlendirme",
    "contact.formTitle": "Teknenizi anlatın",
    "contact.name": "Adınız ve soyadınız",
    "contact.email": "E-posta adresiniz",
    "contact.category": "İhtiyaç kategorisi",
    "contact.categoryPlaceholder": "Bir kategori seçin",
    "contact.region": "Tekneniz hangi bölgede? (opsiyonel)",
    "contact.regionPlaceholder": "Bir bölge seçin",
    "contact.message": "Mevcut durum ve hedef",
    "contact.messagePlaceholder": "Teknenizin mevcut durumunu ve ihtiyacınızı kısaca anlatın.",
    "contact.consent": "KVKK aydınlatma metnini okudum ve iletişim kurulmasını kabul ediyorum.",
    "contact.submit": "Talebi Gönder",
    "contact.sending": "Gönderiliyor…",
    "contact.disclaimer": "Bilgileriniz yalnızca ilk teknik değerlendirme için kullanılır.",
    "404.title": "Sayfa bulunamadı",
    "404.text": "Aradığınız sayfa taşınmış veya kaldırılmış olabilir.",
    "404.cta": "Ana sayfaya dön",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.regions": "Coverage Areas",
    "nav.projects": "Projects",
    "nav.knowledge": "Technical Notes",
    "nav.listings": "Listings",
    "nav.contact": "Contact Us",
    "footer.explore": "Explore",
    "footer.about": "About Us",
    "footer.services": "Services",
    "footer.regions": "Coverage Areas",
    "footer.knowledge": "Technical Notes",
    "footer.faq": "FAQ",
    "footer.sitemap": "Sitemap",
    "footer.contact": "Contact",
    "footer.getInTouch": "Get in touch",
    "footer.tagline": "Confidence at sea starts with careful maintenance and the right work, in the details.",
    "footer.legal": "Legal",
    "footer.kvkk": "KVKK Notice",
    "footer.privacy": "Privacy Policy",
    "footer.cookie": "Cookie Policy",
    "footer.rights": "All rights reserved.",
    "footer.cookiePrefs": "Change cookie preferences",
    "cookie.text": "We use cookies that are necessary for core site functions and, with your consent, analytics cookies that help us understand visitor statistics. See our",
    "cookie.policyLink": "Cookie Policy",
    "cookie.reject": "Reject",
    "cookie.preferences": "Preferences",
    "cookie.accept": "Accept",
    "cookie.prefsTitle": "Cookie preferences",
    "cookie.prefsDesc": "Choose which cookie categories to allow. See our",
    "cookie.necessary": "Necessary cookies",
    "cookie.necessaryDesc": "Required for the site's core functions; cannot be turned off.",
    "cookie.analytics": "Analytics cookies",
    "cookie.analyticsDesc": "Help us understand visitor statistics (Google Analytics).",
    "cookie.back": "Back",
    "cookie.savePrefs": "Save Preferences",
    "contact.title1": "Tell us about your boat.",
    "contact.title2": "Let's plan the next step together.",
    "contact.intro": "Share the current condition, your priority, and your timeline; let's clarify the right maintenance and repair scope together.",
    "contact.channelsEyebrow": "Contact Channels",
    "contact.channelsTitle": "Choose the right way to reach us.",
    "contact.channelsIntro": "Share detailed information through the form, or write to us directly via WhatsApp or email.",
    "contact.whatsapp": "Message us on WhatsApp",
    "contact.formEyebrow": "Technical Assessment",
    "contact.formTitle": "Tell us about your boat",
    "contact.name": "Full name",
    "contact.email": "Email address",
    "contact.category": "Need category",
    "contact.categoryPlaceholder": "Select a category",
    "contact.region": "Where is your boat located? (optional)",
    "contact.regionPlaceholder": "Select a region",
    "contact.message": "Current condition and goal",
    "contact.messagePlaceholder": "Briefly describe your boat's current condition and what you need.",
    "contact.consent": "I have read the KVKK notice and consent to being contacted.",
    "contact.submit": "Send Request",
    "contact.sending": "Sending…",
    "contact.disclaimer": "Your information is only used for the initial technical assessment.",
    "404.title": "Page not found",
    "404.text": "The page you're looking for may have been moved or removed.",
    "404.cta": "Back to homepage",
  },
} as const;

export type TKey = keyof typeof dict.tr;

const LanguageContext = createContext<{ lang: Lang; t: (key: TKey) => string; toPath: (path: string) => string; stripLang: (path: string) => string }>({
  lang: "tr",
  t: (key) => dict.tr[key],
  toPath: (path) => path,
  stripLang: (path) => path,
});

export function stripLangPrefix(path: string): string {
  return path.startsWith("/en/") ? path.slice(3) || "/" : path === "/en" ? "/" : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const lang: Lang = location === "/en" || location.startsWith("/en/") ? "en" : "tr";

  const value = useMemo(() => {
    const t = (key: TKey) => dict[lang][key] ?? dict.tr[key];
    const toPath = (path: string) => {
      const base = stripLangPrefix(path);
      if (lang === "tr") return base;
      return base === "/" ? "/en" : `/en${base}`;
    };
    return { lang, t, toPath, stripLang: stripLangPrefix };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
