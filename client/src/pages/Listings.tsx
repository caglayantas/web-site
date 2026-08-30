import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Anchor } from "lucide-react";
import { getPublishedBoatListings, type BoatListingRow } from "@/lib/content";
import PageHero from "@/components/PageHero";

const SITE_URL = "https://www.perlamarine.com";

export default function Listings() {
  const [data, setData] = useState<BoatListingRow[] | null>(null);

  useEffect(() => {
    getPublishedBoatListings().then(setData).catch(() => setData([]));
  }, []);

  useEffect(() => {
    const title = "Tekne İlanları | Perla Marine";
    const description = "Perla Marine üzerinden satışa sunulan tekne ilanlarını inceleyin.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}/ilanlar`);
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Tekne İlanları"
        title="Satışa sunulan tekneler."
        intro="Perla Marine üzerinden değerlendirilen ilanları buradan inceleyebilir, detaylar için bizimle iletişime geçebilirsiniz."
        variant="services"
      />
      <section className="section">
        {data === null ? (
          <p className="home-content-empty">İlanlar yükleniyor…</p>
        ) : data.length === 0 ? (
          <p className="home-content-empty">Şu anda yayınlanmış bir ilan bulunmuyor. Yeni ilanlar eklendiğinde bu alanda görünecek.</p>
        ) : (
          <div className="listings-grid">
            {data.map((listing) => (
              <article className="listings-grid__card" key={listing.id}>
                {listing.coverImage ? (
                  <img src={listing.coverImage} alt={listing.title} loading="lazy" decoding="async" />
                ) : (
                  <div className="listings-grid__placeholder" aria-hidden="true"><Anchor size={28} /></div>
                )}
                <div className="listings-grid__body">
                  <h2>{listing.title}</h2>
                  <p className="listings-grid__meta">
                    {[listing.year, listing.lengthMeters, listing.location].filter(Boolean).join(" · ")}
                  </p>
                  {listing.engineInfo && <p className="listings-grid__engine">{listing.engineInfo}</p>}
                  <p className="listings-grid__description">{listing.description}</p>
                  <div className="listings-grid__footer">
                    <strong>{listing.price}</strong>
                    <Link className="button button--gold" href="/iletisim">Bilgi alın <ArrowUpRight size={15} /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
