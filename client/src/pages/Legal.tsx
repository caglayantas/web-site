import { Link } from "wouter";
import { useEffect } from "react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/lib/i18n";

const LAST_UPDATED = "29 Ağustos 2026";
const LAST_UPDATED_EN = "August 29, 2026";

const legalContentTr = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    intro: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, Perla Marine ile paylaştığınız kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
    sections: [
      {
        heading: "1. Veri Sorumlusu",
        body: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, bu internet sitesi üzerinden elde edilen kişisel verileriniz, veri sorumlusu sıfatıyla Perla Marine tarafından aşağıda açıklanan kapsam ve sınırlar dahilinde işlenmektedir.",
          "Perla Marine’in ticari şirket olarak kuruluş süreci devam etmektedir; kuruluş tamamlandığında bu metindeki ticari unvan, adres ve iletişim bilgileri güncellenecektir. Bu süreçte veri sorumlusu sıfatı, Perla Marine ticari adı altında faaliyet gösteren gerçek kişi tarafından üstlenilmektedir.",
        ],
      },
      {
        heading: "2. İşlenen Kişisel Veri Kategorileri",
        body: [
          "İletişim formu, e-posta, telefon veya WhatsApp üzerinden bizimle iletişime geçtiğinizde aşağıdaki kişisel veri kategorileri işlenebilir:",
          "• Kimlik bilgisi: Ad ve soyad.",
          "• İletişim bilgisi: E-posta adresi, telefon numarası.",
          "• Talep/işlem bilgisi: Tekne veya proje bilgisi, konum, hizmet talebiniz ve mesaj içeriği.",
          "• İşlem güvenliği bilgisi: IP adresi, tarayıcı ve cihaz bilgisi gibi sunucu günlükleri aracılığıyla otomatik olarak oluşan teknik kayıtlar.",
        ],
      },
      {
        heading: "3. Kişisel Verilerin İşlenme Amaçları",
        body: [
          "Kişisel verileriniz; iletişim taleplerinizin ve talep ettiğiniz teknik değerlendirme, bakım-onarım veya danışmanlık hizmetlerinin karşılanması, tarafınızla iletişimin yürütülmesi, hizmet kalitesinin ve müşteri memnuniyetinin artırılması, talep ve şikâyet süreçlerinin takibi, sitenin ve iletişim kanallarının güvenliğinin sağlanması, yasal yükümlülüklerin yerine getirilmesi ve gerektiğinde hukuki süreçlerin yürütülmesi amaçlarıyla sınırlı olarak işlenir.",
        ],
      },
      {
        heading: "4. Hukuki Sebep ve Toplama Yöntemi",
        body: [
          "Kişisel verileriniz; KVKK’nın 5. maddesinde belirtilen “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati için veri işlenmesinin zorunlu olması” hukuki sebeplerine dayanarak, internet sitesindeki iletişim formu, e-posta, telefon ve benzeri elektronik iletişim kanalları aracılığıyla, siz talepte bulunduğunuzda otomatik veya kısmen otomatik yollarla toplanmaktadır.",
        ],
      },
      {
        heading: "5. Kişisel Verilerin Aktarılması",
        body: [
          "Kişisel verileriniz; sitenin ve iletişim altyapısının teknik olarak işletilmesini sağlamak amacıyla, hizmet aldığımız barındırma, bulut veri tabanı ve e-posta iletim hizmeti sağlayıcılarıyla, yalnızca bu amaçla sınırlı olarak ve mevzuatın izin verdiği ölçüde paylaşılabilir.",
          "Kişisel verileriniz, yasal bir zorunluluk bulunmadıkça pazarlama amacıyla üçüncü kişilerle paylaşılmaz, satılmaz veya kiralanmaz.",
        ],
      },
      {
        heading: "6. Kişisel Verilerin Saklanma Süresi",
        body: [
          "Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve Türk Ticaret Kanunu, Türk Borçlar Kanunu ile ilgili diğer mevzuatta öngörülen zamanaşımı süreleri saklı kalmak kaydıyla saklanır. Bu sürelerin sona ermesinin ardından verileriniz silinir, yok edilir veya anonim hâle getirilir.",
        ],
      },
      {
        heading: "7. KVKK Kapsamındaki Haklarınız",
        body: [
          "KVKK’nın 11. maddesi uyarınca bize başvurarak; kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme, yapılan düzeltme/silme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonuç ortaya çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
        ],
      },
      {
        heading: "8. Başvuru Yöntemi",
        body: [
          "Yukarıdaki haklarınızı kullanmak için taleplerinizi info@perlamarine.com adresine iletebilirsiniz. Başvurunuz, KVKK’nın 13. maddesi uyarınca en geç 30 gün içinde ve ilke olarak ücretsiz şekilde sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu’nca belirlenen tarifedeki ücret talep edilebilir.",
        ],
      },
    ],
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    intro: "Perlamarine.com üzerinden paylaştığınız bilgilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklayan gizlilik politikası.",
    sections: [
      { heading: "1. Kapsam", body: ["Bu Gizlilik Politikası, perlamarine.com internet sitesi (“Site”) üzerinden Perla Marine ile paylaştığınız bilgilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar. Siteyi kullanarak bu politikada belirtilen ilkeleri kabul etmiş sayılırsınız."] },
      { heading: "2. Toplanan Bilgiler", body: [
        "İletişim formunu doldurduğunuzda ad-soyad, e-posta, telefon, tekne veya proje bilgisi ve mesaj içeriğiniz tarafımızca alınır. Siteyi ziyaret ettiğinizde ise tarayıcı türü, cihaz bilgisi, IP adresi ve ziyaret kayıtları gibi teknik veriler otomatik olarak oluşabilir.",
        "Site; rızanıza bağlı olarak, ziyaretçi istatistiklerini anlamak amacıyla Google Analytics gibi üçüncü taraf analiz araçları kullanabilir. Bu araçlar yalnızca sitemizi ilk ziyaretinizde gösterilen çerez bandında açık rızanızı vermeniz hâlinde etkinleştirilir; tercihinizi dilediğiniz zaman değiştirebilirsiniz. Detaylar için Çerez Politikamızı inceleyebilirsiniz.",
      ] },
      { heading: "3. Bilgilerin Kullanım Amacı", body: ["Topladığımız bilgiler yalnızca iletişim taleplerinizi yanıtlamak, talep ettiğiniz hizmetin kapsamını değerlendirmek, sizinle iletişimi sürdürmek ve sitenin güvenli, işlevsel şekilde çalışmasını sağlamak amacıyla kullanılır. Bilgileriniz, açık rızanız olmadan pazarlama amacıyla üçüncü kişilere aktarılmaz veya satılmaz."] },
      { heading: "4. Bilgi Güvenliği", body: ["Kişisel verilerinizin güvenliği için makul teknik ve idari tedbirler alınmaktadır; site HTTPS (SSL) şifrelemesiyle hizmet vermektedir. Bununla birlikte internet üzerinden yapılan hiçbir veri iletiminin veya elektronik saklama yönteminin %100 güvenli olmadığını hatırlatmak isteriz; hassas kimlik, finansal ya da üçüncü kişilere ait bilgileri iletişim formu üzerinden paylaşmamanızı öneririz."] },
      { heading: "5. Üçüncü Taraf Hizmet Sağlayıcılar", body: ["Sitenin barındırılması, veri tabanı ve e-posta bildirim altyapısı için üçüncü taraf bulut hizmeti sağlayıcılarından yararlanılmaktadır. Bu sağlayıcılar, yalnızca hizmetin teknik olarak sunulması amacıyla sınırlı erişime sahiptir ve kendi gizlilik ve güvenlik politikalarına tabidir."] },
      { heading: "6. Reşit Olmayan Ziyaretçiler", body: ["Site, 18 yaşından küçük kişilere yönelik olarak tasarlanmamıştır. Reşit olmayan kişilere ait kişisel verileri bilerek toplamayız; böyle bir durumun tespiti hâlinde ilgili veriler makul süre içinde silinir."] },
      { heading: "7. Politika Değişiklikleri", body: ["Bu Gizlilik Politikası, hizmetlerimizdeki veya yürürlükteki mevzuattaki değişikliklere bağlı olarak güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır ve sayfa altında son güncelleme tarihi belirtilir."] },
      { heading: "8. İletişim", body: ["Bu politikayla ilgili sorularınız için info@perlamarine.com adresinden bize ulaşabilirsiniz."] },
    ],
  },
  cerez: {
    title: "Çerez Politikası",
    intro: "Perlamarine.com üzerinde çerezlerin (cookies) kullanımına ilişkin bilgilendirme.",
    sections: [
      { heading: "1. Çerez Nedir?", body: ["Çerezler (cookies), bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; sitenin düzgün çalışmasını sağlamak, tercihlerinizi hatırlamak ve genel kullanıcı deneyimini iyileştirmek amacıyla kullanılabilir."] },
      { heading: "2. Zorunlu Çerezler", body: ["perlamarine.com, sitenin temel işlevlerinin (sayfalar arası gezinme, form işlevselliği, güvenlik, çerez tercihinizin hatırlanması) çalışması için gerekli olan zorunlu/teknik nitelikte çerezleri ve benzeri teknolojileri kullanır. Bu çerezler için ayrı bir onay istenmez ve devre dışı bırakılamaz."] },
      { heading: "3. Analiz Çerezleri (Rızanıza Bağlı)", body: ["Ziyaretçi istatistiklerini anlamak amacıyla Google Analytics çerezleri kullanılabilmektedir. Bu çerezler yalnızca sitemizi ilk ziyaretinizde gösterilen çerez bandında açık rızanızı vermeniz hâlinde etkinleştirilir; “Sadece Zorunlu” seçeneğini işaretlerseniz bu çerezler yüklenmez. Tercihinizi dilediğiniz zaman internet sitemizin altbilgisindeki “Çerez tercihlerini değiştir” bağlantısından güncelleyebilirsiniz."] },
      { heading: "4. Çerez Türleri Hakkında Genel Bilgi", body: [
        "Zorunlu çerezler: Sitenin temel işlevleri (sayfa gezinme, form gönderimi, güvenlik) için gereklidir ve kapatılamaz.",
        "Performans/analiz çerezleri: Ziyaretçilerin siteyi nasıl kullandığını anlamak için kullanılır; yalnızca açık rızanızla etkinleştirilir.",
        "Pazarlama çerezleri: Kişiselleştirilmiş reklam amacıyla kullanılır; şu an aktif değildir.",
      ] },
      { heading: "5. Çerezleri Nasıl Yönetebilirsiniz?", body: ["Tarayıcınızın ayarlar menüsünden mevcut çerezleri silebilir, yeni çerezlerin kaydedilmesini engelleyebilir veya bir çerez kaydedilmeden önce uyarı almayı seçebilirsiniz. Zorunlu çerezleri engellemeniz hâlinde sitenin bazı bölümleri beklendiği gibi çalışmayabilir."] },
      { heading: "6. İletişim", body: ["Çerez kullanımıyla ilgili sorularınız için info@perlamarine.com adresinden bize ulaşabilirsiniz."] },
    ],
  },
};

const legalContentEn = {
  kvkk: {
    title: "KVKK Notice (Personal Data Protection)",
    intro: "This notice explains how Perla Marine processes the personal data you share with us, under Turkish Law No. 6698 on the Protection of Personal Data (“KVKK”).",
    disclaimer: "This is a courtesy translation for international visitors. The Turkish version of this notice (KVKK Aydınlatma Metni) is the legally binding text under Turkish law; in the event of any discrepancy, the Turkish version prevails.",
    sections: [
      { heading: "1. Data Controller", body: [
        "Under Law No. 6698 on the Protection of Personal Data (“KVKK”), personal data obtained through this website is processed by Perla Marine, acting as the data controller, within the scope and limits described below.",
        "Perla Marine's incorporation as a commercial company is in progress; once completed, the company title, address, and contact details in this notice will be updated. During this process, the role of data controller is undertaken by the individual operating under the Perla Marine trade name.",
      ] },
      { heading: "2. Categories of Personal Data Processed", body: [
        "When you contact us via the contact form, email, phone, or WhatsApp, the following categories of personal data may be processed:",
        "• Identity data: First and last name.",
        "• Contact data: Email address, phone number.",
        "• Request/transaction data: Boat or project information, location, your service request, and message content.",
        "• Transaction security data: Technical records automatically generated through server logs, such as IP address, browser, and device information.",
      ] },
      { heading: "3. Purposes of Processing", body: [
        "Your personal data is processed solely for the purposes of responding to your inquiries and providing the technical assessment, maintenance-repair, or consulting services you request; maintaining communication with you; improving service quality and customer satisfaction; tracking requests and complaints; ensuring the security of the site and communication channels; fulfilling legal obligations; and, where necessary, conducting legal proceedings.",
      ] },
      { heading: "4. Legal Basis and Collection Method", body: [
        "Your personal data is collected automatically or partially automatically through the website's contact form, email, phone, and similar electronic communication channels when you make a request, based on the legal grounds set out in Article 5 of KVKK: that processing is directly related to the establishment or performance of a contract, and that processing is necessary for the data controller's legitimate interest, provided this does not harm your fundamental rights and freedoms.",
      ] },
      { heading: "5. Transfer of Personal Data", body: [
        "Your personal data may be shared, strictly for the purpose of technically operating the site and communication infrastructure, with the hosting, cloud database, and email delivery service providers we use, limited to that purpose and to the extent permitted by law.",
        "Your personal data is not shared, sold, or rented to third parties for marketing purposes unless legally required.",
      ] },
      { heading: "6. Retention Period", body: [
        "Your personal data is retained for as long as required by the purpose of processing, subject to the statute-of-limitations periods set out in the Turkish Commercial Code, the Turkish Code of Obligations, and other relevant legislation. Once these periods expire, your data is deleted, destroyed, or anonymized.",
      ] },
      { heading: "7. Your Rights Under KVKK", body: [
        "Under Article 11 of KVKK, you may apply to us to: learn whether your personal data is being processed; request information about it if so; learn the purpose of processing and whether it is used accordingly; know the third parties to whom it is transferred domestically or abroad; request correction if processed incompletely or incorrectly; request deletion or destruction under the conditions in Article 7 of KVKK; request that any correction/deletion be notified to third parties to whom the data was transferred; object to an outcome that is unfavorable to you resulting solely from automated analysis; and request compensation for damages arising from unlawful processing.",
      ] },
      { heading: "8. How to Apply", body: [
        "To exercise the rights above, you may send your request to info@perlamarine.com. Your application will be concluded within 30 days at the latest under Article 13 of KVKK, in principle free of charge; if the request requires an additional cost, a fee may be charged according to the tariff set by the Personal Data Protection Board.",
      ] },
    ],
  },
  gizlilik: {
    title: "Privacy Policy",
    intro: "This Privacy Policy explains how information you share through perlamarine.com is collected, used, and protected.",
    sections: [
      { heading: "1. Scope", body: ["This Privacy Policy explains how information you share with Perla Marine through perlamarine.com (the “Site”) is collected, used, and protected. By using the Site, you are deemed to accept the principles set out in this policy."] },
      { heading: "2. Information Collected", body: [
        "When you fill in the contact form, we receive your name, email, phone number, boat or project information, and message content. When you visit the Site, technical data such as browser type, device information, IP address, and visit logs may be generated automatically.",
        "With your consent, the Site may use third-party analytics tools such as Google Analytics to understand visitor statistics. These tools are only activated if you give explicit consent in the cookie banner shown on your first visit; you may change your preference at any time. See our Cookie Policy for details.",
      ] },
      { heading: "3. Purpose of Use", body: ["The information we collect is used solely to respond to your inquiries, assess the scope of the service you requested, maintain communication with you, and keep the Site secure and functional. Your information is not transferred to third parties for marketing purposes or sold without your explicit consent."] },
      { heading: "4. Information Security", body: ["Reasonable technical and administrative measures are taken to protect your personal data; the Site operates over HTTPS (SSL) encryption. However, we note that no data transmission over the internet or electronic storage method is 100% secure; we recommend not sharing sensitive identity, financial, or third-party information through the contact form."] },
      { heading: "5. Third-Party Service Providers", body: ["Third-party cloud service providers are used for hosting, database, and email notification infrastructure. These providers have limited access solely for the technical delivery of the service and are subject to their own privacy and security policies."] },
      { heading: "6. Visitors Under 18", body: ["The Site is not designed for individuals under the age of 18. We do not knowingly collect personal data belonging to minors; if such a case is identified, the relevant data will be deleted within a reasonable time."] },
      { heading: "7. Changes to This Policy", body: ["This Privacy Policy may be updated in line with changes to our services or applicable legislation. The current version is always published on this page, with the last-updated date shown below."] },
      { heading: "8. Contact", body: ["For questions about this policy, you can reach us at info@perlamarine.com."] },
    ],
  },
  cerez: {
    title: "Cookie Policy",
    intro: "Information about the use of cookies on perlamarine.com.",
    sections: [
      { heading: "1. What Is a Cookie?", body: ["Cookies are small text files saved to your device by your browser when you visit a website. They may be used to ensure the site works properly, remember your preferences, and improve the overall user experience."] },
      { heading: "2. Necessary Cookies", body: ["perlamarine.com uses necessary/technical cookies and similar technologies required for the Site's core functions (navigating between pages, form functionality, security, remembering your cookie preference). No separate consent is requested for these cookies, and they cannot be disabled."] },
      { heading: "3. Analytics Cookies (Consent-Based)", body: ["Google Analytics cookies may be used to understand visitor statistics. These cookies are only activated if you give explicit consent in the cookie banner shown on your first visit; if you select “Necessary Only,” these cookies are not loaded. You can update your preference at any time via the “Change cookie preferences” link in the site footer."] },
      { heading: "4. General Information About Cookie Types", body: [
        "Necessary cookies: Required for the Site's core functions (page navigation, form submission, security) and cannot be turned off.",
        "Performance/analytics cookies: Used to understand how visitors use the site; only activated with your explicit consent.",
        "Marketing cookies: Used for personalized advertising; not currently active.",
      ] },
      { heading: "5. How to Manage Cookies", body: ["You can delete existing cookies, block new cookies from being saved, or choose to be notified before a cookie is saved via your browser's settings menu. If you block necessary cookies, some parts of the Site may not work as expected."] },
      { heading: "6. Contact", body: ["For questions about our use of cookies, you can reach us at info@perlamarine.com."] },
    ],
  },
};

export default function Legal({ type }: { type: keyof typeof legalContentTr }) {
  const { lang, toPath } = useLanguage();
  const content = (lang === "en" ? legalContentEn : legalContentTr)[type];
  const disclaimer = lang === "en" && type === "kvkk" ? (legalContentEn.kvkk as typeof legalContentEn.kvkk).disclaimer : null;
  useEffect(() => {
    const metaByType = {
      kvkk: lang === "en"
        ? ["KVKK Notice | Perla Marine", "KVKK notice on personal data processed through Perla Marine contact requests."]
        : ["KVKK Aydınlatma Metni | Perla Marine", "Perla Marine iletişim taleplerinde işlenen kişisel verilere ilişkin KVKK aydınlatma metni."],
      gizlilik: lang === "en"
        ? ["Privacy Policy | Perla Marine", "Information security and privacy principles on the Perla Marine website and communication channels."]
        : ["Gizlilik Politikası | Perla Marine", "Perla Marine web sitesi ve iletişim kanallarında bilgi güvenliği ve gizlilik ilkeleri."],
      cerez: lang === "en"
        ? ["Cookie Policy | Perla Marine", "Information about the use of cookies on the Perla Marine website."]
        : ["Çerez Politikası | Perla Marine", "Perla Marine web sitesinde çerezlerin kullanımına ilişkin bilgilendirme."],
    } as const;
    const [title, description] = metaByType[type];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://www.perlamarine.com${toPath(`/${type}`)}`);
    return () => { document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [type, lang]);
  return (
    <>
      <PageHero eyebrow={lang === "en" ? "Corporate Information" : "Kurumsal bilgi"} title={content.title} intro={content.intro} variant="about" />
      <section className="legal-page section">
        <div className="legal-page__content">
          <p className="legal-page__updated">{lang === "en" ? "Last updated" : "Son güncelleme"}: {lang === "en" ? LAST_UPDATED_EN : LAST_UPDATED}</p>
          {disclaimer && <p className="legal-page__disclaimer">{disclaimer}</p>}
          {content.sections.map((section) => (
            <div className="legal-page__section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ))}
          <Link className="text-link text-link--dark" href={toPath("/iletisim")}>{lang === "en" ? "Go to the contact page" : "İletişim sayfasına geçin"}</Link>
        </div>
      </section>
    </>
  );
}

export function Sitemap() {
  const { lang, toPath } = useLanguage();
  useEffect(() => {
    document.title = lang === "en" ? "Sitemap | Perla Marine" : "Site Haritası | Perla Marine";
    document.querySelector('meta[name="description"]')?.setAttribute("content", lang === "en" ? "Quick access to Perla Marine's home, services, projects, technical notes, FAQ, and contact pages." : "Perla Marine ana sayfa, hizmet, proje, Teknik Bilgiler, SSS ve iletişim sayfalarına hızlı erişim.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://www.perlamarine.com${toPath("/site-haritasi")}`);
    return () => { document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [lang]);
  return <>
    <PageHero eyebrow={lang === "en" ? "Corporate Information" : "Kurumsal bilgi"} title={lang === "en" ? "Sitemap" : "Site haritası"} intro={lang === "en" ? "Quick links to Perla Marine's main pages and key information." : "Perla Marine ana sayfalarına ve temel bilgi alanlarına buradan ulaşabilirsiniz."} variant="about" />
    <section className="legal-page section">
      <div className="sitemap-grid">
        <Link href={toPath("/")}>{lang === "en" ? "Home" : "Ana Sayfa"}</Link>
        <Link href={toPath("/hakkimizda")}>{lang === "en" ? "About Us" : "Hakkımızda"}</Link>
        <Link href={toPath("/hizmetler")}>{lang === "en" ? "Services" : "Hizmetler"}</Link>
        <Link href={toPath("/hizmet-bolgelerimiz")}>{lang === "en" ? "Coverage Areas" : "Hizmet Bölgelerimiz"}</Link>
        <Link href={toPath("/teknik-bilgiler")}>{lang === "en" ? "Technical Notes" : "Teknik Bilgiler"}</Link>
        <Link href={toPath("/sss")}>{lang === "en" ? "FAQ" : "SSS"}</Link>
        <Link href={toPath("/iletisim")}>{lang === "en" ? "Contact Us" : "Bize Ulaşın"}</Link>
        <Link href={toPath("/kvkk")}>{lang === "en" ? "KVKK Notice" : "KVKK Aydınlatma"}</Link>
        <Link href={toPath("/gizlilik")}>{lang === "en" ? "Privacy Policy" : "Gizlilik Politikası"}</Link>
        <Link href={toPath("/cerez")}>{lang === "en" ? "Cookie Policy" : "Çerez Politikası"}</Link>
      </div>
    </section>
  </>;
}
