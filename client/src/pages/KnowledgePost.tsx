import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getKnowledgeMeta, renderKnowledgeBody } from "@/lib/markdown";
import { getKnowledgeCoverImage } from "@/lib/knowledge";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";

export default function KnowledgePost() {
  const [, params] = useRoute("/teknik-bilgiler/:slug");
  const post = trpc.knowledge.bySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug) });
  useEffect(() => {
    if (!post.data) return;
    const meta = getKnowledgeMeta(post.data);
    const canonicalUrl = `${SITE_URL}/teknik-bilgiler/${post.data.slug}`;
    const imageUrl = post.data.coverImage || getKnowledgeCoverImage(post.data.category, post.data.title);
    document.title = `${meta.title} | Perla Marine`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", meta.description);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${meta.title} | Perla Marine`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", imageUrl.startsWith("http") ? imageUrl : `${window.location.origin}${imageUrl}`);
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.pageSchema = "knowledge";
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: post.data.title, description: meta.description, image: imageUrl, datePublished: post.data.publishedAt, dateModified: post.data.updatedAt, mainEntityOfPage: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [post.data]);
  if (post.isLoading) return <div className="corporate-page"><div className="corporate-intro"><p>Teknik bilgi yükleniyor…</p></div></div>;
  if (post.isError || !post.data) return <NotFound />;
  const article = post.data;
  const coverImage = article.coverImage || getKnowledgeCoverImage(article.category, article.title);
  const meta = getKnowledgeMeta(article);
  return <div className="corporate-page knowledge-post-page"><article className="knowledge-post"><Link href="/teknik-bilgiler" className="text-link text-link--dark"><ArrowLeft size={16} /> Teknik Bilgiler’e dön</Link><header className="knowledge-post__header"><p className="eyebrow">{article.category}</p><h1>{article.title}</h1><p className="knowledge-post__excerpt">{article.excerpt}</p><div className="knowledge-post__meta"><span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("tr-TR", { dateStyle: "long" }) : "Teknik not"}</span><span>·</span><span>Perla Marine bakım arşivi</span></div></header><img className="knowledge-post__cover" src={coverImage} alt={`${article.title} kapak görseli`} /><div className="knowledge-post__body" dangerouslySetInnerHTML={{ __html: renderKnowledgeBody(article.body) }} /><footer className="knowledge-post__footer"><Link href="/iletisim" className="button button--gold">Bu kapsamı konuşun <ArrowUpRight size={16} /></Link><a href={`/teknik-bilgiler/${article.slug}`} className="text-link text-link--dark">Kalıcı bağlantıyı kopyala</a></footer></article></div>;
}
