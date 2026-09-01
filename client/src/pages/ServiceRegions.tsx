import { Link } from "wouter";
import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/lib/i18n";
import RegionsMap from "@/components/RegionsMap";

const SITE_URL = "https://www.perlamarine.com";

type Region = {
  id: string;
  title: string;
  intro: string;
  marinas: string[];
};

const regionsTr: Region[] = [
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
  {
    id: "diger",
    title: "Diğer Bölgeler / Türkiye Geneli",
    intro: "Yukarıdaki bölgelerin dışında, Türkiye'nin diğer kıyı noktalarındaki talepleri de değerlendiriyoruz. Kapsam ve mesafeye göre saha ziyareti planlayıp size dönüş yapıyoruz.",
    marinas: [],
  },
];

const regionsEn: Region[] = [
  {
    id: "izmir",
    title: "İzmir",
    intro: "Perla Marine is based in İzmir. This is the region where we provide the most frequent and fastest site support — we're regularly on site along the stretch from Çeşme to Seferihisar.",
    marinas: ["Levent Marina (Üçkuyular)", "IC Çeşme Marina", "Port Alaçatı Marina", "Setur Altınyunus Marina (Çeşme)", "Teos Marina (Seferihisar)"],
  },
  {
    id: "mugla",
    title: "Muğla (Bodrum, Marmaris, Fethiye, Göcek, Datça)",
    intro: "We provide maintenance and repair support through planned site visits along the Muğla coastline, one of Turkey's busiest yachting regions.",
    marinas: ["Yalıkavak Marina", "Milta Bodrum Marina", "D-Marin Turgutreis", "Aganlar Marina", "Netsel Marmaris Marina", "Martı Marina", "Marmaris Yat Marina", "Ecesaray Marina (Fethiye)", "D-Marin Göcek", "Skopea Marina (Göcek)", "Kairos Marina (Datça)"],
  },
  {
    id: "aydin",
    title: "Aydın (Kuşadası, Didim)",
    intro: "We serve boats at marinas in Kuşadası and Didim through planned trips from our İzmir base.",
    marinas: ["Setur Kuşadası Marina", "D-Marin Didim"],
  },
  {
    id: "antalya",
    title: "Antalya (Kemer, Kaş, Finike, Alanya)",
    intro: "We plan site visits to marinas and yacht harbors along the Mediterranean coast, especially for comprehensive pre- and post-season maintenance requests.",
    marinas: ["Setur Antalya Marina", "G-Marina Kemer", "Setur Kaş Marina", "Setur Finike Marina", "Alanya Marina", "Antalya Kaleiçi Yat Limanı"],
  },
  {
    id: "marmara",
    title: "Marmara Region (İstanbul, Yalova, Bursa, Balıkesir)",
    intro: "We provide maintenance and repair service to boats at marinas in the Marmara region through site visits planned according to the request and its scope.",
    marinas: ["Ataköy Marina (İstanbul)", "West İstanbul Marina", "Setur Kalamış & Fenerbahçe (İstanbul)", "Viaport Tuzla Marina (İstanbul)", "Setur Yalova Marina", "Güzelyalı Yat Limanı (Bursa/Mudanya)", "Setur Ayvalık Marina (Balıkesir)"],
  },
  {
    id: "diger",
    title: "Other Regions / Nationwide",
    intro: "We also consider requests from other coastal areas of Turkey outside the regions listed above. We plan a site visit based on scope and distance and get back to you.",
    marinas: [],
  },
];

export default function ServiceRegions() {
  const { lang, toPath } = useLanguage();
  const regions = lang === "en" ? regionsEn : regionsTr;
  useEffect(() => {
    const title = lang === "en"
      ? "Coverage Areas — İzmir, Muğla, Antalya, Marmara | Perla Marine"
      : "Hizmet Bölgelerimiz — İzmir, Muğla, Antalya, Marmara | Perla Marine";
    const description = lang === "en"
      ? "Perla Marine provides boat maintenance, repair, and technical service at marinas along the İzmir, Bodrum, Marmaris, Çeşme, Kuşadası, Antalya, and Marmara coasts."
      : "Perla Marine; İzmir, Bodrum, Marmaris, Çeşme, Kuşadası, Antalya ve Marmara kıyılarındaki marinalarda tekne bakım, onarım ve teknik servis hizmeti verir.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}${toPath("/hizmet-bolgelerimiz")}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${SITE_URL}${toPath("/hizmet-bolgelerimiz")}`);
    return () => { document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [lang]);

  return (
    <>
      <PageHero
        eyebrow={lang === "en" ? "Where We Work" : "Nerede Hizmet Veriyoruz"}
        title={lang === "en" ? "Boat maintenance support along the Aegean and Marmara coasts." : "Ege ve Marmara kıyı şeridinde tekne bakım desteği."}
        intro={lang === "en"
          ? "Our İzmir-based team carries out planned site visits to marinas in the Aegean, Mediterranean, and Marmara regions for composite, marine electrical, electronics, mechanical systems, and propulsion maintenance."
          : "İzmir merkezli ekibimiz; kompozit, marin elektrik, elektronik, mekanik tesisat ve motor-tahrik bakımı için Ege, Akdeniz ve Marmara'daki marinalarda planlı saha ziyaretleri gerçekleştiriyor."}
        variant="about"
      />
      <section className="section">
        <div className="service-regions-intro">
          <p>{lang === "en"
            ? "We serve the regions below through site visits planned around the marina where your boat is located. Once you share your request, we work with you to set the most suitable date based on its scope."
            : "Aşağıdaki bölgelerde, teknenizin bulunduğu marinaya göre planlanan saha ziyaretleriyle hizmet veriyoruz. Talebinizi ilettiğinizde, kapsamına göre en uygun tarihi birlikte belirliyoruz."}</p>
        </div>
        <RegionsMap ariaLabel={lang === "en" ? "Map of marinas we serve" : "Hizmet verdiğimiz marinaların haritası"} />
        <div className="service-regions-grid">
          {regions.map((region) => (
            <article className="service-regions-grid__card" id={region.id} key={region.id}>
              <h2>{region.title}</h2>
              <p>{region.intro}</p>
              {region.marinas.length > 0 && (
                <>
                  <p className="service-regions-grid__label">{lang === "en" ? "Some of the marinas in this region" : "Bölgedeki marinalardan bazıları"}</p>
                  <ul>
                    {region.marinas.map((marina) => <li key={marina}>{marina}</li>)}
                  </ul>
                </>
              )}
            </article>
          ))}
        </div>
        <div className="service-regions-cta">
          <p>{lang === "en" ? "Share your request; let's work out the best next step together based on scope and distance." : "Talebinizi paylaşın; kapsam ve mesafeye göre en uygun sonraki adımı birlikte belirleyelim."}</p>
          <Link className="button button--gold" href={toPath("/iletisim")}>{lang === "en" ? "Tell us your region and request" : "Bölgenizi belirtin, talebinizi iletin"} <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
