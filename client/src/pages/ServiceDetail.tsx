import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, Check, FileText, Wrench } from "lucide-react";
import { getPublishedServiceBySlug, getPublishedKnowledgePosts, localizeService, localizeKnowledge, type ServiceRow, type KnowledgePostRow } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";

// Maps a service slug back to the technical-note category that covers it, so a
// service page can surface the informational articles a visitor might want to
// read before booking. Kept in sync with the equivalent map in KnowledgePost.tsx.
const SERVICE_SLUG_TO_CATEGORY: Record<string, string> = {
  "kompozit-cozumler": "Kompozit çözümler",
  "marin-elektrik": "Marin elektrik",
  "marin-elektronigi": "Marin elektroniği",
  "isitma-sogutma": "Isıtma-soğutma",
  "mekanik-tesisat": "Mekanik tesisat",
  "motor-tahrik-dumen": "Motor, tahrik ve dümen",
  "yelken-arma": "Yelken ve arma donanım",
  "guverte-ekipmanlari": "Güverte ekipmanları",
  "uretim-danismanligi": "Üretim danışmanlığı",
  "tekneye-ozel-cozumler": "Tekneye özel çözümler",
};

export default function ServiceDetail() {
  const [location] = useLocation();
  const { lang, toPath, stripLang } = useLanguage();
  const slug = stripLang(location).split("/hizmetler/")[1] ?? "";
  const [data, setData] = useState<ServiceRow | null | undefined>(undefined);
  const [relatedPosts, setRelatedPosts] = useState<KnowledgePostRow[]>([]);

  useEffect(() => {
    getPublishedKnowledgePosts().then((posts) => {
      const category = SERVICE_SLUG_TO_CATEGORY[slug];
      setRelatedPosts(category ? posts.filter((post) => post.category === category).slice(0, 3) : []);
    }).catch(() => setRelatedPosts([]));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setData(undefined);
    getPublishedServiceBySlug(slug).then((service) => { if (mounted) setData(service); }).catch(() => { if (mounted) setData(null); });
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (!data) return;
    const service = localizeService(data, lang);
    const canonicalUrl = `${SITE_URL}${toPath(`/hizmetler/${data.slug}`)}`;
    const title = `${service.title} | Perla Marine`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", service.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", service.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    if (data.image) document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${window.location.origin}${data.image}`);

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "service";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.description,
      url: canonicalUrl,
      provider: { "@type": "LocalBusiness", name: "Perla Marine", url: SITE_URL },
      areaServed: [
        { "@type": "City", name: "İzmir" }, { "@type": "City", name: "Bodrum" }, { "@type": "City", name: "Marmaris" },
        { "@type": "City", name: "Kuşadası" }, { "@type": "City", name: "Antalya" }, { "@type": "City", name: "İstanbul" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: service.title,
        itemListElement: service.operations.map((operation) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: operation } })),
      },
    });
    document.head.appendChild(schema);

    const breadcrumbSchema = document.createElement("script");
    breadcrumbSchema.type = "application/ld+json";
    breadcrumbSchema.dataset.pageSchema = "service-breadcrumb";
    breadcrumbSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Ana Sayfa", item: `${SITE_URL}${toPath("/")}` },
        { "@type": "ListItem", position: 2, name: lang === "en" ? "Services" : "Hizmetler", item: `${SITE_URL}${toPath("/hizmetler")}` },
        { "@type": "ListItem", position: 3, name: service.title, item: canonicalUrl },
      ],
    });
    document.head.appendChild(breadcrumbSchema);

    return () => {
      schema.remove();
      breadcrumbSchema.remove();
      document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım";
    };
  }, [data, lang]);

  if (data === undefined) return <div className="corporate-page"><div className="corporate-intro"><p>{lang === "en" ? "Loading service…" : "Hizmet yükleniyor…"}</p></div></div>;
  if (!data) return <NotFound />;

  const service = localizeService(data, lang);
  const t = {
    back: lang === "en" ? "Back to Services" : "Hizmetlere dön",
    scopeLabel: lang === "en" ? "Maintenance scope" : "Bakım kapsamı",
    approachLabel: lang === "en" ? "The Perla Marine approach" : "Perla Marine yaklaşımı",
    subtopicsLabel: lang === "en" ? "This service covers" : "Bu hizmet kapsamında",
    cta: service.cta || (lang === "en" ? "Request this service" : "Bu hizmeti talep edin"),
    permalink: lang === "en" ? "Permanent link" : "Kalıcı bağlantı",
  };

  return (
    <div className="corporate-page project-post-page">
      <article className="project-post">
        <Link href={toPath("/hizmetler")} className="text-link text-link--dark"><ArrowLeft size={16} /> {t.back}</Link>
        <header className="project-post__header">
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </header>

        {service.image && <img className="service-post__image" src={service.image} alt={service.title} loading="lazy" decoding="async" />}

        {service.subtopics.length > 0 && (
          <section className="project-post__facts">
            <h2>{t.subtopicsLabel}</h2>
            <ul className="check-list check-list--dark">
              {service.subtopics.map((subtopic) => <li key={subtopic}><Check size={16} aria-hidden="true" /><span>{subtopic}</span></li>)}
            </ul>
          </section>
        )}

        {service.intro && <p className="service-post__intro">{service.intro}</p>}

        <div className="project-post__facts">
          {service.operations.length > 0 && (
            <section>
              <h2>{t.scopeLabel}</h2>
              <ul className="check-list check-list--dark">
                {service.operations.map((operation) => <li key={operation}><Check size={16} aria-hidden="true" /><span>{operation}</span></li>)}
              </ul>
            </section>
          )}
          {service.note && (
            <section>
              <h2><Wrench size={17} aria-hidden="true" style={{ marginRight: 6, verticalAlign: -3 }} />{t.approachLabel}</h2>
              <p>{service.note}</p>
            </section>
          )}
        </div>

        {relatedPosts.length > 0 && (
          <section className="service-post__related-articles">
            <h2>{lang === "en" ? "Related technical notes" : "İlgili teknik bilgiler"}</h2>
            <div className="service-post__related-list">
              {relatedPosts.map((post) => {
                const localized = localizeKnowledge(post, lang);
                return (
                  <Link key={post.slug} href={toPath(`/teknik-bilgiler/${post.slug}`)} className="service-post__related-item">
                    <FileText size={16} aria-hidden="true" />
                    <span>{localized.title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <footer className="project-post__footer">
          <Link href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(service.title)}`} className="button button--gold">{t.cta} <ArrowUpRight size={16} /></Link>
          <a href={toPath(`/hizmetler/${service.slug}`)} className="text-link text-link--dark">{t.permalink}</a>
        </footer>
      </article>
    </div>
  );
}
