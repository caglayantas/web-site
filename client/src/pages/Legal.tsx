import { Link } from "wouter";
import { useEffect } from "react";
import PageHero from "@/components/PageHero";

const legalContent = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    intro: "Perla Marine, iletişim taleplerini değerlendirmek için paylaşılan kişisel verileri sınırlı ve amaçla bağlantılı biçimde ele alır.",
    paragraphs: [
      "İletişim formunda ad-soyad, e-posta, telefon, tekne veya proje bilgisi, konum ve talep içeriği gibi veriler; talebinize yanıt vermek, teknik değerlendirme yapmak ve iletişim sürecini yürütmek amacıyla kullanılabilir.",
      "Veriler, talebin niteliği ve ilgili hukuki yükümlülükler için gerekli süreyle sınırlı tutulur. Talebinizin gerektirmediği bilgiler paylaşılmamalı; hassas veya üçüncü kişilere ait veriler forma yazılmamalıdır.",
      "Kişisel verilerinizle ilgili başvuru ve taleplerinizi info@perlamarine.com üzerinden iletebilirsiniz. Bu sayfadaki genel metin, Perla Marine’in gerçek veri işleme süreçleri ve güncel hukuki gereklilikleriyle yayın öncesinde kontrol edilmelidir.",
    ],
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    intro: "Perla Marine, ziyaretçi ve iletişim taleplerine ait bilgileri yalnızca gerekli iş amaçları doğrultusunda kullanmayı hedefler.",
    paragraphs: [
      "Site üzerinden paylaşılan bilgiler, talebinize cevap vermek, teknik kapsamı anlamak ve gerekli iletişimi sürdürmek için kullanılabilir. Bilgiler, talep dışında reklam veya ilgisiz iletişim amacıyla kullanılmamalıdır.",
      "E-posta, telefon ve WhatsApp gibi doğrudan kanallarda paylaştığınız içeriklerin güvenliği, ilgili kanalın teknik ve hukuki şartlarına da tabidir. Lütfen hassas kimlik, finans veya üçüncü kişi bilgilerini form üzerinden göndermeyin.",
      "Bu genel politika, kullanılan hizmetler, saklama süreleri ve yetkili erişim süreçleri kesinleştirildikten sonra Perla Marine’in gerçek uygulamalarıyla birlikte son kez gözden geçirilmelidir.",
    ],
  },
  cerez: {
    title: "Çerez Politikası",
    intro: "Çerezler, web sitesinin çalışması, tercihlerin hatırlanması ve deneyimin iyileştirilmesi amacıyla kullanılabilir.",
    paragraphs: [
      "Zorunlu çerezler, temel sayfa işlevlerinin ve güvenli gezinmenin sürdürülebilmesi için gerekli olabilir. Tercihe bağlı analiz veya pazarlama çerezleri kullanılıyorsa, bunlar ziyaretçiye açıkça bildirilmelidir.",
      "Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Bazı çerezleri kapatmak, sitenin belirli işlevlerinin beklenen şekilde çalışmamasına neden olabilir.",
      "Bu sayfa, Perla Marine sitesinde gerçekten kullanılan çerezler, hizmet sağlayıcılar ve saklama süreleriyle eşleştirilerek yayın öncesinde güncel tutulmalıdır.",
    ],
  },
};

export default function Legal({ type }: { type: keyof typeof legalContent }) {
  const content = legalContent[type];
  useEffect(() => {
    const metaByType = {
      kvkk: ["KVKK Aydınlatma Metni | Perla Marine", "Perla Marine iletişim taleplerinde işlenen kişisel verilere ilişkin bilgilendirme."],
      gizlilik: ["Gizlilik Politikası | Perla Marine", "Perla Marine web sitesi ve iletişim kanallarında bilgi güvenliği ve kullanım ilkeleri."],
      cerez: ["Çerez Politikası | Perla Marine", "Perla Marine web sitesinde zorunlu ve tercihe bağlı çerezlerin kullanımına ilişkin bilgilendirme."],
    } as const;
    const [title, description] = metaByType[type];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://www.perlamarine.com/${type}`);
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [type]);
  return <><PageHero eyebrow="Kurumsal bilgi" title={content.title} intro={content.intro} variant="about" /><section className="legal-page section"><div className="legal-page__content">{content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="legal-review-note"><strong>Yayın notu:</strong> Bu genel bilgilendirme, Perla Marine’in gerçek veri işleme ve iletişim süreçleriyle hukuki yayın öncesinde kontrol edilmelidir.</p><Link className="text-link text-link--dark" href="/iletisim">İletişim sayfasına geçin</Link></div></section></>;
}

export function Sitemap() {
  useEffect(() => {
    document.title = "Site Haritası | Perla Marine";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Perla Marine ana sayfa, hizmet, proje, Teknik Bilgiler, SSS ve iletişim sayfalarına hızlı erişim.");
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://www.perlamarine.com/site-haritasi");
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, []);
  return <><PageHero eyebrow="Kurumsal bilgi" title="Site haritası" intro="Perla Marine ana sayfalarına ve temel bilgi alanlarına buradan ulaşabilirsiniz." variant="about" /><section className="legal-page section"><div className="sitemap-grid"><Link href="/">Ana Sayfa</Link><Link href="/hakkimizda">Hakkımızda</Link><Link href="/hizmetler">Hizmetler</Link><Link href="/teknik-bilgiler">Teknik Bilgiler</Link><Link href="/sss">SSS</Link><Link href="/iletisim">Bize Ulaşın</Link><Link href="/kvkk">KVKK Aydınlatma</Link><Link href="/gizlilik">Gizlilik Politikası</Link><Link href="/cerez">Çerez Politikası</Link></div></section></>;
}
