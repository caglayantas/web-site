import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ServiceGrid from "@/components/ServiceGrid";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Check,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Factory,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Settings2,
  Wrench,
  X,
} from "lucide-react";

/* =========================================================
   SITE CONFIG
========================================================= */

const SITE_URL = "https://www.perlamarine.com";

/*
 * Manus bağımlılığı yok.
 *
 * Tüm görseller public/images klasöründen okunur.
 *
 * Örnek:
 * public/manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp
 *
 * URL:
 * /manus-storage/perla-about-drydock-inspection-1600_2eb4cbac.webp
 */

/* =========================================================
   TYPES
========================================================= */

type PageData = {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  image: string;
  alt: string;
};

type Project = {
  id: number | string;
  slug: string;
  label: string;
  title: string;
  detail: string;
  scope: string;
  systems: string;
  results: string;
  before: string;
  after: string;
};

type KnowledgePost = {
  id: number | string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  publishedAt: string | null;
};

type FormState = {
  name: string;
  email: string;
  service: string;
  message: string;
};

export type CorporateContactErrors = Partial<FormState> & {
  consent?: string;
};

/* =========================================================
   PAGE DATA
========================================================= */

const pageData: Record<string, PageData> = {
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

/* =========================================================
   SERVICE DATA
========================================================= */

const serviceGroups = [
  [
    "Kompozit çözümler",
    "Model, kalıp, üretim, yapısal tamir ve yüzey yenileme.",
  ],
  [
    "Marin elektrik",
    "Akü, şarj, lityum-BMS, dağıtım panoları ve enerji altyapısı.",
  ],
  [
    "Marin elektroniği",
    "Navigasyon, radar, kamera, uydu ve uzaktan izleme sistemleri.",
  ],
  [
    "Isıtma-soğutma",
    "Klima, Webasto, fan, havalandırma ve iklimlendirme bakımı.",
  ],
  [
    "Mekanik tesisat",
    "Yakıt, siyah su, gri su, sintine ve tatlı su sistemleri.",
  ],
  [
    "Motor, tahrik ve dümen",
    "Motor, şaft, kaplin, pervane ve dümen sistemleri.",
  ],
  [
    "Yelken ve arma donanım",
    "Vinç, makara, direk, arma, tel, halat ve yelken donanımlarının montajı ve bakımı.",
  ],
  [
    "Üretim danışmanlığı",
    "Üretim planlama, servis erişimi, teknik dokümantasyon ve saha koordinasyonu.",
  ],
  [
    "Tekneye özel çözümler",
    "Teknenin kullanım amacı ve mevcut altyapısına göre keşif, refit ve sistem koordinasyonu.",
  ],
];

/* =========================================================
   FALLBACK PROJECT DATA
========================================================= */

const fallbackProjects: Project[] = [
  {
    id: 1,
    slug: "elektrik-enerji",
    label: "Elektrik ve enerji",
    title: "Akü ve güç dağıtım sistemi",
    detail:
      "Mevcut pano düzeninin okunabilirliği, bağlantı güvenliği ve servis erişimi için kontrol kapsamı.",
    scope:
      "Akü grubu, şarj hattı, ana dağıtım ve servis erişimi kontrol edildi.",
    systems:
      "Akü, şarj cihazı, BMS, sigorta ve güç dağıtım panosu.",
    results:
      "Bağlantı düzeni sadeleştirildi; bakım ve arıza tespiti için daha okunabilir bir altyapı hedeflendi.",
    before: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp",
    after: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp",
  },

  {
    id: 2,
    slug: "motor-tahrik",
    label: "Motor ve tahrik",
    title: "Şaft ve pervane sistemi",
    detail:
      "Motor, şaft, kaplin ve pervane hattında bakım önceliklerini görünür kılan teknik değerlendirme.",
    scope:
      "Motor bağlantıları, şaft hattı, kaplin ve pervane çevresindeki erişim noktaları ele alındı.",
    systems:
      "İçten takma motor, şaft, kaplin, pervane ve dümen hattı.",
    results:
      "Tahrik hattındaki kontrol noktaları servis planına alınarak sonraki bakım adımları netleştirildi.",
    before: "/manus-storage/perla-service-propulsion_1dad9846.jpg",
    after: "/manus-storage/perla-service-mechanical_1537487f.jpg",
  },

  {
    id: 3,
    slug: "mekanik-sistemler",
    label: "Mekanik sistemler",
    title: "Yakıt ve sintine hatları",
    detail:
      "Pompa, vana, hortum ve erişim noktalarının servis planına alınması için sistem bazlı kontrol.",
    scope:
      "Pompa, vana, hortum, bağlantı ve sintine erişim noktaları kontrol kapsamına alındı.",
    systems:
      "Yakıt, sintine, deniz suyu, pompa ve vana hatları.",
    results:
      "Sızdırmazlık ve erişim öncelikleri görünür hale getirilerek planlı bakım akışına dönüştürüldü.",
    before: "/manus-storage/perla-service-mechanical_1537487f.jpg",
    after: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp",
  },
];

/* =========================================================
   FALLBACK KNOWLEDGE
========================================================= */

const fallbackKnowledge: KnowledgePost[] = [
  {
    id: 1,
    slug: "tekne-marin-elektrik-sistemleri-ve-lityum-aku-bms-bakimi",
    category: "Marin elektrik ve enerji sistemleri",
    title:
      "Tekne marin elektrik sistemleri ve lityum akü BMS bakımı",
    excerpt:
      "Akü, şarj, güç dağıtımı ve BMS katmanlarını birlikte değerlendiren pratik bakım çerçevesi.",
    body:
      "Akü, şarj ve BMS sistemlerinin birlikte değerlendirilmesi; güvenli ve sürdürülebilir bir marin enerji altyapısı için temel adımdır.",
    coverImage:
      "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp",
    publishedAt: null,
  },

  {
    id: 2,
    slug: "tekne-motor-saft-pervane-ve-dumen-sistemi-bakim-kontrolu",
    category: "Motor, tahrik ve dümen sistemleri",
    title:
      "Tekne motor, şaft, pervane ve dümen sistemi bakım kontrolü",
    excerpt:
      "Titreşim, ses, boşluk ve bağlantı değişimlerini erken fark etmek için sistem bazlı kontrol notları.",
    body:
      "Motor ve tahrik sistemlerinde titreşim, bağlantı, şaft, kaplin ve pervane kontrolleri bakım planının önemli parçalarıdır.",
    coverImage:
      "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp",
    publishedAt: null,
  },

  {
    id: 3,
    slug: "tekne-mekanik-tesisat-bakiminda-pompa-vana-ve-hortum-kontrolu",
    category: "Mekanik tesisat ve tekne bakım",
    title:
      "Tekne mekanik tesisat bakımında pompa, vana ve hortum kontrolü",
    excerpt:
      "Sızdırmazlık, akış, erişim ve sintine güvenliği için uygulanabilir bakım adımları.",
    body:
      "Mekanik tesisatlarda sızdırmazlık, hortum bağlantıları, pompalar, vanalar ve servis erişimi düzenli olarak kontrol edilmelidir.",
    coverImage:
      "/manus-storage/perla-service-mechanical-v2-1600_b2b0c9ef.webp",
    publishedAt: null,
  },
];

/* =========================================================
   PAGE HERO
========================================================= */

function PageHero({ data, compact = false }: { data: PageData; compact?: boolean }) {
  return (
    <section className={`page-hero${compact ? " page-hero--compact" : ""}`}>
      <div className="page-hero__copy">
        <p className="eyebrow">{data.eyebrow}</p>

        <h1>{data.title}</h1>

        <p>{data.lead}</p>
      </div>

      <div className="page-hero__media">
        <img
          src={data.image}
          alt={data.alt}
          loading="eager"
          decoding="async"
        />
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
  description: string
) {
  useEffect(() => {
    document.title = title;

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        description
      );

    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute(
        "href",
        `${SITE_URL}${path}`
      );

    document
      .querySelector(
        'meta[property="og:title"]'
      )
      ?.setAttribute(
        "content",
        title
      );

    document
      .querySelector(
        'meta[property="og:description"]'
      )
      ?.setAttribute(
        "content",
        description
      );

    document
      .querySelector(
        'meta[property="og:url"]'
      )
      ?.setAttribute(
        "content",
        `${SITE_URL}${path}`
      );

    return () => {
      document.title =
        "Perla Marine | Tekne ve Yat Bakım-Onarım";
    };
  }, [
    path,
    title,
    description,
  ]);
}

/* =========================================================
   ABOUT
========================================================= */

export function AboutNew() {
  usePageMetadata(
    "/hakkimizda",
    "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis",
    "Perla Marine’in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu, teknik servis misyonunu ve iş yapma standardını keşfedin."
  );

  return (
    <PageFrame>
      <PageHero data={pageData.about} />

      <section
        className="about-identity"
        aria-labelledby="about-identity-title"
      >
        <div className="about-copy">
          <p className="eyebrow">
            Perla Marine kimdir?
          </p>

          <h2 id="about-identity-title">
            Denizcilik varlıklarını yalnızca onarmıyor,{" "}
            <em>geleceğe hazırlıyoruz.</em>
          </h2>

          <p>
            Perla Marine, tekne ve yat sahipleri,
            kaptanlar, işletmeciler ve üretici
            firmalar için bakım-onarım ve teknik
            servis süreçlerini yöneten kurumsal bir
            uygulama şirketidir.
          </p>

          <p>
            Çalışma alanımız; kompozit imalat ve
            tamirden marin elektrik ve lityum
            sistemlerine, elektronik altyapıdan
            motor-tahrik-dümen, mekanik tesisat ve
            güverte ekipmanlarına kadar teknenin
            teknik bütününü kapsar.
          </p>

          <p>
            Her operasyonu geçici bir müdahale olarak
            değil, teknenin güvenliğini,
            kullanılabilirliğini ve uzun vadeli
            işletme değerini destekleyen bir bakım
            kararı olarak ele alırız.
          </p>
        </div>

        <img
          src="/manus-storage/perla-about-technical-planning-1600_a1702930.webp"
          alt="Tekne refit süreci için teknik plan ve ölçüm araçlarını inceleyen uzman"
          loading="lazy"
          decoding="async"
        />
      </section>

      <section
        className="about-vision-mission"
        aria-labelledby="about-vision-title"
      >
        <div className="about-panel about-panel--navy">
          <p className="eyebrow eyebrow--light">
            Vizyonumuz
          </p>

          <h2 id="about-vision-title">
            Türkiye’de denizcilik bakımını,{" "}
            <em>
              standartları olan bir hizmet kültürüne
            </em>{" "}
            dönüştürmek.
          </h2>

          <p>
            Vizyonumuz; tekne bakımının yalnızca
            arıza ortaya çıktığında hatırlanan bir
            gider kalemi olmaktan çıkıp, planlı
            işletme ve güvenli seyir kültürünün
            ayrılmaz bir parçası haline gelmesidir.
          </p>

          <p>
            Bunun için teknik bilgiyi anlaşılır hale
            getiriyor, saha uygulamasını ölçülebilir
            bir iş akışıyla buluşturuyoruz.
          </p>

          <p>
            Müşterilerimizin kararlarını
            belirsizlikten uzaklaştıran; kapsamı,
            sorumluluğu ve sonraki adımı açıkça ortaya
            koyan bir bakım anlayışının denizcilik
            sektöründe kalıcı bir standarda
            dönüşmesini hedefliyoruz.
          </p>
        </div>

        <div className="about-panel about-panel--ivory">
          <p className="eyebrow">
            Misyonumuz
          </p>

          <h2>
            İhtiyacı doğru teşhis etmek,{" "}
            <em>
              doğru çözümü doğru kapsamda
            </em>{" "}
            uygulamak.
          </h2>

          <p>
            Misyonumuz; tekne sahibinin, kaptanın veya
            üretici ekibinin teknik ihtiyacını doğru
            anlayarak güvenli, uygulanabilir ve
            sürdürülebilir bir bakım-onarım çözümüne
            dönüştürmektir.
          </p>

          <p>
            Planlama, tedarik, uygulama, kontrol ve
            teslim aşamalarını birbirinden koparmadan
            yönetiriz.
          </p>

          <p>
            Böylece müşterilerimiz yalnızca bir servis
            hizmeti değil, kararlarını güvenle
            verebilecekleri kurumsal bir çalışma zemini
            elde eder.
          </p>
        </div>
      </section>

      <section
        className="about-promise"
        aria-labelledby="about-promise-title"
      >
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              Size ne vaat ediyoruz?
            </p>

            <h2 id="about-promise-title">
              Daha fazla söz değil,{" "}
              <em>
                daha net bir çalışma standardı.
              </em>
            </h2>
          </div>

          <p>
            Kurumsal hizmet anlayışımızın temelinde,
            işin başında verilen söz ile teslim edilen
            işin aynı kapsamda buluşması vardır.
          </p>
        </div>

        <div className="about-promise-grid">
          <article>
            <ClipboardCheck
              size={23}
              aria-hidden="true"
            />

            <h3>Şeffaf kapsam</h3>

            <p>
              İhtiyacı, önceliği ve uygulanacak
              operasyonu anlaşılır bir çerçevede
              tanımlar; kapsam dışı beklentileri
              baştan görünür kılarız.
            </p>
          </article>

          <article>
            <Settings2
              size={23}
              aria-hidden="true"
            />

            <h3>Disiplinli uygulama</h3>

            <p>
              İş programını, servis erişimini,
              sistemler arası ilişkileri ve kontrol
              adımlarını sahadaki gerçek koşullara göre
              yönetiriz.
            </p>
          </article>

          <article>
            <ShieldCheck
              size={23}
              aria-hidden="true"
            />

            <h3>İzlenebilir teslim</h3>

            <p>
              Yapılan işlemleri ve önerilen sonraki
              adımları açıkça paylaşır; teknenin bakım
              geçmişine değer katan bir iletişim
              bırakırız.
            </p>
          </article>
        </div>
      </section>

      <section
        className="about-trust"
        aria-labelledby="about-trust-title"
      >
        <div className="about-trust__intro">
          <p className="eyebrow eyebrow--light">
            Bize neden güvenmelisiniz?
          </p>

          <h2 id="about-trust-title">
            Çünkü güveni bir iddia olarak değil,{" "}
            <em>iş yapma biçimi</em> olarak görüyoruz.
          </h2>

          <p>
            Perla Marine ile çalışmak; teknik ihtiyacın
            doğru sorularla ele alınması, seçeneklerin
            anlaşılır biçimde değerlendirilmesi ve
            uygulamanın kontrol noktalarıyla ilerlemesi
            anlamına gelir.
          </p>
        </div>

        <div className="about-trust__grid">
          <article>
            <Compass
              size={22}
              aria-hidden="true"
            />

            <h3>Saha deneyimi</h3>

            <p>
              Kararlarımızı yalnızca katalog bilgisine
              değil, tekne üzerinde karşılaşılan erişim,
              kullanım ve bakım koşullarına
              dayandırırız.
            </p>
          </article>

          <article>
            <Wrench
              size={22}
              aria-hidden="true"
            />

            <h3>Teknik bütünlük</h3>

            <p>
              Kompozit, elektrik, elektronik, mekanik,
              tahrik ve güverte sistemlerini birbirinden
              bağımsız parçalar değil, birlikte çalışan
              bir yapı olarak değerlendiririz.
            </p>
          </article>

          <article>
            <Factory
              size={22}
              aria-hidden="true"
            />

            <h3>Kurumsal sorumluluk</h3>

            <p>
              Tekne sahipleri için güvenli bakım,
              üretici firmalar için uygulanabilir
              teknik koordinasyon ve tüm paydaşlar
              için açık iletişim standardı sunarız.
            </p>
          </article>

          <article>
            <Check
              size={22}
              aria-hidden="true"
            />

            <h3>Ölçülü vaat</h3>

            <p>
              Gerçek kapsamı görmeden kesin sonuç sözü
              vermek yerine, doğru inceleme ve doğru
              planlamayla güvenilir bir sonraki adım
              öneririz.
            </p>
          </article>
        </div>
      </section>

      <section
        className="about-references"
        aria-labelledby="about-references-title"
      >
        <div>
          <p className="eyebrow">
            Referanslar ve iş ortaklıkları
          </p>

          <h2 id="about-references-title">
            Güvenilir iş birlikleri,{" "}
            <em>
              izinli ve doğrulanmış kayıtlarla
            </em>{" "}
            görünür olur.
          </h2>

          <p>
            Kurumsal referans isimleri ve logoları
            yalnızca ilgili tarafların yazılı kullanım
            onayı bulunduğunda yayınlıyoruz.
          </p>
        </div>

        <div className="reference-disclosure">
          <span>
            Kurumsal referans alanı
          </span>

          <strong>
            Yeni iş birlikleri için açık.
          </strong>

          <p>
            İşletmeciler, üretici firmalar ve tekne
            sahipleriyle yürütülen çalışmalar; kapsam ve
            izin bilgileri netleştirildikçe burada yer
            alacaktır.
          </p>

          <a
            className="button button--outline"
            href="/iletisim"
          >
            İş birliğini konuşun
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section
        className="about-profile-download"
        aria-labelledby="about-profile-title"
      >
        <div>
          <p className="eyebrow">
            Kurumsal doküman
          </p>

          <h2 id="about-profile-title">
            Şirket profilimizi ve hizmet kapsamımızı{" "}
            <em>tek dosyada inceleyin.</em>
          </h2>

          <p>
            Perla Marine’in çalışma alanlarını, hizmet
            başlıklarını, iş yapma standardını ve
            iletişim bilgilerini içeren kurumsal PDF
            profilini indirebilirsiniz.
          </p>
        </div>

        <a
          className="button button--navy"
          href="/perla-marine-kurumsal-sirket-profili.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          PDF profili indir
          <ArrowUpRight size={17} />
        </a>
      </section>

      <section className="about-consulting">
        <div>
          <p className="eyebrow">
            Kurumsal iş ortaklığı
          </p>

          <h2>
            Üretici firmalar için sahadan gelen{" "}
            <em>teknik koordinasyon.</em>
          </h2>
        </div>

        <p>
          Tekne ve yat üreticilerine servis erişimi,
          sistem yerleşimi, bakım yapılabilirliği, saha
          kontrolü, teknik dokümantasyon ve uygulama
          koordinasyonu başlıklarında destek
          sunuyoruz.
        </p>

        <a
          className="button button--navy"
          href="/iletisim"
        >
          Kurumsal kapsamı konuşun
          <ArrowUpRight size={17} />
        </a>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   SERVICES
========================================================= */

export function ServicesNew() {
  usePageMetadata(
    "/hizmetler",
    "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım",
    "Perla Marine’in kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve özel tekne çözümlerini inceleyin."
  );

  return (
    <PageFrame>
      <PageHero data={pageData.services} />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              Bakım ve servis kapsamı
            </p>

            <h2>
              Teknenin ihtiyacı değişir.
              <br />
              <em>Servis kapsamı da.</em>
            </h2>
          </div>

          <p>
            Her hizmet grubunu ayrı bir operasyon olarak
            ele alıyor, gerektiğinde sistemler arası
            ilişkiyi birlikte değerlendiriyoruz.
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

function ProjectLightbox({
  projects,
  activeIndex,
  onClose,
  onChange,
}: {
  projects: Project[];
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const project = projects[activeIndex];

  const [imageIndex, setImageIndex] =
    useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setImageIndex(
          (current) => (current + 1) % 2
        );
      }

      if (event.key === "ArrowLeft") {
        setImageIndex(
          (current) =>
            (current - 1 + 2) % 2
        );
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [onClose]);

  const image =
    imageIndex === 0
      ? project.before
      : project.after;

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} görsel galerisi`}
      onClick={onClose}
    >
      <div
        className="project-lightbox__panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="project-lightbox__top">
          <span>{project.label}</span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Galeriyi kapat"
          >
            <X size={22} />
          </button>
        </div>

        <div className="project-lightbox__image-wrap">
          <button
            type="button"
            className="project-lightbox__nav project-lightbox__nav--left"
            onClick={() =>
              setImageIndex(
                (current) =>
                  (current - 1 + 2) % 2
              )
            }
            aria-label="Önceki görsel"
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src={image}
            alt={`${project.title} ${
              imageIndex === 0
                ? "önce"
                : "sonra"
            } görseli`}
          />

          <button
            type="button"
            className="project-lightbox__nav project-lightbox__nav--right"
            onClick={() =>
              setImageIndex(
                (current) =>
                  (current + 1) % 2
              )
            }
            aria-label="Sonraki görsel"
          >
            <ArrowRight size={22} />
          </button>
        </div>

        <div className="project-lightbox__caption">
          <div>
            <strong>
              {project.title}
            </strong>

            <span>
              {imageIndex === 0
                ? "Önce · mevcut durum"
                : "Sonra · hedeflenen kapsam"}
            </span>
          </div>

          <div className="project-lightbox__project-switcher">
            {projects.map(
              (item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    index === activeIndex
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    onChange(index)
                  }
                  aria-label={`${item.title} galerisini aç`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */

export function ProjectsNew() {
  usePageMetadata(
    "/projeler",
    "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları",
    "Perla Marine’in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin."
  );

  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const [projects, setProjects] =
    useState<Project[]>(
      fallbackProjects
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        /*
         * Supabase projects tablosundan yayınlanmış
         * projeleri alıyoruz.
         *
         * Beklenen kolonlar:
         * id
         * slug
         * label
         * title
         * detail
         * scope
         * systems
         * results
         * before_image
         * after_image
         * published
         */

        const { data, error } =
          await supabase
            .from("projects")
            .select("*")
            .eq("status", "published")
            .order("sort_order", {
              ascending: true,
            });

        if (
          error ||
          !data ||
          data.length === 0
        ) {
          if (error) {
            console.error(
              "[Projects] Supabase error:",
              error
            );
          }

          return;
        }

        if (mounted) {
          const mapped =
            data.map(
              (project: any) => ({
                id: project.id,
                slug:
                  project.slug ??
                  `project-${project.id}`,
                label:
                  project.label ?? "",
                title:
                  project.title ?? "",
                detail:
                  project.detail ?? "",
                scope:
                  project.scope ?? "",
                systems:
                  project.systems ?? "",
                results:
                  project.results ?? "",
                before:
                  project.before_image ??
                  "",
                after:
                  project.after_image ??
                  "",
              })
            );

          setProjects(mapped);
        }
      } catch (error) {
        console.error(
          "[Projects] Failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageFrame>
      <PageHero data={pageData.projects} />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              Saha çalışmaları
            </p>

            <h2>
              Önce mevcut durumu,
              <br />
              <em>sonra hedefi görün.</em>
            </h2>
          </div>

          <p>
            Bakım ve refit kapsamını sistem bazında
            değerlendiriyor, mevcut durumdan sonraki
            uygulanabilir adıma kadar süreci
            görünür hale getiriyoruz.
          </p>
        </div>

        {loading &&
          projects.length === 0 && (
            <p>Projeler yükleniyor...</p>
          )}

        <div className="project-detail-grid">
          {projects.map(
            (project, index) => (
              <article
                id={project.slug}
                className="project-detail-card"
                key={project.id}
              >
                <div className="project-comparison project-comparison--slider">
                  <BeforeAfterSlider
                    before={
                      project.before
                    }
                    after={
                      project.after
                    }
                    beforeAlt={`${project.title} önce · mevcut durum`}
                    afterAlt={`${project.title} sonra · hedeflenen kapsam`}
                    label={project.title}
                  />

                  <button
                    type="button"
                    className="project-comparison__lightbox-link"
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    aria-label={`${project.title} görsellerini büyüt`}
                  >
                    Görselleri büyüt
                    <ChevronRight
                      size={13}
                    />
                  </button>
                </div>

                <div className="project-detail-card__copy">
                  <span>
                    {project.label}
                  </span>

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.detail}
                  </p>

                  <div className="project-detail-card__facts">
                    <div>
                      <strong>
                        Kapsam
                      </strong>

                      <p>
                        {project.scope}
                      </p>
                    </div>

                    <div>
                      <strong>
                        Kullanılan sistemler
                      </strong>

                      <p>
                        {project.systems}
                      </p>
                    </div>

                    <div>
                      <strong>
                        Bakım sonucu
                      </strong>

                      <p>
                        {project.results}
                      </p>
                    </div>
                  </div>

                  <a href="/iletisim">
                    <strong>
                      Bu kapsamı konuşun
                      <ArrowUpRight
                        size={15}
                      />
                    </strong>
                  </a>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {activeIndex !== null && (
        <ProjectLightbox
          projects={projects}
          activeIndex={
            activeIndex
          }
          onClose={() =>
            setActiveIndex(null)
          }
          onChange={
            setActiveIndex
          }
        />
      )}
    </PageFrame>
  );
}

/* =========================================================
   KNOWLEDGE
========================================================= */

function makeSlug(
  value: string
) {
  return value
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderKnowledgeBody(
  body: string
) {
  return body
    .split(/\n+/)
    .map((paragraph) => {
      const text =
        paragraph
          .replace(/^#+\s*/, "")
          .replace(/^>\s*/, "")
          .trim();

      if (!text) {
        return "";
      }

      return `<p>${text}</p>`;
    })
    .join("");
}

export function KnowledgeNew() {
  usePageMetadata(
    "/teknik-bilgiler",
    "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri",
    "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberlerini okuyun."
  );

  const [posts, setPosts] =
    useState<KnowledgePost[]>(
      fallbackKnowledge
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        /*
         * Supabase knowledge tablosundan
         * yayınlanmış yazıları alıyoruz.
         *
         * Beklenen kolonlar:
         * id
         * slug
         * category
         * title
         * excerpt
         * body
         * cover_image
         * published_at
         * published
         */

        const { data, error } =
          await supabase
            .from("knowledge_posts")
            .select("*")
            .eq("status", "published")
            .order("sort_order", {
              ascending: true,
            });

        if (
          error ||
          !data ||
          data.length === 0
        ) {
          if (error) {
            console.error(
              "[Knowledge] Supabase error:",
              error
            );
          }

          return;
        }

        if (mounted) {
          const mapped =
            data.map(
              (post: any) => ({
                id: post.id,
                slug:
                  post.slug ||
                  makeSlug(
                    post.title
                  ),
                category:
                  post.category ||
                  "Teknik bilgi",
                title:
                  post.title || "",
                excerpt:
                  post.excerpt ||
                  "",
                body:
                  post.body || "",
                coverImage:
                  post.cover_image ||
                  null,
                publishedAt:
                  post.published_at ||
                  null,
              })
            );

          setPosts(mapped);
        }
      } catch (error) {
        console.error(
          "[Knowledge] Failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageFrame>
      <PageHero
        data={pageData.knowledge}
      />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              Bakım notları
            </p>

            <h2>
              Teknik kararlar için
              <br />
              <em>
                kısa ve net rehberler.
              </em>
            </h2>
          </div>

          <p>
            Teknik Bilgiler; bakım kararlarını
            destekleyen teknik yazılardan oluşan sade
            bir içerik arşividir.
          </p>
        </div>

        {loading &&
          posts.length === 0 && (
            <p>
              Teknik bilgiler yükleniyor...
            </p>
          )}

        <div className="knowledge-grid">
          {posts.map((post) => (
            <article
              className="knowledge-card"
              id={post.slug}
              key={post.id}
            >
              {post.coverImage && (
                <img
                  className="knowledge-card__cover"
                  src={
                    post.coverImage
                  }
                  alt={`${post.title} kapak görseli`}
                  loading="lazy"
                />
              )}

              <span>
                {post.category}
              </span>

              <h3>
                {post.title}
              </h3>

              <p>
                {post.excerpt}
              </p>

              <div className="knowledge-card__actions">
                <a
                  href={`/teknik-bilgiler/${post.slug}`}
                  className="text-link text-link--dark"
                >
                  Yazıyı aç
                  <ArrowUpRight
                    size={15}
                  />
                </a>

                {post.publishedAt && (
                  <small>
                    {new Date(
                      post.publishedAt
                    ).toLocaleDateString(
                      "tr-TR"
                    )}
                  </small>
                )}
              </div>

              <details className="knowledge-card__details">
                <summary>
                  Kısa önizleme
                </summary>

                <div
                  className="knowledge-card__body"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderKnowledgeBody(
                        post.body
                      ),
                  }}
                />
              </details>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   CONTACT FORM
========================================================= */

const formFields = [
  "name",
  "email",
  "service",
  "message",
] as const;

const emptyForm: FormState = {
  name: "",
  email: "",
  service: "",
  message: "",
};

export function validateCorporateContact(
  values: FormState,
  consent: boolean
): CorporateContactErrors {
  const next: CorporateContactErrors =
    {};

  if (!values.name.trim()) {
    next.name =
      "Ad soyad alanını doldurun.";
  }

  if (
    !/^\S+@\S+\.\S+$/.test(
      values.email.trim()
    )
  ) {
    next.email =
      "Geçerli bir e-posta adresi yazın.";
  }

  if (!values.service) {
    next.service =
      "Bir ihtiyaç kategorisi seçin.";
  }

  if (!values.message.trim()) {
    next.message =
      "Mevcut durumu ve hedefinizi paylaşın.";
  }

  /*
   * KVKK checkbox'ını form tarafında
   * zorunlu tutuyoruz.
   *
   * Ancak Supabase tablosunda consent
   * kolonu olmadığı için DB'ye göndermiyoruz.
   */
  if (!consent) {
    next.consent =
      "Aydınlatma onayını işaretleyin.";
  }

  return next;
}

/* =========================================================
   CONTACT
========================================================= */

export function ContactNew() {
  usePageMetadata(
    "/iletisim",
    "İletişim | Perla Marine Tekne Teknik Check-up ve Servis",
    "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın; uygulanabilir sonraki adımı birlikte planlayalım."
  );

  const [values, setValues] =
    useState<FormState>(
      emptyForm
    );

  const [consent, setConsent] =
    useState(false);

  const [errors, setErrors] =
    useState<CorporateContactErrors>(
      {}
    );

  const [submitted, setSubmitted] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const successRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      Object.keys(errors).length ===
      0
    ) {
      return;
    }

    const invalidField =
      document.querySelector<HTMLElement>(
        '#teklif-formu [aria-invalid="true"]'
      );

    invalidField?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    invalidField?.focus({
      preventScroll: true,
    });
  }, [errors]);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    successRef.current?.focus({
      preventScroll: true,
    });
  }, [submitted]);

  const update = (
    field: keyof FormState,
    value: string
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError("");
    setSubmitted(false);

    const formData =
      new FormData(
        event.currentTarget
      );

    /*
     * Honeypot
     */
    const honeypot = String(
      formData.get(
        "website"
      ) ?? ""
    ).trim();

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    /*
     * Form validation
     */
    const next =
      validateCorporateContact(
        values,
        consent
      );

    setErrors(next);

    if (
      Object.keys(next).length > 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * SUPABASE INSERT
       *
       * Tablo:
       * contact_messages
       *
       * Kolonlar:
       * id
       * name
       * email
       * service
       * message
       * status
       * created_at
       *
       * DİKKAT:
       * consent gönderilmiyor.
       */

      const { error } =
        await supabase
          .from(
            "contact_messages"
          )
          .insert({
            name:
              values.name.trim(),

            email:
              values.email
                .trim()
                .toLowerCase(),

            service:
              values.service.trim(),

            message:
              values.message.trim(),

            status:
              "new",

            consent: true,
          });

      if (error) {
        console.error(
          "[Contact] Supabase insert failed:",
          error
        );

        throw new Error(
          "Talebiniz şu anda gönderilemedi. Lütfen WhatsApp veya e-posta üzerinden ulaşın."
        );
      }

      /*
       * Başarılı gönderim
       */

      setSubmitted(true);

      setValues({
        ...emptyForm,
      });

      setConsent(false);
      setErrors({});
    } catch (error) {
      console.error(
        "[Contact] Submit failed:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Talep gönderilemedi. Lütfen WhatsApp veya e-posta üzerinden ulaşın."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageFrame>
      <PageHero
        data={pageData.contact}
        compact
      />

      <section className="new-contact-layout">
        <div className="new-contact-copy">
          <p className="eyebrow">
            İletişim kanalları
          </p>

          <h2>
            İhtiyacınız için uygun yolu seçin.
          </h2>

          <p>
            Form üzerinden kapsamlı bilgi
            paylaşabilir, WhatsApp veya e-posta
            üzerinden doğrudan yazabilirsiniz.
          </p>

          <div className="contact-channel-grid">
            <a
              href="https://wa.me/905454353201"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle
                size={18}
              />
              WhatsApp ile yazın
            </a>

            <a href="tel:+905454353201">
              <Phone size={18} />
              +90 545 435 32 01
            </a>

            <a href="mailto:info@perlamarine.com">
              <Mail size={18} />
              info@perlamarine.com
            </a>
          </div>
        </div>

        <form
          id="teklif-formu"
          className="new-contact-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* =========================================
              HONEYPOT
          ========================================== */}

          <input
            className="form-honeypot"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="new-contact-form__heading">
            <span>
              TEKNİK DEĞERLENDİRME
            </span>

            <p>
              Teknenizi anlatın
            </p>
          </div>

          {Object.keys(errors)
            .length > 0 && (
            <div
              id="contact-form-error-summary"
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              Lütfen formdaki alanları
              kontrol edin. Hatalı alanlar
              aşağıda açıklanmıştır.
            </div>
          )}

          {/* NAME + EMAIL */}

          <div className="new-contact-form__row">
          <label>
            Adınız ve soyadınız

            <input
              id="name-field"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) =>
                update(
                  "name",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.name
              )}
              aria-describedby={
                errors.name
                  ? "name-error"
                  : undefined
              }
            />

            {errors.name && (
              <small
                id="name-error"
                className="field-error"
                role="alert"
              >
                {errors.name}
              </small>
            )}
          </label>

          {/* EMAIL */}

          <label>
            E-posta adresiniz

            <input
              id="email-field"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.email
              )}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
            />

            {errors.email && (
              <small
                id="email-error"
                className="field-error"
                role="alert"
              >
                {errors.email}
              </small>
            )}
          </label>
          </div>

          {/* SERVICE */}

          <label>
            İhtiyaç kategorisi

            <select
              id="service-field"
              name="service"
              value={
                values.service
              }
              onChange={(event) =>
                update(
                  "service",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.service
              )}
              aria-describedby={
                errors.service
                  ? "service-error"
                  : undefined
              }
            >
              <option value="">
                Bir kategori seçin
              </option>

              {serviceGroups.map(
                ([title]) => (
                  <option
                    key={title}
                    value={title}
                  >
                    {title}
                  </option>
                )
              )}
            </select>

            {errors.service && (
              <small
                id="service-error"
                className="field-error"
                role="alert"
              >
                {errors.service}
              </small>
            )}
          </label>

          {/* MESSAGE */}

          <label>
            Mevcut durum ve hedef

            <textarea
              id="message-field"
              name="message"
              rows={3}
              value={
                values.message
              }
              onChange={(event) =>
                update(
                  "message",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.message
              )}
              aria-describedby={
                errors.message
                  ? "message-error"
                  : undefined
              }
              placeholder="Teknenizin mevcut durumunu ve ihtiyacınızı kısaca anlatın."
            />

            {errors.message && (
              <small
                id="message-error"
                className="field-error"
                role="alert"
              >
                {errors.message}
              </small>
            )}
          </label>

          {/* CONSENT */}

          <label className="consent-field">
            <input
              id="consent-field"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(
                  event.target.checked
                );

                setErrors(
                  (current) => ({
                    ...current,
                    consent:
                      undefined,
                  })
                );
              }}
              aria-invalid={Boolean(
                errors.consent
              )}
              aria-describedby={
                errors.consent
                  ? "consent-error"
                  : undefined
              }
            />

            <span>
              KVKK aydınlatma metnini okudum
              ve iletişim kurulmasını kabul
              ediyorum.
            </span>
          </label>

          {errors.consent && (
            <small
              id="consent-error"
              className="field-error"
              role="alert"
            >
              {errors.consent}
            </small>
          )}

          {/* SUBMIT */}

          <button
            className="button button--navy"
            type="submit"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? "Gönderiliyor…"
              : "Talebi gönder"}

            {!isSubmitting && (
              <ArrowUpRight
                size={17}
              />
            )}
          </button>

          {/* SUBMIT ERROR */}

          {submitError && (
            <div
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              {submitError}
            </div>
          )}

          {/* SUCCESS */}

          {submitted && (
            <div
              id="contact-success"
              ref={successRef}
              className="new-contact-success"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              <span
                className="new-contact-success__mark"
                aria-hidden="true"
              >
                <Check
                  size={20}
                  strokeWidth={2.2}
                />
              </span>

              <div className="new-contact-success__copy">
                <span className="new-contact-success__eyebrow">
                  TALEBİNİZ ULAŞTI
                </span>

                <strong>
                  Teşekkür ederiz.
                </strong>

                <span>
                  En kısa sürede sizinle
                  iletişime geçeceğiz.
                  İsterseniz WhatsApp’tan da
                  yazabilirsiniz.
                </span>
              </div>

              <span
                className="new-contact-success__signal"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
            </div>
          )}

          <p className="form-assurance">
            <BatteryCharging
              size={14}
            />
            Bilgileriniz yalnızca ilk
            teknik değerlendirme için
            kullanılır.
          </p>
        </form>
      </section>
    </PageFrame>
  );
}
