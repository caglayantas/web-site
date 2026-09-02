/**
 * Perla Marine / Sessiz Kuvvet: İç sayfalarda koyu, gerçek saha görseli üzerine bindirilmiş,
 * sol hizalı serif başlık ve ince altın rota çizgisiyle kurumsal sakinliği sürdüren sayfa başlığı.
 */
type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  variant: "about" | "services" | "blog" | "contact";
  image?: string;
};

const heroImages: Record<PageHeroProps["variant"], string> = {
  about: "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
  services: "/manus-storage/perla-hero-medium-yacht-service-1600_e565edfd.webp",
  blog: "/manus-storage/perla-hybrid-propulsion_709c0218.webp",
  contact: "/manus-storage/perla-marine-checkup-inspection-report-1600_ee2d0922.webp",
};

export default function PageHero({ eyebrow, title, intro, variant, image }: PageHeroProps) {
  return (
    <section
      className="page-hero"
      style={{
        backgroundImage: `linear-gradient(100deg, rgba(4,20,38,.95) 0%, rgba(4,20,38,.88) 38%, rgba(4,20,38,.55) 68%, rgba(4,20,38,.3) 100%), url(${image ?? heroImages[variant]})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="page-hero__content">
        <div className="page-hero__route" aria-hidden="true" />
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__intro">{intro}</p>
      </div>
    </section>
  );
}
