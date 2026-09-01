import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, ChevronDown, Clock } from "lucide-react";
import { getPublishedKnowledgePostBySlug, localizeKnowledge, type KnowledgePostRow } from "@/lib/content";
import { getKnowledgeMeta, renderKnowledgeSections } from "@/lib/markdown";
import { getKnowledgeCoverImage } from "@/lib/knowledge";
import { useLanguage } from "@/lib/i18n";
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
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = document.querySelector(".knowledge-post__sections");
        if (!article) return;
        const rect = article.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.5;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);
  return <div className="knowledge-post__progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>;
}

function FontSizeControl({ size, onChange, label }: { size: FontSize; onChange: (size: FontSize) => void; label: string }) {
  const index = FONT_SIZES.indexOf(size);
  return (
    <div className="knowledge-post__font-control" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(FONT_SIZES[Math.max(0, index - 1)])} disabled={index === 0} aria-label="A-"><span aria-hidden="true">A−</span></button>
      <span aria-hidden="true">Aa</span>
      <button type="button" onClick={() => onChange(FONT_SIZES[Math.min(FONT_SIZES.length - 1, index + 1)])} disabled={index === FONT_SIZES.length - 1} aria-label="A+"><span aria-hidden="true">A+</span></button>
    </div>
  );
}

export default function KnowledgePost() {
  const [location] = useLocation();
  const { lang, toPath, stripLang } = useLanguage();
  const slug = stripLang(location).split("/teknik-bilgiler/")[1] ?? "";
  const [data, setData] = useState<KnowledgePostRow | null | undefined>(undefined);
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem("knowledge-font-size") as FontSize) || "md");
  const [openSection, setOpenSection] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setData(undefined);
    setOpenSection(0);
    getPublishedKnowledgePostBySlug(slug).then((post) => { if (mounted) setData(post); }).catch(() => { if (mounted) setData(null); });
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => { localStorage.setItem("knowledge-font-size", fontSize); }, [fontSize]);

  useEffect(() => {
    if (!data) return;
    const article = localizeKnowledge(data, lang);
    const meta = getKnowledgeMeta(article);
    const canonicalUrl = `${SITE_URL}${toPath(`/teknik-bilgiler/${data.slug}`)}`;
    const imageUrl = data.coverImage || getKnowledgeCoverImage(article.category, article.title);
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
    schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: meta.description, image: imageUrl, datePublished: data.publishedAt, dateModified: data.updatedAt, mainEntityOfPage: canonicalUrl, author: { "@type": "Organization", name: "Perla Marine" }, publisher: { "@type": "Organization", name: "Perla Marine", url: SITE_URL } });
    document.head.appendChild(schema);
    return () => { schema.remove(); document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [data, lang]);

  if (data === undefined) return <div className="corporate-page"><div className="corporate-intro"><p>{lang === "en" ? "Loading technical note…" : "Teknik bilgi yükleniyor…"}</p></div></div>;
  if (!data) return <NotFound />;

  const article = localizeKnowledge(data, lang);
  const coverImage = data.coverImage || getKnowledgeCoverImage(article.category, article.title);
  const { intro, sections } = renderKnowledgeSections(article.body);
  const readingMinutes = estimateReadingMinutes(article.body);
  const t = {
    back: lang === "en" ? "Back to Technical Notes" : "Teknik Bilgiler’e dön",
    readingTime: lang === "en" ? "min read" : "dk okuma",
    note: lang === "en" ? "Technical note" : "Teknik not",
    archive: lang === "en" ? "Perla Marine maintenance archive" : "Perla Marine bakım arşivi",
    sections: lang === "en" ? "sections" : "bölüm",
    single: lang === "en" ? "Single piece" : "Tek parça",
    fontLabel: lang === "en" ? "Text size" : "Yazı boyutu",
    cta: lang === "en" ? "Discuss this scope" : "Bu kapsamı konuşun",
    permalink: lang === "en" ? "Copy permanent link" : "Kalıcı bağlantıyı kopyala",
    coverAlt: lang === "en" ? "cover image" : "kapak görseli",
  };

  return (
    <div className="corporate-page knowledge-post-page">
      <ReadingProgress />
      <article className="knowledge-post">
        <Link href={toPath("/teknik-bilgiler")} className="text-link text-link--dark"><ArrowLeft size={16} /> {t.back}</Link>
        <header className="knowledge-post__header">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="knowledge-post__excerpt">{article.excerpt}</p>
          <div className="knowledge-post__meta">
            <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", { dateStyle: "long" }) : t.note}</span>
            <span>·</span>
            <span><Clock size={12} aria-hidden="true" /> {readingMinutes} {t.readingTime}</span>
            <span>·</span>
            <span>{t.archive}</span>
          </div>
        </header>

        <img className="knowledge-post__cover" src={coverImage} alt={`${article.title} ${t.coverAlt}`} />

        <div className="knowledge-post__toolbar">
          <span className="knowledge-post__section-count">{sections.length > 0 ? `${sections.length} ${t.sections}` : t.single}</span>
          <FontSizeControl size={fontSize} onChange={setFontSize} label={t.fontLabel} />
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
          <Link href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(article.category)}`} className="button button--gold">{t.cta} <ArrowUpRight size={16} /></Link>
          <a href={toPath(`/teknik-bilgiler/${article.slug}`)} className="text-link text-link--dark">{t.permalink}</a>
        </footer>
      </article>
    </div>
  );
}
