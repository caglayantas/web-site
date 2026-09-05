import React, { useEffect } from "react";
import { useLanguage } from "@/lib/i18n";

const SITE_URL = "https://www.perlamarine.com";

type PageData = {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  image: string;
  alt: string;
};


const pageDataTr: Record<string, PageData> = {
  about: {
    eyebrow: "Kurumsal kimliğimiz",
    title: (
      <>
        Denizde güven,
        <br />
        <em>karada disiplinle kurulur.</em>
      </>
    ),
    lead:
      "Perla Marine; tekne ve yat bakım-onarım, refit ve teknik servis süreçlerini mühendislik disiplini, saha deneyimi ve şeffaf iletişim anlayışıyla yöneten kurumsal bir denizcilik çözüm ortağıdır.",
    image:
      "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
    alt:
      "Kuru havuzda motor yat üzerinde teknik inceleme yapan denizcilik uzmanı",
  },

  services: {
    eyebrow: "Hizmetler",
    title: (
      <>
        Bakım kararını doğru kapsamla,
        <br />
        <em>uygulanabilir işlerle</em> netleştirin.
      </>
    ),
    lead:
      "Kompozit, marin elektrik, elektronik, iklimlendirme, mekanik tesisat, motor-tahrik-dümen ve güverte sistemleri için tekneye özel servis çözümleri.",
    image:
      "/manus-storage/perla-service-composite-v2-1600_cb23463b.webp",
    alt:
      "Yat kompozit kalıbı, elyaf malzeme ve teknik üretim ekipmanları",
  },

  projects: {
    eyebrow: "Projeler",
    title: (
      <>
        Her tekne farklıdır.
        <br />
        <em>Çözüm de öyle olmalı.</em>
      </>
    ),
    lead:
      "Bakım ve refit kapsamını mevcut durum, kullanım profili ve uygulanabilir sonraki adım üzerinden ele alıyoruz.",
    image:
      "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp",
    alt:
      "Motor ve tahrik sistemi bakım detayı",
  },

  knowledge: {
    eyebrow: "Teknik bilgiler",
    title: (
      <>
        Daha doğru bakım,
        <br />
        <em>daha görünür bilgiyle</em> başlar.
      </>
    ),
    lead:
      "Tekne sahipleri ve üretici ekipleri için bakım kararlarını destekleyen teknik notlar, kontrol başlıkları ve uygulama rehberleri.",
    image:
      "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp",
    alt:
      "Marin elektronik ve navigasyon ekranları",
  },

  contact: {
    eyebrow: "Bize ulaşın",
    title: (
      <>
        Teknenizi anlatın.
        <br />
        <em>Sonraki adımı birlikte planlayalım.</em>
      </>
    ),
    lead:
      "Mevcut durumu, önceliğinizi ve ihtiyaç duyduğunuz zamanı paylaşın; doğru bakım-onarım kapsamını birlikte netleştirelim.",
    image:
      "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
    alt:
      "Perla Marine teknisyeni kuru havuzda bir yatı inceliyor",
  },
};

const pageDataEn: Record<string, PageData> = {
  about: {
    eyebrow: "Our Identity",
    title: (
      <>
        Confidence at sea,
        <br />
        <em>built with discipline on land.</em>
      </>
    ),
    lead:
      "Perla Marine is a corporate marine solutions partner that manages boat and yacht maintenance, repair, refit, and technical service processes with engineering discipline, field experience, and transparent communication.",
    image:
      "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
    alt:
      "Marine expert inspecting a motor yacht in dry dock",
  },

  services: {
    eyebrow: "Services",
    title: (
      <>
        Clarify your maintenance decision
        <br />
        with the right scope and <em>actionable work.</em>
      </>
    ),
    lead:
      "Boat-specific service solutions for composite, marine electrical, electronics, climate control, mechanical systems, propulsion & steering, and deck systems.",
    image:
      "/manus-storage/perla-service-composite-v2-1600_cb23463b.webp",
    alt:
      "Yacht composite mold, fiber material and technical production equipment",
  },

  projects: {
    eyebrow: "Projects",
    title: (
      <>
        Every boat is different.
        <br />
        <em>So is the right solution.</em>
      </>
    ),
    lead:
      "We approach maintenance and refit scope based on current condition, usage profile, and the next actionable step.",
    image:
      "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp",
    alt:
      "Engine and propulsion system maintenance detail",
  },

  knowledge: {
    eyebrow: "Technical Notes",
    title: (
      <>
        Better maintenance
        <br />
        <em>starts with clearer information.</em>
      </>
    ),
    lead:
      "Technical notes, checklists, and application guides that support maintenance decisions for boat owners and manufacturer teams.",
    image:
      "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp",
    alt:
      "Marine electronics and navigation displays",
  },

  contact: {
    eyebrow: "Contact Us",
    title: (
      <>
        Tell us about your boat.
        <br />
        <em>Let's plan the next step together.</em>
      </>
    ),
    lead:
      "Share the current condition, your priority, and your timeline; let's clarify the right maintenance and repair scope together.",
    image:
      "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
    alt:
      "Perla Marine technician inspecting a yacht in dry dock",
  },
};


function usePageData(): Record<string, PageData> {
  const { lang } = useLanguage();
  return lang === "en" ? pageDataEn : pageDataTr;
}


function CorporateHero({ data, compact = false }: { data: PageData; compact?: boolean }) {
  return (
    <section
      className={`page-hero${compact ? " page-hero--compact" : ""}`}
      style={{
        backgroundImage: `linear-gradient(100deg, rgba(4,20,38,.95) 0%, rgba(4,20,38,.88) 38%, rgba(4,20,38,.55) 68%, rgba(4,20,38,.3) 100%), url(${data.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="page-hero__content">
        <div className="page-hero__route" aria-hidden="true" />
        <p className="eyebrow">{data.eyebrow}</p>

        <h1>{data.title}</h1>

        <p className="page-hero__intro">{data.lead}</p>
      </div>
    </section>
  );
}

/* =========================================================
   PAGE FRAME
========================================================= */


function PageFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="corporate-page">
      {children}
    </div>
  );
}

/* =========================================================
   SEO
========================================================= */


function usePageMetadata(
  path: string,
  title: string,
  description: string,
  titleEn?: string,
  descriptionEn?: string
) {
  const { lang, toPath } = useLanguage();
  useEffect(() => {
    const activeTitle = lang === "en" && titleEn ? titleEn : title;
    const activeDescription = lang === "en" && descriptionEn ? descriptionEn : description;
    document.title = activeTitle;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        activeDescription
      );

    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute(
        "href",
        `${SITE_URL}${toPath(path)}`
      );

    document
      .querySelector(
        'meta[property="og:title"]'
      )
      ?.setAttribute(
        "content",
        activeTitle
      );

    document
      .querySelector(
        'meta[property="og:description"]'
      )
      ?.setAttribute(
        "content",
        activeDescription
      );

    document
      .querySelector(
        'meta[property="og:url"]'
      )
      ?.setAttribute(
        "content",
        `${SITE_URL}${toPath(path)}`
      );

    return () => {
      document.title =
        lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım";
    };
  }, [
    path,
    title,
    description,
    titleEn,
    descriptionEn,
    lang,
  ]);
}

/* =========================================================
   ABOUT
========================================================= */


export { SITE_URL, usePageData, usePageMetadata, PageFrame, CorporateHero, type PageData };
