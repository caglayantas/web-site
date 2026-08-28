/**
 * Perla Marine / Sessiz Kuvvet: İç sayfalarda büyük boşluk, serif başlık ve ince altın rota
 * çizgisiyle kurumsal sakinliği sürdüren, görseli asla metnin önüne geçirmeyen sayfa başlığı.
 */
type PageHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  variant: "about" | "services" | "blog" | "contact";
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
    <section className={`page-hero page-hero--${variant}`}>
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
