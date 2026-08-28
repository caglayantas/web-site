/**
 * Perla Marine: bakım-onarım operasyonlarını bağımsız başlıklar, alt uygulamalar
 * ve ilgili orta ölçekli tekne sistemleri görselleriyle sunan hizmetler sayfası.
 */
import ServiceGrid from "@/components/ServiceGrid";
import PageHero from "@/components/PageHero";
import RouteConnector from "@/components/RouteConnector";
import ServiceFAQ from "@/components/ServiceFAQ";
import { ArrowUpRight } from "lucide-react";

const SITE_URL = "https://www.perlamarine.com";

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="Bakım-onarım hizmetleri"
        title="Teknenizin ihtiyacı olan işi, sahadaki deneyimle tamamlıyoruz."
        intro="Kompozit yüzeylerden elektrik ve enerji sistemlerine, motor-tahrik-dümen grubundan mekanik tesisatlara kadar bakım, arıza tespiti ve onarım operasyonları yürütüyoruz."
        variant="services"
      />

      <section className="section service-page-intro">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">Operasyon kapsamı</p>
            <h2>Her başlık, kendi tekne sisteminin gerçek ihtiyacına göre ele alınır.</h2>
          </div>
          <p>
            Gereksiz kapsam büyütmeden, sorunun kaynağını anlayıp uygulanabilir bakım ve onarım adımlarını planlıyoruz. İhtiyaç halinde farklı operasyonları tek bir refit sürecinde koordineli yürütüyoruz.
          </p>
        </div>
        <ServiceGrid expanded />
      </section>
      <RouteConnector label="tekneye özel bakım" />

      <section className="service-detail-feature">
        <div className="service-detail-feature__image">
          <img src="/manus-storage/perla-service-mechanical_1537487f.jpg" alt="Orta ölçekli yatın mekanik tesisatlarında bakım ve sızdırmazlık kontrolü" />
        </div>
        <div className="service-detail-feature__content">
          <p className="eyebrow eyebrow--light">Mekanik tesisatlar</p>
          <h2>Servis erişimi kolay, bağlantıları güvenilir sistemler.</h2>
          <p>
            Pompa, vana, boru, hortum, sintine, yakıt ve deniz suyu hatlarında bakım ve onarım yaparken; sızdırmazlık, erişim ve kullanım güvenliğini birlikte kontrol ediyoruz.
          </p>
          <a href={`${SITE_URL}/iletisim`} className="text-link text-link--light">Teknik durumu paylaşın <ArrowUpRight size={16} /></a>
        </div>
      </section>
      <section className="coverage-band section">
        <div>
          <p className="eyebrow">Çalışma kapsamı</p>
          <h2>Teknenizin bulunduğu marina ve bölgeyi birlikte değerlendirelim.</h2>
        </div>
        <p>Perla Marine çalışma uygunluğunu; işin kapsamı, tekneye erişim koşulları, gerekli ekip ve planlama takvimine göre değerlendirir. İletişim formunda konum bilgisini paylaşmanız, ilk görüşmenin doğru çerçevede başlamasını sağlar.</p>
      </section>
      <ServiceFAQ />
      <RouteConnector label="üretici ekipler" align="left" />

      <section className="manufacturer-callout section">
        <div>
          <p className="eyebrow">Üretici firmalara danışmanlık</p>
          <h2>Bakım sahasındaki deneyimi, üretim kararlarına taşıyoruz.</h2>
        </div>
        <div>
          <p>Tekne ve yat üreten firmalara; model ve kalıp imalatı, servis edilebilirlik, sistem erişimi, kompozit uygulamalar ve teknik koordinasyon başlıklarında proje bazlı danışmanlık sunuyoruz.</p>
          <a href={`${SITE_URL}/iletisim`} className="text-link text-link--dark">Danışmanlık kapsamını inceleyin <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </>
  );
}
