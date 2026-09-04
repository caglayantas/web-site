import { Link } from "wouter";
import { useEffect, useState } from "react";
import { ArrowUpRight, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useLanguage } from "@/lib/i18n";
import { getPublishedClientReferences, localizeClientReference, type ClientReferenceRow } from "@/lib/content";

const SITE_URL = "https://www.perlamarine.com";

export default function References() {
  const { lang, toPath } = useLanguage();
  const [data, setData] = useState<ClientReferenceRow[] | null>(null);
  useEffect(() => {
    getPublishedClientReferences().then(setData).catch(() => setData([]));
  }, []);
  const references = data ? data.map((r) => localizeClientReference(r, lang)) : null;

  useEffect(() => {
    const title = lang === "en"
      ? "References — Companies We've Worked With | Perla Marine"
      : "Referanslarımız — Çalıştığımız Firmalar | Perla Marine";
    const description = lang === "en"
      ? "See the companies and boat owners Perla Marine has worked with, and the maintenance and repair scope carried out for each."
      : "Perla Marine'in çalıştığı firmaları ve tekne sahiplerini, onlar için gerçekleştirdiği bakım ve onarım kapsamını inceleyin.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}${toPath("/referanslarimiz")}`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", `${SITE_URL}${toPath("/referanslarimiz")}`);
    return () => { document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [lang]);

  return (
    <>
      <PageHero
        eyebrow={lang === "en" ? "References" : "Referanslarımız"}
        title={lang === "en" ? "Trusted by boat owners and marine businesses." : "Tekne sahiplerinin ve denizcilik firmalarının tercihi."}
        intro={lang === "en"
          ? "We only publish a company's name and logo once we have their written permission. Below are some of the businesses and boat owners we've worked with, and the scope of work carried out for each."
          : "Bir firmanın adını ve logosunu yalnızca yazılı izniyle yayınlıyoruz. Aşağıda çalıştığımız bazı firmalar, tekne sahipleri ve onlar için gerçekleştirdiğimiz iş kapsamı yer alıyor."}
        variant="about"
      />
      <section className="section">
        <div className="service-regions-intro">
          <p>{lang === "en"
            ? "Every reference here reflects real work delivered — not a general endorsement. If you'd like to discuss a similar scope for your own boat or company, get in touch."
            : "Buradaki her referans, gerçekten teslim edilmiş bir işi yansıtır — genel bir tavsiye değildir. Kendi tekneniz veya firmanız için benzer bir kapsamı konuşmak isterseniz bize ulaşın."}</p>
        </div>

        {references === null ? (
          <p className="home-content-empty">{lang === "en" ? "Loading references…" : "Referanslar yükleniyor…"}</p>
        ) : references.length === 0 ? (
          <div className="reference-disclosure">
            <span>{lang === "en" ? "Corporate reference area" : "Kurumsal referans alanı"}</span>
            <strong>{lang === "en" ? "Open for new partnerships." : "Yeni iş birlikleri için açık."}</strong>
            <p>{lang === "en"
              ? "Work carried out with operators, manufacturers, and boat owners will appear here as scope and permission details are confirmed."
              : "İşletmeciler, üretici firmalar ve tekne sahipleriyle yürütülen çalışmalar; kapsam ve izin bilgileri netleştirildikçe burada yer alacaktır."}</p>
          </div>
        ) : (
          <div className="references-grid">
            {references.map((reference) => (
              <article className="references-grid__card" key={reference.id}>
                <div className="references-grid__logo">
                  {reference.logo ? <img src={reference.logo} alt={reference.companyName} loading="lazy" decoding="async" /> : <Award size={26} aria-hidden="true" />}
                </div>
                <h3>{reference.companyName}</h3>
                <p>{reference.workSummary}</p>
                {reference.website && (
                  <a className="text-link text-link--dark" href={reference.website} target="_blank" rel="noopener noreferrer">
                    {lang === "en" ? "Visit website" : "Web sitesini ziyaret et"} <ArrowUpRight size={14} />
                  </a>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="service-regions-cta">
          <p>{lang === "en" ? "Want to be our next reference? Tell us about your boat or company." : "Bir sonraki referansımız siz olun. Teknenizi veya firmanızı bize anlatın."}</p>
          <Link className="button button--gold" href={toPath("/iletisim")}>{lang === "en" ? "Get in touch" : "Bize ulaşın"} <ArrowUpRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
