import { useEffect, useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ServiceGrid from "@/components/ServiceGrid";
import ServiceFAQ from "@/components/ServiceFAQ";
import { getPublishedKnowledgePosts, getPublishedProjects, getPublishedPartners, localizePartner, type KnowledgePostRow, type ProjectRow, type PartnerRow } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import { ArrowDownRight, ArrowUpRight, BatteryCharging, CalendarClock, Check, ChevronRight, ClipboardCheck, Clock3, FileText, MapPin, Settings2, ShieldCheck, Wrench, MoveRight } from "lucide-react";

const SITE_URL = "https://www.perlamarine.com";

const technicalFallbackTr = [{ category: "Elektrik ve enerji sistemleri", title: "Lityum ve akü sistemlerinde bakım kontrolü nerede başlar?", excerpt: "Bağlantı düzeni, şarj davranışı ve servis erişimi üzerinden pratik bir kontrol çerçevesi.", slug: "lityum-ve-aku", coverImage: "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp" }, { category: "Motor, tahrik ve dümen", title: "Motor, şaft ve dümen sistemlerinde bakım işaretleri.", excerpt: "Titreşim, ses, boşluk ve bağlantı değişimlerini erken fark etmek için saha notları.", slug: "motor-saft", coverImage: "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp" }, { category: "Mekanik tesisatlar", title: "Pompa, vana ve hortum hatlarında planlı bakım.", excerpt: "Sızdırmazlık, erişim ve deniz suyu sistemlerinde düzenli kontrolün pratik karşılığı.", slug: "pompa-vana", coverImage: "/manus-storage/perla-service-mechanical-v2-1600_b2b0c9ef.webp" }];
const technicalFallbackEn = [{ category: "Electrical and power systems", title: "Where does lithium and battery system maintenance start?", excerpt: "A practical checklist framework built around wiring layout, charging behavior, and service access.", slug: "lityum-ve-aku", coverImage: "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp" }, { category: "Engine, propulsion and steering", title: "Maintenance signs in the engine, shaft, and steering systems.", excerpt: "Field notes for catching vibration, noise, play, and connection changes early.", slug: "motor-saft", coverImage: "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp" }, { category: "Mechanical systems", title: "Planned maintenance for pump, valve, and hose lines.", excerpt: "The practical side of regular sealing, access, and raw-water system checks.", slug: "pompa-vana", coverImage: "/manus-storage/perla-service-mechanical-v2-1600_b2b0c9ef.webp" }];

const projectFallbackTr = [{ slug: "elektrik-enerji", label: "Elektrik ve enerji", title: "Akü ve güç dağıtım sistemi", detail: "Mevcut pano düzeninin okunabilirliği, bağlantı güvenliği ve servis erişimi için planlanan kapsam.", beforeImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp", afterImage: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp" }, { slug: "motor-tahrik", label: "Motor ve tahrik", title: "Şaft ve pervane sistemi", detail: "Motor, şaft, kaplin ve pervane hattında bakım önceliklerini görünür kılan çalışma.", beforeImage: "/manus-storage/perla-service-propulsion_1dad9846.jpg", afterImage: "/manus-storage/perla-service-mechanical_1537487f.jpg" }, { slug: "mekanik-sistemler", label: "Mekanik sistemler", title: "Yakıt ve sintine hatları", detail: "Pompa, vana, hortum ve erişim noktalarının servis planına alınması.", beforeImage: "/manus-storage/perla-service-mechanical_1537487f.jpg", afterImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp" }];
const projectFallbackEn = [{ slug: "elektrik-enerji", label: "Electrical and power", title: "Battery and power distribution system", detail: "Scope planned for panel-layout clarity, connection safety, and service access.", beforeImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp", afterImage: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp" }, { slug: "motor-tahrik", label: "Engine and propulsion", title: "Shaft and propeller system", detail: "Work that makes maintenance priorities visible across the engine, shaft, coupling, and propeller line.", beforeImage: "/manus-storage/perla-service-propulsion_1dad9846.jpg", afterImage: "/manus-storage/perla-service-mechanical_1537487f.jpg" }, { slug: "mekanik-sistemler", label: "Mechanical systems", title: "Fuel and bilge lines", detail: "Bringing pumps, valves, hoses, and access points into a service plan.", beforeImage: "/manus-storage/perla-service-mechanical_1537487f.jpg", afterImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp" }];

const shortenProjectText = (text: string, limit: number) => { const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.trim(); return firstSentence.length <= limit ? firstSentence : `${firstSentence.slice(0, limit - 1).trimEnd()}…`; };

const contentTr = {
  heroEyebrow: "Üretim · Bakım & Onarım · Refit",
  heroTitle: <>Denizde güven,<br /><em>detaylarda başlar.</em></>,
  heroLede: "Teknenizin ihtiyaçlarına özel mühendislik, bakım, yenileme ve teknik servis çözümleri.",
  heroCta1: "Hizmetleri keşfedin",
  heroCta2: "Teknenizi anlatın",
  sideNoteBody: "Teknenizin mevcut durumunu anlayıp, doğru müdahale planını oluşturuyoruz.",
  scrollExplore: "Keşfet",
  trust1: ["Saha deneyimi", "tekne ve yat bakımında birikim"],
  trust2: ["Planlı iletişim", "ihtiyaç halinde net geri dönüş"],
  trust3: ["Uygun parça seçimi", "ihtiyaca göre malzeme planı"],
  trust4: ["Açık kapsam", "doğru iş kalemi ve sonraki adım"],
  servicesEyebrow: "Hizmetler",
  servicesTitle: "Her tekne, kendi şartlarına göre bakım ister.",
  servicesIntro: "Kompozit, marin elektrik ve elektronik, iklimlendirme, mekanik tesisat, motor-tahrik-dümen, yelken arma ve güverte ekipmanları için bakım, yenileme ve servis işlerini teknenin gerçek ihtiyacına göre planlıyoruz.",
  servicesLink: "Tüm hizmetleri görün",
  projectsEyebrow: "Son projeler",
  projectsTitle: <>Gerçek tekneler. <em>Gerçek çözümler.</em></>,
  projectsLink: "Tüm projeleri görün",
  projectAlt: "bakım projesi",
  projectCta: "Projeyi incele",
  projectsEmpty: "Henüz yayınlanmış proje bulunmuyor. Yeni saha çalışmaları yayınlandığında bu alanda görünecek.",
  beforeAfterEyebrow: "Önce / Sonra",
  beforeAfterTitle: <>Dönüşümü <em>görün.</em></>,
  beforeAfterLink: "Daha fazlasını gör",
  beforeAfterBeforeAlt: "önce",
  beforeAfterAfterAlt: "sonra",
  beforeAfterEmpty: "Yayınlanmış karşılaştırma projesi bulunmuyor.",
  processEyebrow: "Nasıl çalışıyoruz?",
  processSteps: [
    { title: "Keşif", body: "Teknenin mevcut durumunu ve ihtiyaçlarını yerinde dinliyoruz.", icon: MapPin },
    { title: "Teknik değerlendirme", body: "Sistemin kaynağını ve uygulanabilir çözüm seçeneklerini belirliyoruz.", icon: ClipboardCheck },
    { title: "Planlama", body: "İş kapsamını, malzemeyi ve uygulama sırasını netleştiriyoruz.", icon: CalendarClock },
    { title: "Uygulama", body: "Çözümü deneyimli ekibimizle sahada gerçekleştiriyoruz.", icon: Wrench },
    { title: "Test ve teslim", body: "Sistemi kontrol ediyor, çalışır şekilde teslim ediyoruz.", icon: ShieldCheck },
  ],
  partnersEyebrow: "Markalarımız",
  partnersTitle: "Güvendiğimiz markalarla çalışıyoruz.",
  logoAlt: "logosu",
  knowledgeEyebrow: "Teknik Bilgiler",
  knowledgeTitle: "Bakım kararlarını daha görünür ve uygulanabilir hale getiren notlar.",
  knowledgeLink: "Tüm teknik bilgileri görün",
  knowledgeEmpty: "Henüz yayınlanmış teknik bilgi bulunmuyor.",
  checkupEyebrow: "Teknik check-up",
  checkupTitle: "Teknenizin gerçek durumunu biliyor musunuz?",
  checkupBody: "Profesyonel teknik check-up ile teknenizin temel sistemlerini kontrol ediyor, anlaşılır bir bakım raporunu sizinle paylaşıyoruz.",
  checkupCta: "Check-up talep et",
  checkupBenefits: [
    { title: "Elektrik kontrolü", icon: BatteryCharging },
    { title: "Motor & tahrik kontrolü", icon: Settings2 },
    { title: "Mekanik sistemler", icon: Wrench },
    { title: "Güvenlik kontrolü", icon: ShieldCheck },
  ],
  heroImgAlt: "Orta ölçekli motor yatın bakım ve refit için tekne sahasında bulunduğu görünüm",
  checkupImgAlt: "Tekne ekspertiz raporu ve teknik check-up checklist görseli",
};

const contentEn: typeof contentTr = {
  heroEyebrow: "Production · Maintenance & Repair · Refit",
  heroTitle: <>Confidence at sea<br /><em>starts in the details.</em></>,
  heroLede: "Engineering, maintenance, renewal, and technical service solutions tailored to your boat's needs.",
  heroCta1: "Explore services",
  heroCta2: "Tell us about your boat",
  sideNoteBody: "We understand your boat's current condition and build the right intervention plan.",
  scrollExplore: "Explore",
  trust1: ["Field experience", "accumulated know-how in boat and yacht maintenance"],
  trust2: ["Planned communication", "clear follow-up whenever you need it"],
  trust3: ["Right-fit material selection", "a materials plan matched to the need"],
  trust4: ["Open scope", "the right line item and next step"],
  servicesEyebrow: "Services",
  servicesTitle: "Every boat needs maintenance suited to its own conditions.",
  servicesIntro: "We plan maintenance, renewal, and service work for composite, marine electrical and electronics, climate control, mechanical systems, propulsion-steering, sailing rig, and deck equipment based on the boat's real need.",
  servicesLink: "View all services",
  projectsEyebrow: "Recent Projects",
  projectsTitle: <>Real boats. <em>Real solutions.</em></>,
  projectsLink: "View all projects",
  projectAlt: "maintenance project",
  projectCta: "View project",
  projectsEmpty: "No published projects yet. New field work will appear here once published.",
  beforeAfterEyebrow: "Before / After",
  beforeAfterTitle: <>See the <em>transformation.</em></>,
  beforeAfterLink: "See more",
  beforeAfterBeforeAlt: "before",
  beforeAfterAfterAlt: "after",
  beforeAfterEmpty: "No published comparison projects yet.",
  processEyebrow: "How We Work",
  processSteps: [
    { title: "Discovery", body: "We listen to the boat's current condition and needs on site.", icon: MapPin },
    { title: "Technical assessment", body: "We identify the source of the issue and the possible solution options.", icon: ClipboardCheck },
    { title: "Planning", body: "We finalize the scope of work, materials, and application order.", icon: CalendarClock },
    { title: "Application", body: "We carry out the solution on site with our experienced team.", icon: Wrench },
    { title: "Test and handover", body: "We check the system and hand it over in working order.", icon: ShieldCheck },
  ],
  partnersEyebrow: "Our Brands",
  partnersTitle: "We work with brands we trust.",
  logoAlt: "logo",
  knowledgeEyebrow: "Technical Notes",
  knowledgeTitle: "Notes that make maintenance decisions clearer and more actionable.",
  knowledgeLink: "View all technical notes",
  knowledgeEmpty: "No published technical notes yet.",
  checkupEyebrow: "Technical Checkup",
  checkupTitle: "Do you know your boat's real condition?",
  checkupBody: "With a professional technical checkup, we inspect your boat's core systems and share a clear maintenance report with you.",
  checkupCta: "Request a checkup",
  checkupBenefits: [
    { title: "Electrical check", icon: BatteryCharging },
    { title: "Engine & propulsion check", icon: Settings2 },
    { title: "Mechanical systems", icon: Wrench },
    { title: "Safety check", icon: ShieldCheck },
  ],
  heroImgAlt: "A mid-size motor yacht in the boatyard for maintenance and refit",
  checkupImgAlt: "Boat survey report and technical checkup checklist image",
};

export default function Home() {
  const { lang, toPath } = useLanguage();
  const t = lang === "en" ? contentEn : contentTr;
  const technicalFallback = lang === "en" ? technicalFallbackEn : technicalFallbackTr;
  const projectFallback = lang === "en" ? projectFallbackEn : projectFallbackTr;
  useEffect(() => {
    const title = lang === "en"
      ? "Perla Marine | Boat & Yacht Maintenance and Repair"
      : "Perla Marine | Tekne ve Yat Bakım-Onarım";
    const description = lang === "en"
      ? "Perla Marine provides engineering-grade maintenance, repair, refit, and technical service solutions for boats and yachts."
      : "Perla Marine; tekne ve yat sahiplerine mühendislik disipliniyle bakım, onarım, refit ve teknik servis çözümleri sunar.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}${toPath("/")}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${SITE_URL}${toPath("/")}`);
  }, [lang]);
  const [knowledgeData, setKnowledgeData] = useState<KnowledgePostRow[] | null>(null);
  const [knowledgeError, setKnowledgeError] = useState(false);
  const [knowledgeLoading, setKnowledgeLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<ProjectRow[] | null>(null);
  const [projectsError, setProjectsError] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [partnersData, setPartnersData] = useState<PartnerRow[] | null>(null);
  useEffect(() => {
    getPublishedKnowledgePosts().then(setKnowledgeData).catch(() => setKnowledgeError(true)).finally(() => setKnowledgeLoading(false));
    getPublishedProjects().then(setProjectsData).catch(() => setProjectsError(true)).finally(() => setProjectsLoading(false));
    getPublishedPartners().then(setPartnersData).catch(() => setPartnersData([]));
  }, []);
  const technicalCardsRaw = knowledgeError ? technicalFallback : (knowledgeData ?? []).slice(0, 3);
  const technicalCards = lang === "en" ? technicalCardsRaw.map((post) => "titleEn" in post ? {
    ...post,
    category: (post as KnowledgePostRow).categoryEn || post.category,
    title: (post as KnowledgePostRow).titleEn || post.title,
    excerpt: (post as KnowledgePostRow).excerptEn || post.excerpt,
  } : post) : technicalCardsRaw;
  const displayProjectsRaw = projectsError ? projectFallback : (projectsData ?? []).filter((project) => project.status === "published").slice(0, 3);
  const displayProjects = lang === "en" ? displayProjectsRaw.map((project) => "titleEn" in project ? {
    ...project,
    label: (project as ProjectRow).labelEn || project.label,
    title: (project as ProjectRow).titleEn || project.title,
    detail: (project as ProjectRow).detailEn || project.detail,
  } : project) : displayProjectsRaw;
  const localizedPartners = partnersData ? partnersData.map((partner) => localizePartner(partner, lang)) : partnersData;
  return (
    <div className="home-page-compact">
      <section className="hero-section" id="giris">
        <img
          className="hero-section__image"
          src="/manus-storage/perla-hero-medium-yacht-service_7ccec84c_3e23263b.webp"
          width={1920}
          height={1080}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          alt={t.heroImgAlt}
        />
        <div className="hero-section__overlay" />
        <div className="hero-section__content">
          <p className="eyebrow eyebrow--light">{t.heroEyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-section__lede">{t.heroLede}</p>
          <div className="hero-section__actions">
            <a className="button button--gold" href={toPath("/hizmetler")}>
              {t.heroCta1} <ArrowDownRight size={17} />
            </a>
            <a className="button button--outline-light" href="#iletisim">
              {t.heroCta2} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="hero-section__side-note">
          <span>PERLA MARINE</span>
          <p>{t.sideNoteBody}</p>
        </div>
        <a className="hero-section__scroll" href="#hizmetler" aria-label={lang === "en" ? "Scroll to Services section" : "Hizmetler bölümüne kaydır"}>
          <span>{t.scrollExplore}</span>
          <MoveRight size={16} />
        </a>
      </section>

      <section className="trust-strip" aria-label={lang === "en" ? "Perla Marine working assurances" : "Perla Marine çalışma güvenceleri"}>
        <div><Clock3 size={19} aria-hidden="true" /><span><b>{t.trust1[0]}</b><small>{t.trust1[1]}</small></span></div>
        <div><ShieldCheck size={19} aria-hidden="true" /><span><b>{t.trust2[0]}</b><small>{t.trust2[1]}</small></span></div>
        <div><Check size={19} aria-hidden="true" /><span><b>{t.trust3[0]}</b><small>{t.trust3[1]}</small></span></div>
        <div><Wrench size={19} aria-hidden="true" /><span><b>{t.trust4[0]}</b><small>{t.trust4[1]}</small></span></div>
      </section>

      <section id="hizmetler" className="section section--services-intro">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">{t.servicesEyebrow}</p>
            <h2>{t.servicesTitle}</h2>
          </div>
          <p>{t.servicesIntro}</p>
        </div>
        <ServiceGrid />
        <a className="text-link text-link--dark section-link" href={toPath("/hizmetler")}>
          {t.servicesLink} <ArrowUpRight size={16} />
        </a>
      </section>

      <div className="home-project-block" aria-label={lang === "en" ? "Projects and working process" : "Projeler ve çalışma süreci"}>
        <section id="projeler" className="home-projects-section">
          <div className="section-heading section-heading--split home-projects-heading">
            <div><p className="eyebrow">{t.projectsEyebrow}</p><h2>{t.projectsTitle}</h2></div>
            <div className="home-projects-heading__actions"><a className="text-link text-link--dark" href={toPath("/projeler")}>{t.projectsLink} <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="home-project-carousel-shell">
            <div className="home-project-carousel" tabIndex={0} aria-label={lang === "en" ? "Latest three project cards" : "Son üç proje kartı"}>
              <div className="home-project-carousel__track">{projectsLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--project" key={`project-skeleton-${index}`} aria-hidden="true" />) : displayProjects.length > 0 ? displayProjects.map((project) => <a className="home-project-card" key={project.slug} href={toPath(`/projeler/${project.slug}`)}><img className="home-project-card__cover" src={project.afterImage} alt={`${project.title} ${t.projectAlt}`} loading="lazy" decoding="async" /><div className="home-project-card__overlay"><span>{project.label}</span><h3>{shortenProjectText(project.title, 62)}</h3><p>{shortenProjectText(project.detail, 165)}</p><strong>{t.projectCta} <ChevronRight size={15} /></strong></div></a>) : <p className="home-content-empty">{t.projectsEmpty}</p>}</div>
            </div>
          </div>
        </section>

        <section id="once-sonra" className="home-before-after-section">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">{t.beforeAfterEyebrow}</p><h2>{t.beforeAfterTitle}</h2></div>
            <a className="text-link text-link--dark" href={toPath("/projeler")}>{t.beforeAfterLink} <ArrowUpRight size={16} /></a>
          </div>
          <div className="home-before-after-grid">
            {projectsLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--project" key={`comparison-skeleton-${index}`} aria-hidden="true" />) : displayProjects.length > 0 ? displayProjects.map((project) => <article className="home-before-after-card" key={`${project.slug}-comparison`}><BeforeAfterSlider before={project.beforeImage} after={project.afterImage} beforeAlt={`${project.title} ${t.beforeAfterBeforeAlt}`} afterAlt={`${project.title} ${t.beforeAfterAfterAlt}`} label={project.title} /></article>) : <p className="home-content-empty">{t.beforeAfterEmpty}</p>}
          </div>
        </section>

        <section className="home-process-strip" aria-labelledby="home-process-title">
          <div className="home-process-strip__heading"><div><p className="eyebrow">{t.processEyebrow}</p><span id="home-process-title" className="sr-only">{t.processEyebrow}</span></div></div>
          <div className="home-process-strip__steps">{t.processSteps.map(({ title, body, icon: Icon }) => <article key={title}><span className="home-process-strip__icon"><Icon size={21} strokeWidth={1.25} aria-hidden="true" /></span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
        </section>
      </div>

      {localizedPartners && localizedPartners.length > 0 && (
        <section className="section partners-band">
          <div className="section-heading">
            <div><p className="eyebrow">{t.partnersEyebrow}</p><h2>{t.partnersTitle}</h2></div>
          </div>
          <div className="partners-band__grid">
            {localizedPartners.map((partner) => {
              const card = (
                <>
                  {partner.logo && <img className="partners-band__logo" src={partner.logo} alt={`${partner.name} ${t.logoAlt}`} loading="lazy" decoding="async" />}
                  <div className="partners-band__copy">
                    <h3>{partner.name}</h3>
                    <p>{partner.relationship}</p>
                  </div>
                </>
              );
              return partner.website ? (
                <a className="partners-band__card" key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer">{card}</a>
              ) : (
                <div className="partners-band__card" key={partner.id}>{card}</div>
              );
            })}
          </div>
        </section>
      )}

      <section id="teknik-bilgiler" className="section journal-section">
        <div className="section-heading section-heading--split">
          <div><p className="eyebrow">{t.knowledgeEyebrow}</p><h2>{t.knowledgeTitle}</h2></div>
          <a className="text-link text-link--dark" href={toPath("/teknik-bilgiler")}>{t.knowledgeLink} <ArrowUpRight size={16} /></a>
        </div>
        <div className="journal-grid">{knowledgeLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--journal" key={`journal-skeleton-${index}`} aria-hidden="true" />) : technicalCards.length > 0 ? technicalCards.map((card) => <a key={card.slug} href={toPath(`/teknik-bilgiler/${card.slug}`)} className="journal-card">{card.coverImage && <img className="journal-card__cover" src={card.coverImage} alt="" loading="lazy" decoding="async" />}<div className="journal-card__body"><span>{card.category}</span><h3>{card.title}</h3><p>{card.excerpt}</p><FileText size={19} /></div></a>) : <p className="home-content-empty">{t.knowledgeEmpty}</p>}</div>
      </section>

      <ServiceFAQ compact />

      <section id="iletisim" className="checkup-cta" aria-labelledby="checkup-title">
        <div className="checkup-cta__image"><img src="/manus-storage/perla-marine-checkup-inspection-report_423e7f5f.jpg" alt={t.checkupImgAlt} loading="lazy" decoding="async" /></div>
        <div className="checkup-cta__copy">
          <p className="eyebrow eyebrow--light">{t.checkupEyebrow}</p>
          <h2 id="checkup-title">{t.checkupTitle}</h2>
          <p>{t.checkupBody}</p>
          <a className="button button--gold" href={`${toPath("/iletisim")}?kategori=Teknik%20checkup`}>{t.checkupCta} <ArrowUpRight size={17} /></a>
        </div>
        <div className="checkup-cta__benefits" aria-label={lang === "en" ? "Technical checkup scope" : "Teknik check-up kapsamı"}>
          {t.checkupBenefits.map(({ title, icon: Icon }) => <div className="checkup-cta__benefit" key={title}><Icon size={26} strokeWidth={1.35} aria-hidden="true" /><span>{title}</span></div>)}
        </div>
      </section>
    </div>
  );
}
