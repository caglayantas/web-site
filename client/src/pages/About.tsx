/**
 * Perla Marine / Sessiz Kuvvet: Hakkımızda sayfası, iddiadan çok çalışma ilkelerini ve teknik
 * yaklaşımı öne çıkaran fildişi editoryal yüzeyler ile derin lacivert denge üzerine kuruludur.
 */
import PageHero from "@/components/PageHero";
import RouteConnector from "@/components/RouteConnector";
import { ArrowUpRight, Check } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="Perla Marine"
        title="Tekne bakımını, sahadaki deneyimle güvenilir hale getiriyoruz."
        intro="Perla Marine; orta ölçekli tekne ve yatlarda bakım-onarım, refit ve sistem yenileme operasyonlarını tekneye özel uygulama deneyimiyle yürütür."
        variant="about"
      />

      <section className="about-intro section">
        <div className="about-intro__statement">
          <p className="eyebrow">Neyi önemsiyoruz?</p>
          <h2>Teknenin her parçası birbiriyle konuşmalıdır.</h2>
        </div>
        <div className="about-intro__text">
          <p>
            Enerji depolama sistemi, tahrik altyapısı, mekanik tesisat ve kullanıcı deneyimi birbirinden bağımsız kararlar değildir. Perla Marine, bu ilişkiyi proje boyunca görünür tutarak teknik uzmanlığı tekne özelindeki ihtiyaçlarla buluşturur.
          </p>
          <p>
            Bakım, refit veya özel bir sistem yenilemesi söz konusu olduğunda; hedefimiz kapsamı gereksiz büyütmek değil, doğru müdahaleyi temiz ve anlaşılır biçimde tamamlamaktır.
          </p>
        </div>
      </section>
      <RouteConnector label="çalışma ilkeleri" />

      <section className="principles-section">
        <div className="principles-section__heading">
          <p className="eyebrow eyebrow--light">Sahadaki çalışma biçimimiz</p>
          <h2>Her projede aynı hassasiyeti sürdürüyoruz.</h2>
        </div>
        <div className="principles-list">
          <article><h3>Teknik bütünlük</h3><p>Sistemleri ayrı parçalar olarak değil, denizde birlikte çalışan bir yapı olarak ele alırız.</p></article>
          <article><h3>Şeffaf süreç</h3><p>Bakım ve onarım adımlarının gerekçelerini, uygulama sırasını ve öncelikleri anlaşılır biçimde paylaşırız.</p></article>
          <article><h3>Uygulanabilirlik</h3><p>Çözümleri yalnızca teorik performansla değil, montaj, kullanım ve servis gerçekliğiyle değerlendiririz.</p></article>
        </div>
      </section>
      <RouteConnector label="teknik ortaklık" align="left" />

      <section className="section scope-section">
        <div className="scope-section__diagram" aria-hidden="true">
          <div className="scope-section__diagram-head"><span>PROJE / MODÜL</span><b>P / M</b></div>
          <div className="scope-section__diagram-map"><i /><i /><i /><i /><i /><i /></div>
          <div className="scope-section__diagram-labels"><span>ENERJİ</span><span>TAHRİK</span><span>MEKANİK</span></div>
          <p>Bağlamdan uygulamaya<br />tekne özelinde sistem akışı.</p>
        </div>
        <div className="scope-section__copy">
          <p className="eyebrow">Kapsamımız</p>
          <h2>Yeni projelerden sistem dönüşümlerine uzanan teknik ortaklık.</h2>
          <p>
            Perla Marine, tekne sahipleri ve üretici firmalar için mühendislik, sistem entegrasyonu, bakım-onarım ve danışmanlık ekseninde çalışır.
          </p>
          <ul className="check-list check-list--dark">
            <li><Check size={16} /> Proje bazlı teknik değerlendirme</li>
            <li><Check size={16} /> Sistem ve uygulama koordinasyonu</li>
            <li><Check size={16} /> Üretici firmalara çözüm ortaklığı</li>
          </ul>
          <a href="https://www.perlamarine.com/iletisim" className="text-link text-link--dark">Projenizi konuşalım <ArrowUpRight size={16} /></a>
        </div>
      </section>
    </>
  );
}
