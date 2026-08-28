/**
 * Perla Marine / Sessiz Kuvvet: İç sayfalarda büyük boşluk, serif başlık ve ince altın rota
 * çizgisiyle kurumsal sakinliği sürdüren sayfa başlığı. İç sayfaların her birinde
 * gerçek proje/saha görseli de kullanılır; böylece ana sayfa dışındaki rotalar da görsel olarak
 * ana sayfayla aynı kalite seviyesinde kalır.
 */
type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  variant: "about" | "services" | "blog" | "contact";
};

const heroImages: Record<PageHeroProps["variant"], string> = {
  about: "/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp",
  services: "/manus-storage/perla-hero-medium-yacht-service-1600_e565edfd.webp",
  blog: "/manus-storage/perla-hybrid-propulsion_709c0218.jpg",
  contact: "/manus-storage/perla-marine-checkup-inspection-report-1600_ee2d0922.webp",
};

function HeroSignal({ variant }: Pick<PageHeroProps, "variant">) {
  if (variant === "about") {
    return (
      <div className="hero-signal hero-signal--about" aria-hidden="true">
        <span className="hero-signal__label">SISTEM BAĞLAMI</span>
        <svg viewBox="0 0 240 100"><path d="M8 78H76L112 28H178L232 72" /><circle cx="76" cy="78" r="5" /><circle cx="112" cy="28" r="5" /><circle cx="178" cy="28" r="5" /><circle cx="232" cy="72" r="5" /></svg>
        <span className="hero-signal__caption">Bağlantılar görünür</span>
      </div>
    );
  }
  if (variant === "services") {
    return (
      <div className="hero-signal hero-signal--services" aria-hidden="true">
        <span className="hero-signal__label">SİSTEM HARİTASI</span>
        <div className="system-meter"><i /><i /><i /><i /><i /><i /><i /></div>
        <span className="hero-signal__caption">Uzmanlık modülü</span>
      </div>
    );
  }
  if (variant === "blog") {
    return (
      <div className="hero-signal hero-signal--blog" aria-hidden="true">
        <span className="hero-signal__label">TEKNİK NOTLAR</span>
        <svg viewBox="0 0 240 100"><path d="M6 30H55V70H111V18H168V51H232" /><path className="muted" d="M6 87H232" /><circle cx="55" cy="30" r="4" /><circle cx="111" cy="70" r="4" /><circle cx="168" cy="18" r="4" /></svg>
        <span className="hero-signal__caption">Bilgi rotası</span>
      </div>
    );
  }
  return (
    <div className="hero-signal hero-signal--contact" aria-hidden="true">
      <span className="hero-signal__label">İLK DEĞERLENDİRME</span>
      <div className="contact-meter"><i /><i /><i /></div>
      <span className="hero-signal__caption">Bağlam / Sistem / Sonraki adım</span>
    </div>
  );
}

export default function PageHero({ eyebrow, title, intro, variant }: PageHeroProps) {
  return (
    <section
      className={`page-hero page-hero--${variant}`}
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(9, 22, 38, 0.94) 0%, rgba(9, 22, 38, 0.78) 42%, rgba(9, 22, 38, 0.25) 100%), url(${heroImages[variant]})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="page-hero__route" aria-hidden="true"><span /></div>
      <div className="page-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__intro">{intro}</p>
      </div>
      <HeroSignal variant={variant} />
    </section>
  );
}
