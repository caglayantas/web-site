import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/i18n";
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
  Image as ImageIcon,
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
  gallery: string[];
  labelEn?: string;
  titleEn?: string;
  detailEn?: string;
  scopeEn?: string;
  systemsEn?: string;
  resultsEn?: string;
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
  categoryEn?: string;
  titleEn?: string;
  excerptEn?: string;
  bodyEn?: string;
};

type FormState = {
  name: string;
  email: string;
  service: string;
  region: string;
  message: string;
};

export type CorporateContactErrors = Partial<FormState> & {
  consent?: string;
};

/* =========================================================
   PAGE DATA
========================================================= */

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

const aboutContentTr = {
  identityEyebrow: "Perla Marine kimdir?",
  identityTitle: <>Denizcilik varlıklarını yalnızca onarmıyor, <em>geleceğe hazırlıyoruz.</em></>,
  identityP1: "Perla Marine, tekne ve yat sahipleri, kaptanlar, işletmeciler ve üretici firmalar için bakım-onarım ve teknik servis süreçlerini yöneten kurumsal bir uygulama şirketidir.",
  identityP2: "Çalışma alanımız; kompozit imalat ve tamirden marin elektrik ve lityum sistemlerine, elektronik altyapıdan motor-tahrik-dümen, mekanik tesisat ve güverte ekipmanlarına kadar teknenin teknik bütününü kapsar.",
  identityP3: "Her operasyonu geçici bir müdahale olarak değil, teknenin güvenliğini, kullanılabilirliğini ve uzun vadeli işletme değerini destekleyen bir bakım kararı olarak ele alırız.",
  visionEyebrow: "Vizyonumuz",
  visionTitle: <>Türkiye’de denizcilik bakımını, <em>standartları olan bir hizmet kültürüne</em> dönüştürmek.</>,
  visionP1: "Vizyonumuz; tekne bakımının yalnızca arıza ortaya çıktığında hatırlanan bir gider kalemi olmaktan çıkıp, planlı işletme ve güvenli seyir kültürünün ayrılmaz bir parçası haline gelmesidir.",
  visionP2: "Bunun için teknik bilgiyi anlaşılır hale getiriyor, saha uygulamasını ölçülebilir bir iş akışıyla buluşturuyoruz.",
  visionP3: "Müşterilerimizin kararlarını belirsizlikten uzaklaştıran; kapsamı, sorumluluğu ve sonraki adımı açıkça ortaya koyan bir bakım anlayışının denizcilik sektöründe kalıcı bir standarda dönüşmesini hedefliyoruz.",
  missionEyebrow: "Misyonumuz",
  missionTitle: <>İhtiyacı doğru teşhis etmek, <em>doğru çözümü doğru kapsamda</em> uygulamak.</>,
  missionP1: "Misyonumuz; tekne sahibinin, kaptanın veya üretici ekibinin teknik ihtiyacını doğru anlayarak güvenli, uygulanabilir ve sürdürülebilir bir bakım-onarım çözümüne dönüştürmektir.",
  missionP2: "Planlama, tedarik, uygulama, kontrol ve teslim aşamalarını birbirinden koparmadan yönetiriz.",
  missionP3: "Böylece müşterilerimiz yalnızca bir servis hizmeti değil, kararlarını güvenle verebilecekleri kurumsal bir çalışma zemini elde eder.",
  promiseEyebrow: "Size ne vaat ediyoruz?",
  promiseTitle: <>Daha fazla söz değil, <em>daha net bir çalışma standardı.</em></>,
  promiseIntro: "Kurumsal hizmet anlayışımızın temelinde, işin başında verilen söz ile teslim edilen işin aynı kapsamda buluşması vardır.",
  promise1Title: "Şeffaf kapsam",
  promise1Body: "İhtiyacı, önceliği ve uygulanacak operasyonu anlaşılır bir çerçevede tanımlar; kapsam dışı beklentileri baştan görünür kılarız.",
  promise2Title: "Disiplinli uygulama",
  promise2Body: "İş programını, servis erişimini, sistemler arası ilişkileri ve kontrol adımlarını sahadaki gerçek koşullara göre yönetiriz.",
  promise3Title: "İzlenebilir teslim",
  promise3Body: "Yapılan işlemleri ve önerilen sonraki adımları açıkça paylaşır; teknenin bakım geçmişine değer katan bir iletişim bırakırız.",
  trustEyebrow: "Bize neden güvenmelisiniz?",
  trustTitle: <>Çünkü güveni bir iddia olarak değil, <em>iş yapma biçimi</em> olarak görüyoruz.</>,
  trustIntro: "Perla Marine ile çalışmak; teknik ihtiyacın doğru sorularla ele alınması, seçeneklerin anlaşılır biçimde değerlendirilmesi ve uygulamanın kontrol noktalarıyla ilerlemesi anlamına gelir.",
  trust1Title: "Saha deneyimi",
  trust1Body: "Kararlarımızı yalnızca katalog bilgisine değil, tekne üzerinde karşılaşılan erişim, kullanım ve bakım koşullarına dayandırırız.",
  trust2Title: "Teknik bütünlük",
  trust2Body: "Kompozit, elektrik, elektronik, mekanik, tahrik ve güverte sistemlerini birbirinden bağımsız parçalar değil, birlikte çalışan bir yapı olarak değerlendiririz.",
  trust3Title: "Kurumsal sorumluluk",
  trust3Body: "Tekne sahipleri için güvenli bakım, üretici firmalar için uygulanabilir teknik koordinasyon ve tüm paydaşlar için açık iletişim standardı sunarız.",
  trust4Title: "Ölçülü vaat",
  trust4Body: "Gerçek kapsamı görmeden kesin sonuç sözü vermek yerine, doğru inceleme ve doğru planlamayla güvenilir bir sonraki adım öneririz.",
  referencesEyebrow: "Referanslar ve iş ortaklıkları",
  referencesTitle: <>Güvenilir iş birlikleri, <em>izinli ve doğrulanmış kayıtlarla</em> görünür olur.</>,
  referencesIntro: "Kurumsal referans isimleri ve logoları yalnızca ilgili tarafların yazılı kullanım onayı bulunduğunda yayınlıyoruz.",
  referencesLabel: "Kurumsal referans alanı",
  referencesHeadline: "Yeni iş birlikleri için açık.",
  referencesBody: "İşletmeciler, üretici firmalar ve tekne sahipleriyle yürütülen çalışmalar; kapsam ve izin bilgileri netleştirildikçe burada yer alacaktır.",
  referencesCta: "İş birliğini konuşun",
  profileEyebrow: "Kurumsal doküman",
  profileTitle: <>Şirket profilimizi ve hizmet kapsamımızı <em>tek dosyada inceleyin.</em></>,
  profileBody: "Perla Marine’in çalışma alanlarını, hizmet başlıklarını, iş yapma standardını ve iletişim bilgilerini içeren kurumsal PDF profilini indirebilirsiniz.",
  profileCta: "PDF profili indir",
  consultingEyebrow: "Kurumsal iş ortaklığı",
  consultingTitle: <>Üretici firmalar için sahadan gelen <em>teknik koordinasyon.</em></>,
  consultingBody: "Tekne ve yat üreticilerine servis erişimi, sistem yerleşimi, bakım yapılabilirliği, saha kontrolü, teknik dokümantasyon ve uygulama koordinasyonu başlıklarında destek sunuyoruz.",
  consultingCta: "Kurumsal kapsamı konuşun",
  serviceCategory: "Üretim danışmanlığı",
};

const aboutContentEn: typeof aboutContentTr = {
  identityEyebrow: "Who Is Perla Marine?",
  identityTitle: <>We don't just repair marine assets, <em>we prepare them for the future.</em></>,
  identityP1: "Perla Marine is a corporate service company that manages maintenance, repair, and technical service processes for boat and yacht owners, captains, operators, and manufacturers.",
  identityP2: "Our scope of work covers the boat's full technical picture — from composite production and repair to marine electrical and lithium systems, from electronics infrastructure to propulsion-steering, mechanical systems, and deck equipment.",
  identityP3: "We treat every operation not as a temporary fix, but as a maintenance decision that supports the boat's safety, usability, and long-term operating value.",
  visionEyebrow: "Our Vision",
  visionTitle: <>To turn marine maintenance in Turkey into <em>a service culture with real standards.</em></>,
  visionP1: "Our vision is for boat maintenance to stop being a cost line only remembered when something breaks, and instead become an inseparable part of planned operation and safe navigation culture.",
  visionP2: "To do this, we make technical knowledge understandable and bring field work together with a measurable workflow.",
  visionP3: "We aim for a maintenance approach that removes uncertainty from our customers' decisions — one that clearly lays out scope, responsibility, and the next step — to become a lasting standard in the marine industry.",
  missionEyebrow: "Our Mission",
  missionTitle: <>Diagnose the need correctly, <em>apply the right solution at the right scope.</em></>,
  missionP1: "Our mission is to correctly understand the technical need of the boat owner, captain, or manufacturer's team, and turn it into a safe, actionable, and sustainable maintenance-repair solution.",
  missionP2: "We manage planning, procurement, execution, inspection, and handover without letting them become disconnected from one another.",
  missionP3: "This way, our customers get more than a service — they get a corporate working foundation they can make decisions on with confidence.",
  promiseEyebrow: "What Do We Promise You?",
  promiseTitle: <>Not more talk, <em>a clearer working standard.</em></>,
  promiseIntro: "At the core of our corporate service approach is making sure the commitment given at the start of the job matches the scope of the work delivered.",
  promise1Title: "Transparent scope",
  promise1Body: "We define the need, priority, and the operation to be carried out in a clear framework, making any out-of-scope expectations visible from the start.",
  promise2Title: "Disciplined execution",
  promise2Body: "We manage the work schedule, service access, relationships between systems, and inspection steps according to real conditions on site.",
  promise3Title: "Traceable handover",
  promise3Body: "We openly share the work carried out and the recommended next steps, leaving behind communication that adds value to the boat's maintenance history.",
  trustEyebrow: "Why Should You Trust Us?",
  trustTitle: <>Because we see trust not as a claim, <em>but as a way of working.</em></>,
  trustIntro: "Working with Perla Marine means the technical need is addressed with the right questions, the options are assessed clearly, and the work proceeds through defined checkpoints.",
  trust1Title: "Field experience",
  trust1Body: "We base our decisions not just on catalog information, but on the access, usage, and maintenance conditions actually encountered on the boat.",
  trust2Title: "Technical integrity",
  trust2Body: "We treat composite, electrical, electronics, mechanical, propulsion, and deck systems as a structure that works together, not as independent parts.",
  trust3Title: "Corporate responsibility",
  trust3Body: "We offer safe maintenance for boat owners, actionable technical coordination for manufacturers, and a standard of open communication for all stakeholders.",
  trust4Title: "Measured commitments",
  trust4Body: "Rather than promising a definite outcome before seeing the real scope, we recommend a reliable next step based on proper inspection and planning.",
  referencesEyebrow: "References and Partnerships",
  referencesTitle: <>Trusted collaborations become visible <em>through permitted, verified records.</em></>,
  referencesIntro: "We only publish corporate reference names and logos once the relevant parties have given written permission for their use.",
  referencesLabel: "Corporate reference area",
  referencesHeadline: "Open for new partnerships.",
  referencesBody: "Work carried out with operators, manufacturers, and boat owners will appear here as scope and permission details are confirmed.",
  referencesCta: "Discuss a partnership",
  profileEyebrow: "Corporate Document",
  profileTitle: <>Review our company profile and service scope <em>in a single file.</em></>,
  profileBody: "You can download our corporate PDF profile, which covers Perla Marine's areas of work, service categories, working standard, and contact information.",
  profileCta: "Download PDF profile",
  consultingEyebrow: "Corporate Partnership",
  consultingTitle: <>Field-driven <em>technical coordination</em> for manufacturers.</>,
  consultingBody: "We support boat and yacht manufacturers on service access, system layout, maintainability, field inspection, technical documentation, and application coordination.",
  consultingCta: "Discuss corporate scope",
  serviceCategory: "Production Consulting",
};

function useAboutContent() {
  const { lang } = useLanguage();
  return lang === "en" ? aboutContentEn : aboutContentTr;
}

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
    "Güverte ekipmanları",
    "Irgat, demirleme, krom aksesuar, vardavela ve güverte donanımı bakımı.",
  ],
  [
    "Üretim danışmanlığı",
    "Üretim planlama, servis erişimi, teknik dokümantasyon ve saha koordinasyonu.",
  ],
  [
    "Tekneye özel çözümler",
    "Teknenin kullanım amacı ve mevcut altyapısına göre keşif, refit ve sistem koordinasyonu.",
  ],
  [
    "Teknik checkup",
    "Sezon öncesi/sonrası genel durum kontrolü ve bakım önceliklerinin belirlenmesi.",
  ],
  [
    "Survey / Ekspertiz",
    "Alım-satım öncesi bağımsız teknik durum tespiti ve raporlama.",
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
    gallery: [],
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
    gallery: [],
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
    gallery: [],
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
  const c = useAboutContent();
  const { lang, toPath } = useLanguage();
  usePageMetadata(
    "/hakkimizda",
    "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis",
    "Perla Marine’in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu, teknik servis misyonunu ve iş yapma standardını keşfedin."
  );

  return (
    <PageFrame>
      <PageHero data={usePageData().about} />

      <section
        className="about-identity"
        aria-labelledby="about-identity-title"
      >
        <div className="about-copy">
          <p className="eyebrow">
            {c.identityEyebrow}
          </p>

          <h2 id="about-identity-title">
            {c.identityTitle}
          </h2>

          <p>
            {c.identityP1}
          </p>

          <p>
            {c.identityP2}
          </p>

          <p>
            {c.identityP3}
          </p>
        </div>

        <div className="about-image-frame">
          <img
            src="/manus-storage/perla-about-technical-planning-1600_a1702930.webp"
            alt="Tekne refit süreci için teknik plan ve ölçüm araçlarını inceleyen uzman"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      <section
        className="about-vision-mission"
        aria-labelledby="about-vision-title"
      >
        <div className="about-panel about-panel--navy">
          <p className="eyebrow eyebrow--light">
            {c.visionEyebrow}
          </p>

          <h2 id="about-vision-title">
            {c.visionTitle}
          </h2>

          <p>
            {c.visionP1}
          </p>

          <p>
            {c.visionP2}
          </p>

          <p>
            {c.visionP3}
          </p>
        </div>

        <div className="about-panel about-panel--ivory">
          <p className="eyebrow">
            {c.missionEyebrow}
          </p>

          <h2>
            {c.missionTitle}
          </h2>

          <p>
            {c.missionP1}
          </p>

          <p>
            {c.missionP2}
          </p>

          <p>
            {c.missionP3}
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
              {c.promiseEyebrow}
            </p>

            <h2 id="about-promise-title">
              {c.promiseTitle}
            </h2>
          </div>

          <p>
            {c.promiseIntro}
          </p>
        </div>

        <div className="about-promise-grid">
          <article>
            <span className="about-promise-grid__number">01</span>
            <ClipboardCheck
              size={23}
              aria-hidden="true"
            />

            <h3>{c.promise1Title}</h3>

            <p>
              {c.promise1Body}
            </p>
          </article>

          <article>
            <span className="about-promise-grid__number">02</span>
            <Settings2
              size={23}
              aria-hidden="true"
            />

            <h3>{c.promise2Title}</h3>

            <p>
              {c.promise2Body}
            </p>
          </article>

          <article>
            <span className="about-promise-grid__number">03</span>
            <ShieldCheck
              size={23}
              aria-hidden="true"
            />

            <h3>{c.promise3Title}</h3>

            <p>
              {c.promise3Body}
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
            {c.trustEyebrow}
          </p>

          <h2 id="about-trust-title">
            {c.trustTitle}
          </h2>

          <p>
            {c.trustIntro}
          </p>
        </div>

        <div className="about-trust__grid">
          <article>
            <Compass
              size={22}
              aria-hidden="true"
            />

            <h3>{c.trust1Title}</h3>

            <p>
              {c.trust1Body}
            </p>
          </article>

          <article>
            <Wrench
              size={22}
              aria-hidden="true"
            />

            <h3>{c.trust2Title}</h3>

            <p>
              {c.trust2Body}
            </p>
          </article>

          <article>
            <Factory
              size={22}
              aria-hidden="true"
            />

            <h3>{c.trust3Title}</h3>

            <p>
              {c.trust3Body}
            </p>
          </article>

          <article>
            <Check
              size={22}
              aria-hidden="true"
            />

            <h3>{c.trust4Title}</h3>

            <p>
              {c.trust4Body}
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
            {c.referencesEyebrow}
          </p>

          <h2 id="about-references-title">
            {c.referencesTitle}
          </h2>

          <p>
            {c.referencesIntro}
          </p>
        </div>

        <div className="reference-disclosure">
          <span>
            {c.referencesLabel}
          </span>

          <strong>
            {c.referencesHeadline}
          </strong>

          <p>
            {c.referencesBody}
          </p>

          <a
            className="button button--outline"
            href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(c.serviceCategory)}`}
          >
            {c.referencesCta}
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
            {c.profileEyebrow}
          </p>

          <h2 id="about-profile-title">
            {c.profileTitle}
          </h2>

          <p>
            {c.profileBody}
          </p>
        </div>

        <a
          className="button button--navy"
          href={lang === "en" ? "/perla-marine-corporate-profile.pdf" : "/perla-marine-kurumsal-sirket-profili.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          {c.profileCta}
          <ArrowUpRight size={17} />
        </a>
      </section>

      <section className="about-consulting">
        <div>
          <p className="eyebrow">
            {c.consultingEyebrow}
          </p>

          <h2>
            {c.consultingTitle}
          </h2>
        </div>

        <p>
          {c.consultingBody}
        </p>

        <a
          className="button button--navy"
          href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(c.serviceCategory)}`}
        >
          {c.consultingCta}
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
  const { lang } = useLanguage();
  usePageMetadata(
    "/hizmetler",
    "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım",
    "Perla Marine’in kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve özel tekne çözümlerini inceleyin."
  );

  return (
    <PageFrame>
      <PageHero data={usePageData().services} />

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
  const { lang } = useLanguage();
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
          (current) => (current + 1) % (2 + project.gallery.length)
        );
      }

      if (event.key === "ArrowLeft") {
        setImageIndex(
          (current) =>
            (current - 1 + 2 + project.gallery.length) % (2 + project.gallery.length)
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
  }, [onClose, project.gallery.length]);

  const images = [project.before, project.after, ...project.gallery];
  const image = images[imageIndex];
  const captionFor = (index: number) =>
    index === 0
      ? (lang === "en" ? "Before · current condition" : "Önce · mevcut durum")
      : index === 1
      ? (lang === "en" ? "After · targeted scope" : "Sonra · hedeflenen kapsam")
      : (lang === "en" ? `Additional photo ${index - 1}` : `Ek fotoğraf ${index - 1}`);

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} ${lang === "en" ? "image gallery" : "görsel galerisi"}`}
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
            aria-label={lang === "en" ? "Close gallery" : "Galeriyi kapat"}
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
                  (current - 1 + images.length) % images.length
              )
            }
            aria-label={lang === "en" ? "Previous image" : "Önceki görsel"}
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src={image}
            alt={`${project.title} — ${captionFor(imageIndex)}`}
          />

          <button
            type="button"
            className="project-lightbox__nav project-lightbox__nav--right"
            onClick={() =>
              setImageIndex(
                (current) =>
                  (current + 1) % images.length
              )
            }
            aria-label={lang === "en" ? "Next image" : "Sonraki görsel"}
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
              {captionFor(imageIndex)}
              {images.length > 2 ? ` · ${imageIndex + 1}/${images.length}` : ""}
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
                  aria-label={lang === "en" ? `Open ${item.title} gallery` : `${item.title} galerisini aç`}
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
  const { lang, toPath } = useLanguage();
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
                gallery:
                  Array.isArray(project.gallery_images)
                    ? project.gallery_images
                    : [],
                labelEn: project.label_en ?? "",
                titleEn: project.title_en ?? "",
                detailEn: project.detail_en ?? "",
                scopeEn: project.scope_en ?? "",
                systemsEn: project.systems_en ?? "",
                resultsEn: project.results_en ?? "",
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

  const displayProjects = lang === "en" ? projects.map((p) => ({
    ...p,
    label: p.labelEn || p.label,
    title: p.titleEn || p.title,
    detail: p.detailEn || p.detail,
    scope: p.scopeEn || p.scope,
    systems: p.systemsEn || p.systems,
    results: p.resultsEn || p.results,
  })) : projects;

  return (
    <PageFrame>
      <PageHero data={usePageData().projects} />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              {lang === "en" ? "Field work" : "Saha çalışmaları"}
            </p>

            <h2>
              {lang === "en" ? <>See the current condition first,<br /><em>then the target.</em></> : <>Önce mevcut durumu,<br /><em>sonra hedefi görün.</em></>}
            </h2>
          </div>

          <p>
            {lang === "en"
              ? "We assess maintenance and refit scope system by system, making the process visible from the current condition to the next actionable step."
              : "Bakım ve refit kapsamını sistem bazında değerlendiriyor, mevcut durumdan sonraki uygulanabilir adıma kadar süreci görünür hale getiriyoruz."}
          </p>
        </div>

        {loading &&
          projects.length === 0 && (
            <p>{lang === "en" ? "Loading projects..." : "Projeler yükleniyor..."}</p>
          )}

        <div className="project-detail-grid">
          {displayProjects.map(
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
                    beforeAlt={`${project.title} ${lang === "en" ? "before · current condition" : "önce · mevcut durum"}`}
                    afterAlt={`${project.title} ${lang === "en" ? "after · target scope" : "sonra · hedeflenen kapsam"}`}
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
                    aria-label={lang === "en" ? `Enlarge ${project.title} images` : `${project.title} görsellerini büyüt`}
                  >
                    {lang === "en" ? "Enlarge images" : "Görselleri büyüt"}
                    <ChevronRight
                      size={13}
                    />
                  </button>

                  {project.gallery.length > 0 && (
                    <div className="project-comparison__thumb-strip">
                      {project.gallery.slice(0, 3).map((url: string, photoIndex: number) => (
                        <button
                          type="button"
                          key={url}
                          className="project-comparison__thumb"
                          onClick={() =>
                            setActiveIndex(
                              index
                            )
                          }
                          aria-label={lang === "en" ? `Enlarge photo ${photoIndex + 1} for ${project.title}` : `${project.title} için ${photoIndex + 1}. ek fotoğrafı büyüt`}
                        >
                          <img src={url} alt="" loading="lazy" decoding="async" />
                        </button>
                      ))}
                      <button
                        type="button"
                        className="project-comparison__thumb-all"
                        onClick={() =>
                          setActiveIndex(
                            index
                          )
                        }
                        aria-label={lang === "en" ? `View all photos for ${project.title}` : `${project.title} için tüm fotoğrafları görüntüle`}
                      >
                        <ImageIcon size={13} />
                        {lang === "en" ? "All photos" : "Tüm fotoğraflar"}
                      </button>
                    </div>
                  )}
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
                        {lang === "en" ? "Scope" : "Kapsam"}
                      </strong>

                      <p>
                        {project.scope}
                      </p>
                    </div>

                    <div>
                      <strong>
                        {lang === "en" ? "Systems Used" : "Kullanılan sistemler"}
                      </strong>

                      <p>
                        {project.systems}
                      </p>
                    </div>

                    <div>
                      <strong>
                        {lang === "en" ? "Maintenance Result" : "Bakım sonucu"}
                      </strong>

                      <p>
                        {project.results}
                      </p>
                    </div>
                  </div>

                  <a href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(project.label)}`}>
                    <strong>
                      {lang === "en" ? "Discuss this scope" : "Bu kapsamı konuşun"}
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
          projects={displayProjects}
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
  const { lang, toPath } = useLanguage();
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
                categoryEn: post.category_en ?? "",
                titleEn: post.title_en ?? "",
                excerptEn: post.excerpt_en ?? "",
                bodyEn: post.body_en ?? "",
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

  const displayPosts = lang === "en" ? posts.map((p) => ({
    ...p,
    category: p.categoryEn || p.category,
    title: p.titleEn || p.title,
    excerpt: p.excerptEn || p.excerpt,
    body: p.bodyEn || p.body,
  })) : posts;

  return (
    <PageFrame>
      <PageHero
        data={usePageData().knowledge}
      />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              {lang === "en" ? "Maintenance Notes" : "Bakım notları"}
            </p>

            <h2>
              {lang === "en" ? <>Short, clear guides<br /><em>for technical decisions.</em></> : <>Teknik kararlar için<br /><em>kısa ve net rehberler.</em></>}
            </h2>
          </div>

          <p>
            {lang === "en"
              ? "Technical Notes is a simple content archive made up of technical articles that support maintenance decisions."
              : "Teknik Bilgiler; bakım kararlarını destekleyen teknik yazılardan oluşan sade bir içerik arşividir."}
          </p>
        </div>

        {loading &&
          posts.length === 0 && (
            <p>
              {lang === "en" ? "Loading technical notes..." : "Teknik bilgiler yükleniyor..."}
            </p>
          )}

        <div className="knowledge-grid">
          {displayPosts.map((post) => (
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
                  alt={`${post.title} ${lang === "en" ? "cover image" : "kapak görseli"}`}
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
                  href={toPath(`/teknik-bilgiler/${post.slug}`)}
                  className="text-link text-link--dark"
                >
                  {lang === "en" ? "Read article" : "Yazıyı aç"}
                  <ArrowUpRight
                    size={15}
                  />
                </a>

                {post.publishedAt && (
                  <small>
                    {new Date(
                      post.publishedAt
                    ).toLocaleDateString(
                      lang === "en" ? "en-US" : "tr-TR"
                    )}
                  </small>
                )}
              </div>

              <details className="knowledge-card__details">
                <summary>
                  {lang === "en" ? "Quick preview" : "Kısa önizleme"}
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
  region: "",
  message: "",
};

const REGION_OPTIONS = [
  "İzmir",
  "Muğla (Bodrum, Marmaris, Fethiye, Göcek, Datça)",
  "Aydın (Kuşadası, Didim)",
  "Antalya (Kemer, Kaş, Finike, Alanya)",
  "Marmara (İstanbul, Yalova, Bursa, Balıkesir)",
  "Diğer",
];

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
  const { t } = useLanguage();
  usePageMetadata(
    "/iletisim",
    "İletişim | Perla Marine Tekne Teknik Check-up ve Servis",
    "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın; uygulanabilir sonraki adımı birlikte planlayalım."
  );

  const [values, setValues] =
    useState<FormState>(
      emptyForm
    );

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("kategori");
    if (!requested) return;
    const match = serviceGroups.find(([title]) => title.toLowerCase() === requested.toLowerCase());
    if (match) setValues((current) => ({ ...current, service: match[0] }));
  }, []);

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
       * region
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

            region:
              values.region.trim(),

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
        data={usePageData().contact}
        compact
      />

      <section className="new-contact-layout">
        <div className="new-contact-copy">
          <p className="eyebrow">
            {t("contact.channelsEyebrow")}
          </p>

          <h2>
            {t("contact.channelsTitle")}
          </h2>

          <p>
            {t("contact.channelsIntro")}
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
              {t("contact.whatsapp")}
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
              {t("contact.formEyebrow").toUpperCase()}
            </span>

            <p>
              {t("contact.formTitle")}
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
            {t("contact.name")}

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
            {t("contact.email")}

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
            {t("contact.category")}

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
                {t("contact.categoryPlaceholder")}
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

          {/* REGION */}

          <label>
            {t("contact.region")}

            <select
              id="region-field"
              name="region"
              value={
                values.region
              }
              onChange={(event) =>
                update(
                  "region",
                  event.target.value
                )
              }
            >
              <option value="">
                {t("contact.regionPlaceholder")}
              </option>

              {REGION_OPTIONS.map(
                (label) => (
                  <option
                    key={label}
                    value={label}
                  >
                    {label}
                  </option>
                )
              )}
            </select>
          </label>

          {/* MESSAGE */}

          <label>
            {t("contact.message")}

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
              placeholder={t("contact.messagePlaceholder")}
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
              {t("contact.consent")}
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
              ? t("contact.sending")
              : t("contact.submit")}

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
            {t("contact.disclaimer")}
          </p>
        </form>
      </section>
    </PageFrame>
  );
}
