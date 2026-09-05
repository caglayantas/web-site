import { useLanguage } from "@/lib/i18n";
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

import { usePageData, usePageMetadata, PageFrame, CorporateHero } from "./pageShared";

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
  referencesViewAll: "Tüm referanslarımızı görün",
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
  referencesViewAll: "View all our references",
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

// Shown briefly while the live service list loads, and as a safety net if the
// fetch fails. Mirrors the current published services; kept in Turkish since
// the stored/submitted value is always the Turkish title regardless of language.

export default function AboutNew() {
  const c = useAboutContent();
  const { lang, toPath } = useLanguage();
  usePageMetadata(
    "/hakkimizda",
    "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis",
    "Perla Marine’in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu, teknik servis misyonunu ve iş yapma standardını keşfedin.",
    "About Us | Perla Marine Corporate Boat Maintenance & Technical Service",
    "Discover Perla Marine's corporate identity, marine maintenance vision, technical service mission, and working standard."
  );

  return (
    <PageFrame>
      <CorporateHero data={usePageData().about} />

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

          <a
            className="text-link text-link--dark"
            href={toPath("/referanslarimiz")}
            style={{ marginTop: 14 }}
          >
            {c.referencesViewAll}
            <ArrowUpRight size={14} />
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


