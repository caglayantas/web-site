import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Anchor, ArrowLeft, ArrowRight, Wrench, X } from "lucide-react";
import { getPublishedBoatListings, getListingsEnabled, type BoatListingRow } from "@/lib/content";
import PageHero from "@/components/PageHero";

const SITE_URL = "https://www.perlamarine.com";

function ListingLightbox({ listing, startIndex, onClose }: { listing: BoatListingRow; startIndex: number; onClose: () => void }) {
  const images = [listing.coverImage, ...listing.galleryImages].filter((url): url is string => Boolean(url));
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % images.length);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + images.length) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [onClose, images.length]);

  if (images.length === 0) return null;

  return (
    <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${listing.title} fotoğrafları`} onClick={onClose}>
      <div className="project-lightbox__panel" onClick={(event) => event.stopPropagation()}>
        <div className="project-lightbox__top">
          <span>{listing.title}</span>
          <button type="button" onClick={onClose} aria-label="Galeriyi kapat"><X size={22} /></button>
        </div>
        <div className="project-lightbox__image-wrap">
          <button type="button" className="project-lightbox__nav project-lightbox__nav--left" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)} aria-label="Önceki fotoğraf"><ArrowLeft size={22} /></button>
          <img src={images[index]} alt={`${listing.title} — fotoğraf ${index + 1}`} />
          <button type="button" className="project-lightbox__nav project-lightbox__nav--right" onClick={() => setIndex((current) => (current + 1) % images.length)} aria-label="Sonraki fotoğraf"><ArrowRight size={22} /></button>
        </div>
        <div className="project-lightbox__caption">
          <div><strong>{listing.title}</strong><span>{index + 1}/{images.length}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Listings() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [data, setData] = useState<BoatListingRow[] | null>(null);
  const [lightbox, setLightbox] = useState<{ listing: BoatListingRow; startIndex: number } | null>(null);

  useEffect(() => {
    getListingsEnabled().then(setEnabled).catch(() => setEnabled(false));
  }, []);

  useEffect(() => {
    if (enabled) getPublishedBoatListings().then(setData).catch(() => setData([]));
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const title = "Tekne İlanları | Perla Marine";
    const description = "Perla Marine üzerinden satışa sunulan tekne ilanlarını inceleyin.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${SITE_URL}/ilanlar`);
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [enabled]);

  if (enabled === null) return <div className="corporate-page"><div className="corporate-intro"><p>Yükleniyor…</p></div></div>;
  if (!enabled) {
    return (
      <div className="corporate-page listings-unavailable">
        <div className="listings-unavailable__box">
          <Wrench size={30} aria-hidden="true" />
          <h1>Sayfa şu anda kullanıma kapalı</h1>
          <p>Bu sayfa şu anda teknik düzenlemelerden dolayı kullanıma kapalıdır. Bir süre sonra tekrar deneyiniz.</p>
          <Link className="button button--gold" href="/">Ana sayfaya dön</Link>
        </div>
      </div>
    );
  }

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
                  <button type="button" className="listings-grid__image-button" onClick={() => setLightbox({ listing, startIndex: 0 })} aria-label={`${listing.title} fotoğrafını büyüt`}>
                    <img src={listing.coverImage} alt={listing.title} loading="lazy" decoding="async" />
                  </button>
                ) : (
                  <div className="listings-grid__placeholder" aria-hidden="true"><Anchor size={28} /></div>
                )}
                {listing.galleryImages.length > 0 && (
                  <div className="listings-grid__gallery">
                    {listing.galleryImages.map((url, index) => (
                      <button type="button" key={url} onClick={() => setLightbox({ listing, startIndex: index + 1 })} aria-label={`${listing.title} — fotoğraf ${index + 2} büyüt`}>
                        <img src={url} alt={`${listing.title} — fotoğraf ${index + 2}`} loading="lazy" decoding="async" />
                      </button>
                    ))}
                  </div>
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
      {lightbox && <ListingLightbox listing={lightbox.listing} startIndex={lightbox.startIndex} onClose={() => setLightbox(null)} />}
    </>
  );
}
