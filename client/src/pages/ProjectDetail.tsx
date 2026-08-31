import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPublishedProjectBySlug, type ProjectRow } from "@/lib/content";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";
export default function ProjectDetail() {
  const [, params] = useRoute("/projeler/:slug");
  const [data, setData] = useState<ProjectRow | null | undefined>(undefined);
  useEffect(() => {
    if (!params?.slug) return;
    let mounted = true;
    setData(undefined);
    getPublishedProjectBySlug(params.slug).then((project) => { if (mounted) setData(project); }).catch(() => { if (mounted) setData(null); });
    return () => { mounted = false; };
  }, [params?.slug]);
  useEffect(() => {
    if (!data) return;
    const canonicalUrl = `${SITE_URL}/projeler/${data.slug}`;
    document.title = `${data.title} | Perla Marine`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", data.detail);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${data.title} | Perla Marine`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", data.detail);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${window.location.origin}${data.afterImage}`);
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "project";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: data.title, description: data.detail, image: [data.beforeImage, data.afterImage], url: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [data]);
  if (data === undefined) return <div className="corporate-page"><div className="corporate-intro"><p>Proje yükleniyor…</p></div></div>;
  if (!data) return <NotFound />;
  const project = data;
  return <div className="corporate-page project-post-page"><article className="project-post"><Link href="/projeler" className="text-link text-link--dark"><ArrowLeft size={16} /> Projelere dön</Link><header className="project-post__header"><p className="eyebrow">{project.label}</p><h1>{project.title}</h1><p>{project.detail}</p></header><BeforeAfterSlider before={project.beforeImage} after={project.afterImage} beforeAlt={`${project.title} önce mevcut durum`} afterAlt={`${project.title} sonra bakım sonucu`} label={project.title} />{project.galleryImages.length > 0 && <div className="project-post__gallery">{project.galleryImages.map((url, index) => <img key={url} src={url} alt={`${project.title} — fotoğraf ${index + 1}`} loading="lazy" decoding="async" />)}</div>}<div className="project-post__facts"><section><h2>Kapsam</h2><p>{project.scope || "Mevcut sistem, erişim koşulları ve bakım öncelikleri birlikte değerlendirildi."}</p></section><section><h2>Kullanılan sistemler</h2><p>{project.systems || "Tekne üzerindeki ilgili mekanik, elektrik ve yardımcı sistemler incelendi."}</p></section><section><h2>Bakım sonucu</h2><p>{project.results || "Kontrol noktaları görünür hale getirilerek sonraki bakım adımları netleştirildi."}</p></section></div><footer className="project-post__footer"><Link href={`/iletisim?kategori=${encodeURIComponent(project.label)}`} className="button button--gold">Benzer kapsamı konuşun <ArrowUpRight size={16} /></Link><a href={`/projeler/${project.slug}`} className="text-link text-link--dark">Kalıcı bağlantı</a></footer></article></div>;
}
