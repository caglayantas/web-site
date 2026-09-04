import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/lib/i18n";
import { getPublishedRegions, localizeRegion, type RegionRow } from "@/lib/content";
import RegionsMap from "@/components/RegionsMap";

const SITE_URL = "https://www.perlamarine.com";

export default function ServiceRegions() {
  const { lang, toPath } = useLanguage();
  const [regionsData, setRegionsData] = useState<RegionRow[] | null>(null);
  useEffect(() => {
    getPublishedRegions().then(setRegionsData).catch(() => setRegionsData([]));
  }, []);
  const regions = regionsData ? regionsData.map((region) => localizeRegion(region, lang)) : null;

  useEffect(() => {
    const title = lang === "en"
      ? "Coverage Areas — İzmir, Bodrum, Antalya, Marmara Boat Maintenance | Perla Marine"
      : "İzmir Tekne Bakım, Bodrum Tekne Tamir ve Hizmet Bölgelerimiz | Perla Marine";
    const description = lang === "en"
      ? "Perla Marine provides boat maintenance, repair, and technical service at marinas along the İzmir, Bodrum, Marmaris, Çeşme, Kuşadası, Antalya, and Marmara coasts."
      : "İzmir tekne bakım, Bodrum tekne tamir, Marmaris ve Kuşadası'nda tekne onarımı. Perla Marine; Ege, Akdeniz ve Marmara kıyılarındaki marinalarda tekne bakım, onarım ve teknik servis hizmeti verir.";
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
        {regions && regions.length > 0 && (
          <RegionsMap ariaLabel={lang === "en" ? "Map of marinas we serve" : "Hizmet verdiğimiz marinaların haritası"} marinas={regions.flatMap((r) => r.marinas.filter((m) => m.lat !== undefined && m.lng !== undefined))} />
        )}
        <div className="service-regions-grid">
          {regions === null ? (
            <p className="home-content-empty">{lang === "en" ? "Loading regions…" : "Bölgeler yükleniyor…"}</p>
          ) : regions.map((region) => (
            <article className="service-regions-grid__card" id={region.regionKey} key={region.id}>
              <h2>{region.name}</h2>
              <p>{region.intro}</p>
              {region.marinas.length > 0 && (
                <>
                  <p className="service-regions-grid__label">{lang === "en" ? "Some of the marinas in this region" : "Bölgedeki marinalardan bazıları"}</p>
                  <ul>
                    {region.marinas.map((marina) => <li key={marina.name}>{marina.name}</li>)}
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
