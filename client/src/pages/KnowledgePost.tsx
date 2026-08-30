import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock } from "lucide-react";
import { getPublishedKnowledgePostBySlug, type KnowledgePostRow } from "@/lib/content";
import { getKnowledgeMeta, renderKnowledgeSections } from "@/lib/markdown";
import { getKnowledgeCoverImage } from "@/lib/knowledge";
import NotFound from "@/pages/NotFound";

const SITE_URL = "https://www.perlamarine.com";
const FONT_SIZES = ["sm", "md", "lg", "xl"] as const;
type FontSize = (typeof FONT_SIZES)[number];

function estimateReadingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector(".knowledge-post__sections");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="knowledge-post__progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>;
}

function FontSizeControl({ size, onChange }: { size: FontSize; onChange: (size: FontSize) => void }) {
  const index = FONT_SIZES.indexOf(size);
  return (
    <div className="knowledge-post__font-control" role="group" aria-label="Yazı boyutu">
      <button type="button" onClick={() => onChange(FONT_SIZES[Math.max(0, index - 1)])} disabled={index === 0} aria-label="Yazıyı küçült"><span aria-hidden="true">A−</span></button>
      <span aria-hidden="true">Aa</span>
      <button type="button" onClick={() => onChange(FONT_SIZES[Math.min(FONT_SIZES.length - 1, index + 1)])} disabled={index === FONT_SIZES.length - 1} aria-label="Yazıyı büyüt"><span aria-hidden="true">A+</span></button>
    </div>
  );
}

export default function KnowledgePost() {
  const [, params] = useRoute("/teknik-bilgiler/:slug");
  const [data, setData] = useState<KnowledgePostRow | null | undefined>(undefined);
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem("knowledge-font-size") as FontSize) || "md");
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => {
    if (!params?.slug) return;
    let mounted = true;
    setData(undefined);
    setOpenSection(0);
    getPublishedKnowledgePostBySlug(params.slug).then((post) => { if (mounted) setData(post); }).catch(() => { if (mounted) setData(null); });
    return () => { mounted = false; };
  }, [params?.slug]);

  useEffect(() => { localStorage.setItem("knowledge-font-size", fontSize); }, [fontSize]);

  useEffect(() => {
    if (!data) return;
    const meta = getKnowledgeMeta(data);
    const canonicalUrl = `${SITE_URL}/teknik-bilgiler/${data.slug}`;
    const imageUrl = data.coverImage || getKnowledgeCoverImage(data.category, data.title);
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
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: data.title, description: meta.description, image: imageUrl, datePublished: data.publishedAt, dateModified: data.updatedAt, mainEntityOfPage: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [data]);

  if (data === undefined) return <div className="corporate-page"><div className="corporate-intro"><p>Teknik bilgi yükleniyor…</p></div></div>;
  if (!data) return <NotFound />;

  const article = data;
  const coverImage = article.coverImage || getKnowledgeCoverImage(article.category, article.title);
  const { intro, sections } = renderKnowledgeSections(article.body);
  const readingMinutes = estimateReadingMinutes(article.body);

  return (
    <div className="corporate-page knowledge-post-page">
      <ReadingProgress />
      <article className="knowledge-post">
        <Link href="/teknik-bilgiler" className="text-link text-link--dark"><ArrowLeft size={16} /> Teknik Bilgiler’e dön</Link>
        <header className="knowledge-post__header">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="knowledge-post__excerpt">{article.excerpt}</p>
          <div className="knowledge-post__meta">
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("tr-TR", { dateStyle: "long" }) : "Teknik not"}</span>
            <span>·</span>
            <span><Clock size={12} aria-hidden="true" /> {readingMinutes} dk okuma</span>
            <span>·</span>
            <span>Perla Marine bakım arşivi</span>
          </div>
        </header>

        <img className="knowledge-post__cover" src={coverImage} alt={`${article.title} kapak görseli`} />

        <div className="knowledge-post__toolbar">
          <span className="knowledge-post__section-count">{sections.length > 0 ? `${sections.length} bölüm` : "Tek parça"}</span>
          <FontSizeControl size={fontSize} onChange={setFontSize} />
        </div>

        {intro && <div className={`knowledge-post__body knowledge-post__body--${fontSize}`} dangerouslySetInnerHTML={{ __html: intro }} />}

        {sections.length > 0 ? (
          <div className="knowledge-post__sections">
            {sections.map((section, index) => {
              const isOpen = openSection === index;
              return (
                <section className={`knowledge-post__section${isOpen ? " is-open" : ""}`} key={section.id} id={section.id}>
                  <button type="button" className="knowledge-post__section-toggle" onClick={() => setOpenSection(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span className="knowledge-post__section-number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="knowledge-post__section-title">{section.title}</span>
                    <ChevronDown size={18} className="knowledge-post__section-chevron" aria-hidden="true" />
                  </button>
                  {isOpen && <div className={`knowledge-post__body knowledge-post__body--${fontSize}`} dangerouslySetInnerHTML={{ __html: section.html }} />}
                </section>
              );
            })}
          </div>
        ) : null}

        <footer className="knowledge-post__footer">
          <Link href={`/iletisim?kategori=${encodeURIComponent(article.category)}`} className="button button--gold">Bu kapsamı konuşun <ArrowUpRight size={16} /></Link>
          <a href={`/teknik-bilgiler/${article.slug}`} className="text-link text-link--dark">Kalıcı bağlantıyı kopyala</a>
        </footer>
      </article>
    </div>
  );
}
