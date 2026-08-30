import { Link } from "wouter";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const SITE_URL = "https://www.perlamarine.com";

type Region = {
  id: string;
  title: string;
  intro: string;
  marinas: string[];
};

const regions: Region[] = [
  {
    id: "izmir",
    title: "İzmir",
    intro: "Perla Marine'in üssü İzmir'de. En sık ve en hızlı saha desteği verdiğimiz bölge burası; Çeşme'den Seferihisar'a uzanan hatta düzenli olarak sahadayız.",
    marinas: ["Levent Marina (Üçkuyular)", "IC Çeşme Marina", "Port Alaçatı Marina", "Setur Altınyunus Marina (Çeşme)", "Teos Marina (Seferihisar)"],
  },
  {
    id: "mugla",
    title: "Muğla (Bodrum, Marmaris, Fethiye, Göcek, Datça)",
    intro: "Türkiye'nin en yoğun yat trafiğine sahip bölgelerinden Muğla kıyı şeridinde, planlı saha ziyaretleriyle bakım ve onarım desteği sağlıyoruz.",
    marinas: ["Yalıkavak Marina", "Milta Bodrum Marina", "D-Marin Turgutreis", "Aganlar Marina", "Netsel Marmaris Marina", "Martı Marina", "Marmaris Yat Marina", "Ecesaray Marina (Fethiye)", "D-Marin Göcek", "Skopea Marina (Göcek)", "Kairos Marina (Datça)"],
  },
  {
    id: "aydin",
    title: "Aydın (Kuşadası, Didim)",
    intro: "Kuşadası ve Didim'deki marinalarda bulunan teknelere, İzmir üssümüzden planlı seyahatlerle hizmet veriyoruz.",
    marinas: ["Setur Kuşadası Marina", "D-Marin Didim"],
  },
  {
    id: "antalya",
    title: "Antalya (Kemer, Kaş, Finike, Alanya)",
    intro: "Akdeniz kıyısındaki marina ve yat limanlarında, özellikle sezon öncesi ve sonrası kapsamlı bakım talepleri için saha planlaması yapıyoruz.",
    marinas: ["Setur Antalya Marina", "G-Marina Kemer", "Setur Kaş Marina", "Setur Finike Marina", "Alanya Marina", "Antalya Kaleiçi Yat Limanı"],
  },
  {
    id: "marmara",
    title: "Marmara Bölgesi (İstanbul, Yalova, Bursa, Balıkesir)",
    intro: "Marmara'daki marinalarda bulunan teknelere, talep ve kapsamına göre planlanan saha ziyaretleriyle bakım ve onarım hizmeti sunuyoruz.",
    marinas: ["Ataköy Marina (İstanbul)", "West İstanbul Marina", "Setur Kalamış & Fenerbahçe (İstanbul)", "Viaport Tuzla Marina (İstanbul)", "Setur Yalova Marina", "Güzelyalı Yat Limanı (Bursa/Mudanya)", "Setur Ayvalık Marina (Balıkesir)"],
  },
];

export default function ServiceRegions() {
  useEffect(() => {
    const title = "Hizmet Bölgelerimiz — İzmir, Muğla, Antalya, Marmara | Perla Marine";
    const description = "Perla Marine; İzmir, Bodrum, Marmaris, Çeşme, Kuşadası, Antalya ve Marmara kıyılarındaki marinalarda tekne bakım, onarım ve teknik servis hizmeti verir.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}/hizmet-bolgelerimiz`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${SITE_URL}/hizmet-bolgelerimiz`);
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Nerede Hizmet Veriyoruz"
        title="Ege ve Marmara kıyı şeridinde tekne bakım desteği."
        intro="İzmir merkezli ekibimiz; kompozit, marin elektrik, elektronik, mekanik tesisat ve motor-tahrik bakımı için Ege, Akdeniz ve Marmara'daki marinalarda planlı saha ziyaretleri gerçekleştiriyor."
        variant="about"
      />
      <section className="section">
        <div className="service-regions-intro">
          <p>Aşağıdaki bölgelerde, teknenizin bulunduğu marinaya göre planlanan saha ziyaretleriyle hizmet veriyoruz. Talebinizi ilettiğinizde, kapsamına göre en uygun tarihi birlikte belirliyoruz.</p>
        </div>
        <div className="service-regions-grid">
          {regions.map((region) => (
            <article className="service-regions-grid__card" id={region.id} key={region.id}>
              <h2>{region.title}</h2>
              <p>{region.intro}</p>
              <p className="service-regions-grid__label">Bölgedeki marinalardan bazıları</p>
              <ul>
                {region.marinas.map((marina) => <li key={marina}>{marina}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="service-regions-cta">
          <p>Tekneniz yukarıdaki bölgelerin dışında bir marinada mı? Yine de bize ulaşın; kapsam ve mesafeye göre değerlendirip size dönüş yapalım.</p>
          <Link className="button button--gold" href="/iletisim">Bölgenizi belirtin, talebinizi iletin <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
