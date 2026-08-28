import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";
export default function ProjectDetail() {
  const [, params] = useRoute("/projeler/:slug");
  const query = trpc.projects.bySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug), retry: false });
  useEffect(() => {
    if (!query.data) return;
    const canonicalUrl = `${SITE_URL}/projeler/${query.data.slug}`;
    document.title = `${query.data.title} | Perla Marine`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", query.data.detail);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${query.data.title} | Perla Marine`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", query.data.detail);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", `${window.location.origin}${query.data.afterImage}`);
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "project";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: query.data.title, description: query.data.detail, image: [query.data.beforeImage, query.data.afterImage], url: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [query.data]);
  if (query.isLoading) return <div className="corporate-page"><div className="corporate-intro"><p>Proje yükleniyor…</p></div></div>;
  if (query.isError || !query.data) return <NotFound />;
  const project = query.data;
  return <div className="corporate-page project-post-page"><article className="project-post"><Link href="/projeler" className="text-link text-link--dark"><ArrowLeft size={16} /> Projelere dön</Link><header className="project-post__header"><p className="eyebrow">{project.label}</p><h1>{project.title}</h1><p>{project.detail}</p></header><BeforeAfterSlider before={project.beforeImage} after={project.afterImage} beforeAlt={`${project.title} önce mevcut durum`} afterAlt={`${project.title} sonra bakım sonucu`} label={project.title} /><div className="project-post__facts"><section><h2>Kapsam</h2><p>{project.scope || "Mevcut sistem, erişim koşulları ve bakım öncelikleri birlikte değerlendirildi."}</p></section><section><h2>Kullanılan sistemler</h2><p>{project.systems || "Tekne üzerindeki ilgili mekanik, elektrik ve yardımcı sistemler incelendi."}</p></section><section><h2>Bakım sonucu</h2><p>{project.results || "Kontrol noktaları görünür hale getirilerek sonraki bakım adımları netleştirildi."}</p></section></div><footer className="project-post__footer"><Link href="/iletisim" className="button button--gold">Benzer kapsamı konuşun <ArrowUpRight size={16} /></Link><a href={`/projeler/${project.slug}`} className="text-link text-link--dark">Kalıcı bağlantı</a></footer></article></div>;
}
