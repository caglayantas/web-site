import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedProjectBySlug, localizeProject, type ProjectRow } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";
export default function ProjectDetail() {
  const [location] = useLocation();
  const { lang, toPath, stripLang } = useLanguage();
  const slug = stripLang(location).split("/projeler/")[1] ?? "";
  const [data, setData] = useState<ProjectRow | null | undefined>(undefined);
  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setData(undefined);
    getPublishedProjectBySlug(slug).then((project) => { if (mounted) setData(project); }).catch(() => { if (mounted) setData(null); });
    return () => { mounted = false; };
  }, [slug]);
  useEffect(() => {
    if (!data) return;
    const project = localizeProject(data, lang);
    const canonicalUrl = `${SITE_URL}${toPath(`/projeler/${data.slug}`)}`;
    document.title = `${project.title} | Perla Marine`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", project.detail);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${project.title} | Perla Marine`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", project.detail);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${window.location.origin}${data.afterImage}`);
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "project";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: project.title, description: project.detail, image: [data.beforeImage, data.afterImage], url: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    const breadcrumbSchema = document.createElement("script");
    breadcrumbSchema.type = "application/ld+json";
    breadcrumbSchema.dataset.pageSchema = "project-breadcrumb";
    breadcrumbSchema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: lang === "en" ? "Home" : "Ana Sayfa", item: `${SITE_URL}${toPath("/")}` },
      { "@type": "ListItem", position: 2, name: lang === "en" ? "Projects" : "Projeler", item: `${SITE_URL}${toPath("/projeler")}` },
      { "@type": "ListItem", position: 3, name: project.title, item: canonicalUrl },
    ] });
    document.head.appendChild(breadcrumbSchema);
    return () => { schema.remove(); breadcrumbSchema.remove(); document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [data, lang]);
  if (data === undefined) return <div className="corporate-page"><div className="corporate-intro"><p>{lang === "en" ? "Loading project…" : "Proje yükleniyor…"}</p></div></div>;
  if (!data) return <NotFound />;
  const project = localizeProject(data, lang);
  const t = {
    back: lang === "en" ? "Back to Projects" : "Projelere dön",
    scope: lang === "en" ? "Scope" : "Kapsam",
    scopeFallback: lang === "en" ? "Current condition, access requirements, and maintenance priorities were assessed together." : "Mevcut sistem, erişim koşulları ve bakım öncelikleri birlikte değerlendirildi.",
    systems: lang === "en" ? "Systems Used" : "Kullanılan sistemler",
    systemsFallback: lang === "en" ? "Relevant mechanical, electrical, and auxiliary systems on the boat were inspected." : "Tekne üzerindeki ilgili mekanik, elektrik ve yardımcı sistemler incelendi.",
    results: lang === "en" ? "Maintenance Result" : "Bakım sonucu",
    resultsFallback: lang === "en" ? "Checkpoints were made visible and the next maintenance steps were clarified." : "Kontrol noktaları görünür hale getirilerek sonraki bakım adımları netleştirildi.",
    beforePhoto: lang === "en" ? "before, current condition" : "önce mevcut durum",
    afterPhoto: lang === "en" ? "after, maintenance result" : "sonra bakım sonucu",
    photo: lang === "en" ? "photo" : "fotoğraf",
    cta: lang === "en" ? "Discuss a similar scope" : "Benzer kapsamı konuşun",
    permalink: lang === "en" ? "Permanent link" : "Kalıcı bağlantı",
  };
  return <div className="corporate-page project-post-page"><article className="project-post"><Link href={toPath("/projeler")} className="text-link text-link--dark"><ArrowLeft size={16} /> {t.back}</Link><header className="project-post__header"><p className="eyebrow">{project.label}</p><h1>{project.title}</h1><p>{project.detail}</p></header><BeforeAfterSlider before={project.beforeImage} after={project.afterImage} beforeAlt={`${project.title} ${t.beforePhoto}`} afterAlt={`${project.title} ${t.afterPhoto}`} label={project.title} />{project.galleryImages.length > 0 && <div className="project-post__gallery">{project.galleryImages.map((url, index) => <div className="project-post__gallery-item" key={url}><img className="project-post__gallery-blur" src={url} alt="" aria-hidden="true" /><img className="project-post__gallery-photo" src={url} alt={`${project.title} — ${t.photo} ${index + 1}`} loading="lazy" decoding="async" /></div>)}</div>}<div className="project-post__facts"><section><h2>{t.scope}</h2><p>{project.scope || t.scopeFallback}</p></section><section><h2>{t.systems}</h2><p>{project.systems || t.systemsFallback}</p></section><section><h2>{t.results}</h2><p>{project.results || t.resultsFallback}</p></section></div><footer className="project-post__footer"><Link href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(project.label)}`} className="button button--gold">{t.cta} <ArrowUpRight size={16} /></Link><a href={toPath(`/projeler/${project.slug}`)} className="text-link text-link--dark">{t.permalink}</a></footer></article></div>;
}
