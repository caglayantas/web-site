import { Link } from "wouter";
import { useEffect } from "react";
import PageHero from "@/components/PageHero";

const LAST_UPDATED = "29 Ağustos 2026";

const legalContent = {
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
      {
        heading: "1. Kapsam",
        body: [
          "Bu Gizlilik Politikası, perlamarine.com internet sitesi (“Site”) üzerinden Perla Marine ile paylaştığınız bilgilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar. Siteyi kullanarak bu politikada belirtilen ilkeleri kabul etmiş sayılırsınız.",
        ],
      },
      {
        heading: "2. Toplanan Bilgiler",
        body: [
          "İletişim formunu doldurduğunuzda ad-soyad, e-posta, telefon, tekne veya proje bilgisi ve mesaj içeriğiniz tarafımızca alınır. Siteyi ziyaret ettiğinizde ise tarayıcı türü, cihaz bilgisi, IP adresi ve ziyaret kayıtları gibi teknik veriler otomatik olarak oluşabilir.",
          "Site; rızanıza bağlı olarak, ziyaretçi istatistiklerini anlamak amacıyla Google Analytics gibi üçüncü taraf analiz araçları kullanabilir. Bu araçlar yalnızca sitemizi ilk ziyaretinizde gösterilen çerez bandında açık rızanızı vermeniz hâlinde etkinleştirilir; tercihinizi dilediğiniz zaman değiştirebilirsiniz. Detaylar için Çerez Politikamızı inceleyebilirsiniz.",
        ],
      },
      {
        heading: "3. Bilgilerin Kullanım Amacı",
        body: [
          "Topladığımız bilgiler yalnızca iletişim taleplerinizi yanıtlamak, talep ettiğiniz hizmetin kapsamını değerlendirmek, sizinle iletişimi sürdürmek ve sitenin güvenli, işlevsel şekilde çalışmasını sağlamak amacıyla kullanılır. Bilgileriniz, açık rızanız olmadan pazarlama amacıyla üçüncü kişilere aktarılmaz veya satılmaz.",
        ],
      },
      {
        heading: "4. Bilgi Güvenliği",
        body: [
          "Kişisel verilerinizin güvenliği için makul teknik ve idari tedbirler alınmaktadır; site HTTPS (SSL) şifrelemesiyle hizmet vermektedir. Bununla birlikte internet üzerinden yapılan hiçbir veri iletiminin veya elektronik saklama yönteminin %100 güvenli olmadığını hatırlatmak isteriz; hassas kimlik, finansal ya da üçüncü kişilere ait bilgileri iletişim formu üzerinden paylaşmamanızı öneririz.",
        ],
      },
      {
        heading: "5. Üçüncü Taraf Hizmet Sağlayıcılar",
        body: [
          "Sitenin barındırılması, veri tabanı ve e-posta bildirim altyapısı için üçüncü taraf bulut hizmeti sağlayıcılarından yararlanılmaktadır. Bu sağlayıcılar, yalnızca hizmetin teknik olarak sunulması amacıyla sınırlı erişime sahiptir ve kendi gizlilik ve güvenlik politikalarına tabidir.",
        ],
      },
      {
        heading: "6. Reşit Olmayan Ziyaretçiler",
        body: [
          "Site, 18 yaşından küçük kişilere yönelik olarak tasarlanmamıştır. Reşit olmayan kişilere ait kişisel verileri bilerek toplamayız; böyle bir durumun tespiti hâlinde ilgili veriler makul süre içinde silinir.",
        ],
      },
      {
        heading: "7. Politika Değişiklikleri",
        body: [
          "Bu Gizlilik Politikası, hizmetlerimizdeki veya yürürlükteki mevzuattaki değişikliklere bağlı olarak güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır ve sayfa altında son güncelleme tarihi belirtilir.",
        ],
      },
      {
        heading: "8. İletişim",
        body: [
          "Bu politikayla ilgili sorularınız için info@perlamarine.com adresinden bize ulaşabilirsiniz.",
        ],
      },
    ],
  },
  cerez: {
    title: "Çerez Politikası",
    intro: "Perlamarine.com üzerinde çerezlerin (cookies) kullanımına ilişkin bilgilendirme.",
    sections: [
      {
        heading: "1. Çerez Nedir?",
        body: [
          "Çerezler (cookies), bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; sitenin düzgün çalışmasını sağlamak, tercihlerinizi hatırlamak ve genel kullanıcı deneyimini iyileştirmek amacıyla kullanılabilir.",
        ],
      },
      {
        heading: "2. Zorunlu Çerezler",
        body: [
          "perlamarine.com, sitenin temel işlevlerinin (sayfalar arası gezinme, form işlevselliği, güvenlik, çerez tercihinizin hatırlanması) çalışması için gerekli olan zorunlu/teknik nitelikte çerezleri ve benzeri teknolojileri kullanır. Bu çerezler için ayrı bir onay istenmez ve devre dışı bırakılamaz.",
        ],
      },
      {
        heading: "3. Analiz Çerezleri (Rızanıza Bağlı)",
        body: [
          "Ziyaretçi istatistiklerini anlamak amacıyla Google Analytics çerezleri kullanılabilmektedir. Bu çerezler yalnızca sitemizi ilk ziyaretinizde gösterilen çerez bandında açık rızanızı vermeniz hâlinde etkinleştirilir; “Sadece Zorunlu” seçeneğini işaretlerseniz bu çerezler yüklenmez. Tercihinizi dilediğiniz zaman internet sitemizin altbilgisindeki “Çerez tercihlerini değiştir” bağlantısından güncelleyebilirsiniz.",
        ],
      },
      {
        heading: "4. Çerez Türleri Hakkında Genel Bilgi",
        body: [
          "Zorunlu çerezler: Sitenin temel işlevleri (sayfa gezinme, form gönderimi, güvenlik) için gereklidir ve kapatılamaz.",
          "Performans/analiz çerezleri: Ziyaretçilerin siteyi nasıl kullandığını anlamak için kullanılır; yalnızca açık rızanızla etkinleştirilir.",
          "Pazarlama çerezleri: Kişiselleştirilmiş reklam amacıyla kullanılır; şu an aktif değildir.",
        ],
      },
      {
        heading: "5. Çerezleri Nasıl Yönetebilirsiniz?",
        body: [
          "Tarayıcınızın ayarlar menüsünden mevcut çerezleri silebilir, yeni çerezlerin kaydedilmesini engelleyebilir veya bir çerez kaydedilmeden önce uyarı almayı seçebilirsiniz. Zorunlu çerezleri engellemeniz hâlinde sitenin bazı bölümleri beklendiği gibi çalışmayabilir.",
        ],
      },
      {
        heading: "6. İletişim",
        body: [
          "Çerez kullanımıyla ilgili sorularınız için info@perlamarine.com adresinden bize ulaşabilirsiniz.",
        ],
      },
    ],
  },
};

export default function Legal({ type }: { type: keyof typeof legalContent }) {
  const content = legalContent[type];
  useEffect(() => {
    const metaByType = {
      kvkk: ["KVKK Aydınlatma Metni | Perla Marine", "Perla Marine iletişim taleplerinde işlenen kişisel verilere ilişkin KVKK aydınlatma metni."],
      gizlilik: ["Gizlilik Politikası | Perla Marine", "Perla Marine web sitesi ve iletişim kanallarında bilgi güvenliği ve gizlilik ilkeleri."],
      cerez: ["Çerez Politikası | Perla Marine", "Perla Marine web sitesinde çerezlerin kullanımına ilişkin bilgilendirme."],
    } as const;
    const [title, description] = metaByType[type];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://www.perlamarine.com/${type}`);
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [type]);
  return (
    <>
      <PageHero eyebrow="Kurumsal bilgi" title={content.title} intro={content.intro} variant="about" />
      <section className="legal-page section">
        <div className="legal-page__content">
          <p className="legal-page__updated">Son güncelleme: {LAST_UPDATED}</p>
          {content.sections.map((section) => (
            <div className="legal-page__section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ))}
          <Link className="text-link text-link--dark" href="/iletisim">İletişim sayfasına geçin</Link>
        </div>
      </section>
    </>
  );
}

export function Sitemap() {
  useEffect(() => {
    document.title = "Site Haritası | Perla Marine";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Perla Marine ana sayfa, hizmet, proje, Teknik Bilgiler, SSS ve iletişim sayfalarına hızlı erişim.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://www.perlamarine.com/site-haritasi");
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, []);
  return <><PageHero eyebrow="Kurumsal bilgi" title="Site haritası" intro="Perla Marine ana sayfalarına ve temel bilgi alanlarına buradan ulaşabilirsiniz." variant="about" /><section className="legal-page section"><div className="sitemap-grid"><Link href="/">Ana Sayfa</Link><Link href="/hakkimizda">Hakkımızda</Link><Link href="/hizmetler">Hizmetler</Link><Link href="/hizmet-bolgelerimiz">Hizmet Bölgelerimiz</Link><Link href="/teknik-bilgiler">Teknik Bilgiler</Link><Link href="/sss">SSS</Link><Link href="/iletisim">Bize Ulaşın</Link><Link href="/kvkk">KVKK Aydınlatma</Link><Link href="/gizlilik">Gizlilik Politikası</Link><Link href="/cerez">Çerez Politikası</Link></div></section></>;
}
