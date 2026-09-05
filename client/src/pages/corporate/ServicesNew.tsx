import { useLanguage } from "@/lib/i18n";
import ServiceGrid from "@/components/ServiceGrid";
import { usePageData, usePageMetadata, PageFrame, CorporateHero } from "./pageShared";

export default function ServicesNew() {
  const { lang } = useLanguage();
  usePageMetadata(
    "/hizmetler",
    "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım",
    "Perla Marine’in kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve özel tekne çözümlerini inceleyin.",
    "Services | Perla Marine Boat & Yacht Maintenance and Repair",
    "Explore Perla Marine's composite, marine electrical, electronics, mechanical, propulsion-steering, and boat-specific solutions."
  );

  return (
    <PageFrame>
      <CorporateHero data={usePageData().services} />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              {lang === "en" ? "Maintenance and service scope" : "Bakım ve servis kapsamı"}
            </p>

            <h2>
              {lang === "en" ? <>The boat's need changes.<br /><em>So does the service scope.</em></> : <>Teknenin ihtiyacı değişir.<br /><em>Servis kapsamı da.</em></>}
            </h2>
          </div>

          <p>
            {lang === "en"
              ? "We treat each service category as a distinct operation, and assess the relationship between systems together when needed."
              : "Her hizmet grubunu ayrı bir operasyon olarak ele alıyor, gerektiğinde sistemler arası ilişkiyi birlikte değerlendiriyoruz."}
          </p>
        </div>

        <ServiceGrid expanded />
      </section>
    </PageFrame>
  );
}

/* =========================================================
   PROJECT LIGHTBOX
========================================================= */


