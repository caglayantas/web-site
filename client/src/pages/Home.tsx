import { useEffect, useRef, useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ServiceGrid from "@/components/ServiceGrid";
import ServiceFAQ from "@/components/ServiceFAQ";
import { getPublishedKnowledgePosts, getPublishedProjects, type KnowledgePostRow, type ProjectRow } from "@/lib/content";
import { ArrowDownRight, ArrowUpRight, BatteryCharging, CalendarClock, Check, ChevronRight, ClipboardCheck, Clock3, FileText, MapPin, Settings2, ShieldCheck, Wrench, MoveRight } from "lucide-react";

const SITE_URL = "https://www.perlamarine.com";



const technicalFallback = [{ category: "Elektrik ve enerji sistemleri", title: "Lityum ve akü sistemlerinde bakım kontrolü nerede başlar?", excerpt: "Bağlantı düzeni, şarj davranışı ve servis erişimi üzerinden pratik bir kontrol çerçevesi.", slug: "lityum-ve-aku", coverImage: "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp" }, { category: "Motor, tahrik ve dümen", title: "Motor, şaft ve dümen sistemlerinde bakım işaretleri.", excerpt: "Titreşim, ses, boşluk ve bağlantı değişimlerini erken fark etmek için saha notları.", slug: "motor-saft", coverImage: "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp" }, { category: "Mekanik tesisatlar", title: "Pompa, vana ve hortum hatlarında planlı bakım.", excerpt: "Sızdırmazlık, erişim ve deniz suyu sistemlerinde düzenli kontrolün pratik karşılığı.", slug: "pompa-vana", coverImage: "/manus-storage/perla-service-mechanical-v2-1600_b2b0c9ef.webp" }];
const projectFallback = [{ slug: "elektrik-enerji", label: "Elektrik ve enerji", title: "Akü ve güç dağıtım sistemi", detail: "Mevcut pano düzeninin okunabilirliği, bağlantı güvenliği ve servis erişimi için planlanan kapsam.", beforeImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp", afterImage: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp" }, { slug: "motor-tahrik", label: "Motor ve tahrik", title: "Şaft ve pervane sistemi", detail: "Motor, şaft, kaplin ve pervane hattında bakım önceliklerini görünür kılan çalışma.", beforeImage: "/manus-storage/perla-service-propulsion_1dad9846.jpg", afterImage: "/manus-storage/perla-service-mechanical_1537487f.jpg" }, { slug: "mekanik-sistemler", label: "Mekanik sistemler", title: "Yakıt ve sintine hatları", detail: "Pompa, vana, hortum ve erişim noktalarının servis planına alınması.", beforeImage: "/manus-storage/perla-service-mechanical_1537487f.jpg", afterImage: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp" }];
const processSteps = [{ title: "Keşif", body: "Teknenin mevcut durumunu ve ihtiyaçlarını yerinde dinliyoruz.", icon: MapPin }, { title: "Teknik değerlendirme", body: "Sistemin kaynağını ve uygulanabilir çözüm seçeneklerini belirliyoruz.", icon: ClipboardCheck }, { title: "Planlama", body: "İş kapsamını, malzemeyi ve uygulama sırasını netleştiriyoruz.", icon: CalendarClock }, { title: "Uygulama", body: "Çözümü deneyimli ekibimizle sahada gerçekleştiriyoruz.", icon: Wrench }, { title: "Test ve teslim", body: "Sistemi kontrol ediyor, çalışır şekilde teslim ediyoruz.", icon: ShieldCheck }];
const checkupBenefits = [{ title: "Elektrik kontrolü", icon: BatteryCharging }, { title: "Motor & tahrik kontrolü", icon: Settings2 }, { title: "Mekanik sistemler", icon: Wrench }, { title: "Güvenlik kontrolü", icon: ShieldCheck }];
const shortenProjectText = (text: string, limit: number) => { const firstSentence = text.split(/[.!?]/)[0]?.trim() || text.trim(); return firstSentence.length <= limit ? firstSentence : `${firstSentence.slice(0, limit - 1).trimEnd()}…`; };

export default function Home() {
  const [knowledgeData, setKnowledgeData] = useState<KnowledgePostRow[] | null>(null);
  const [knowledgeError, setKnowledgeError] = useState(false);
  const [knowledgeLoading, setKnowledgeLoading] = useState(true);
  const [projectsData, setProjectsData] = useState<ProjectRow[] | null>(null);
  const [projectsError, setProjectsError] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  useEffect(() => {
    getPublishedKnowledgePosts().then(setKnowledgeData).catch(() => setKnowledgeError(true)).finally(() => setKnowledgeLoading(false));
    getPublishedProjects().then(setProjectsData).catch(() => setProjectsError(true)).finally(() => setProjectsLoading(false));
  }, []);
  const technicalCards = knowledgeError ? technicalFallback : (knowledgeData ?? []).slice(0, 3);
  const displayProjects = projectsError ? projectFallback : (projectsData ?? []).filter((project) => project.status === "published").slice(0, 3);
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
          alt="Orta ölçekli motor yatın bakım ve refit için tekne sahasında bulunduğu görünüm"
        />
        <div className="hero-section__overlay" />
        <div className="hero-section__content">
          <p className="eyebrow eyebrow--light">Üretim · Bakım &amp; Onarım · Refit</p>
          <h1>
            Denizde güven,
            <br />
            <em>detaylarda başlar.</em>
          </h1>
          <p className="hero-section__lede">
            Teknenizin ihtiyaçlarına özel mühendislik, bakım, yenileme ve teknik servis çözümleri.
          </p>
          <div className="hero-section__actions">
            <a className="button button--gold" href="/hizmetler">
              Hizmetleri keşfedin <ArrowDownRight size={17} />
            </a>
            <a className="button button--outline-light" href="#iletisim">
              Teknenizi anlatın <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="hero-section__side-note">
          <span>PERLA MARINE</span>
          <p>Teknenizin mevcut durumunu anlayıp, doğru müdahale planını oluşturuyoruz.</p>
        </div>
        <a className="hero-section__scroll" href="#hizmetler" aria-label="Hizmetler bölümüne kaydır">
          <span>Keşfet</span>
          <MoveRight size={16} />
        </a>
      </section>

      <section className="trust-strip" aria-label="Perla Marine çalışma güvenceleri">
        <div><Clock3 size={19} aria-hidden="true" /><span><b>Saha deneyimi</b><small>tekne ve yat bakımında birikim</small></span></div>
        <div><ShieldCheck size={19} aria-hidden="true" /><span><b>Planlı iletişim</b><small>ihtiyaç halinde net geri dönüş</small></span></div>
        <div><Check size={19} aria-hidden="true" /><span><b>Uygun parça seçimi</b><small>ihtiyaca göre malzeme planı</small></span></div>
        <div><Wrench size={19} aria-hidden="true" /><span><b>Açık kapsam</b><small>doğru iş kalemi ve sonraki adım</small></span></div>
      </section>

      <section id="hizmetler" className="section section--services-intro">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Hizmetler</p>
            <h2>Her tekne, kendi şartlarına göre bakım ister.</h2>
          </div>
          <p>
            Kompozit, marin elektrik ve elektronik, iklimlendirme, mekanik tesisat, motor-tahrik-dümen, yelken arma ve güverte ekipmanları için bakım, yenileme ve servis işlerini teknenin gerçek ihtiyacına göre planlıyoruz.
          </p>
        </div>
        <ServiceGrid />
        <a className="text-link text-link--dark section-link" href="/hizmetler">
          Tüm hizmetleri görün <ArrowUpRight size={16} />
        </a>
      </section>

      <div className="home-project-block" aria-label="Projeler ve çalışma süreci">
        <section id="projeler" className="home-projects-section">
          <div className="section-heading section-heading--split home-projects-heading">
            <div><p className="eyebrow">Son projeler</p><h2>Gerçek tekneler. <em>Gerçek çözümler.</em></h2></div>
            <div className="home-projects-heading__actions"><a className="text-link text-link--dark" href="/projeler">Tüm projeleri görün <ArrowUpRight size={16} /></a></div>
          </div>
          <div className="home-project-carousel-shell">
            <div className="home-project-carousel" tabIndex={0} aria-label="Son üç proje kartı">
              <div className="home-project-carousel__track">{projectsLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--project" key={`project-skeleton-${index}`} aria-hidden="true" />) : displayProjects.length > 0 ? displayProjects.map((project) => <a className="home-project-card" key={project.slug} href={`/projeler/${project.slug}`}><img className="home-project-card__cover" src={project.afterImage} alt={`${project.title} bakım projesi`} loading="lazy" decoding="async" /><div className="home-project-card__overlay"><span>{project.label}</span><h3>{shortenProjectText(project.title, 50)}</h3><p>{shortenProjectText(project.detail, 130)}</p><strong>Projeyi incele <ChevronRight size={15} /></strong></div></a>) : <p className="home-content-empty">Henüz yayınlanmış proje bulunmuyor. Yeni saha çalışmaları yayınlandığında bu alanda görünecek.</p>}</div>
            </div>
          </div>
        </section>

        <section id="once-sonra" className="home-before-after-section">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">Önce / Sonra</p><h2>Dönüşümü <em>görün.</em></h2></div>
            <a className="text-link text-link--dark" href="/projeler">Daha fazlasını gör <ArrowUpRight size={16} /></a>
          </div>
          <div className="home-before-after-grid">
            {projectsLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--project" key={`comparison-skeleton-${index}`} aria-hidden="true" />) : displayProjects.length > 0 ? displayProjects.map((project) => <article className="home-before-after-card" key={`${project.slug}-comparison`}><BeforeAfterSlider before={project.beforeImage} after={project.afterImage} beforeAlt={`${project.title} önce`} afterAlt={`${project.title} sonra`} label={project.title} /></article>) : <p className="home-content-empty">Yayınlanmış karşılaştırma projesi bulunmuyor.</p>}
          </div>
        </section>

        <section className="home-process-strip" aria-labelledby="home-process-title">
          <div className="home-process-strip__heading"><div><p className="eyebrow">Nasıl çalışıyoruz?</p><span id="home-process-title" className="sr-only">Nasıl çalışıyoruz?</span></div></div>
          <div className="home-process-strip__steps">{processSteps.map(({ title, body, icon: Icon }) => <article key={title}><span className="home-process-strip__icon"><Icon size={21} strokeWidth={1.25} aria-hidden="true" /></span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div>
        </section>
      </div>

      <section id="teknik-bilgiler" className="section journal-section">
        <div className="section-heading section-heading--split">
          <div><p className="eyebrow">Teknik Bilgiler</p><h2>Bakım kararlarını daha görünür ve uygulanabilir hale getiren notlar.</h2></div>
          <a className="text-link text-link--dark" href="/teknik-bilgiler">Tüm teknik bilgileri görün <ArrowUpRight size={16} /></a>
        </div>
        <div className="journal-grid">{knowledgeLoading ? [0, 1, 2].map((index) => <div className="home-content-skeleton home-content-skeleton--journal" key={`journal-skeleton-${index}`} aria-hidden="true" />) : technicalCards.length > 0 ? technicalCards.map((card) => <a key={card.slug} href={`/teknik-bilgiler/${card.slug}`} className="journal-card">{card.coverImage && <img className="journal-card__cover" src={card.coverImage} alt="" loading="lazy" decoding="async" />}<div className="journal-card__body"><span>{card.category}</span><h3>{card.title}</h3><p>{card.excerpt}</p><FileText size={19} /></div></a>) : <p className="home-content-empty">Henüz yayınlanmış teknik bilgi bulunmuyor.</p>}</div>
      </section>

      <ServiceFAQ compact />

      <section id="iletisim" className="checkup-cta" aria-labelledby="checkup-title">
        <div className="checkup-cta__image"><img src="/manus-storage/perla-marine-checkup-inspection-report_423e7f5f.jpg" alt="Tekne ekspertiz raporu ve teknik check-up checklist görseli" loading="lazy" decoding="async" /></div>
        <div className="checkup-cta__copy">
          <p className="eyebrow eyebrow--light">Teknik check-up</p>
          <h2 id="checkup-title">Teknenizin gerçek durumunu biliyor musunuz?</h2>
          <p>Profesyonel teknik check-up ile teknenizin temel sistemlerini kontrol ediyor, anlaşılır bir bakım raporunu sizinle paylaşıyoruz.</p>
          <a className="button button--gold" href="/iletisim">Check-up talep et <ArrowUpRight size={17} /></a>
        </div>
        <div className="checkup-cta__benefits" aria-label="Teknik check-up kapsamı">
          {checkupBenefits.map(({ title, icon: Icon }) => <div className="checkup-cta__benefit" key={title}><Icon size={26} strokeWidth={1.35} aria-hidden="true" /><span>{title}</span></div>)}
        </div>
      </section>
    </div>
  );
}
