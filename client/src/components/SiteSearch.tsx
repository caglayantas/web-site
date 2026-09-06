import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { getPublishedServices, getPublishedKnowledgePosts, getPublishedProjects, localizeService, localizeKnowledge, localizeProject } from "@/lib/content";
import { Search, X, Wrench, FileText, Image as ImageIcon } from "lucide-react";

type SearchItem = { type: "service" | "knowledge" | "project"; title: string; summary: string; path: string };

export default function SiteSearch() {
  const { lang, toPath } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || items !== null) return;
    Promise.all([getPublishedServices(), getPublishedKnowledgePosts(), getPublishedProjects()])
      .then(([services, posts, projects]) => {
        const combined: SearchItem[] = [
          ...services.map((row) => {
            const s = localizeService(row, lang);
            return { type: "service" as const, title: s.title, summary: s.description, path: `/hizmetler/${row.slug}` };
          }),
          ...posts.map((row) => {
            const k = localizeKnowledge(row, lang);
            return { type: "knowledge" as const, title: k.title, summary: k.excerpt, path: `/teknik-bilgiler/${row.slug}` };
          }),
          ...projects.map((row) => {
            const p = localizeProject(row, lang);
            return { type: "project" as const, title: p.title, summary: p.detail, path: `/projeler/${row.slug}` };
          }),
        ];
        setItems(combined);
      })
      .catch(() => setItems([]));
  }, [isOpen, items, lang]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLocaleLowerCase(lang === "en" ? "en" : "tr");
  const results = normalizedQuery.length < 2 || !items
    ? []
    : items
        .filter((item) => item.title.toLocaleLowerCase(lang === "en" ? "en" : "tr").includes(normalizedQuery) || item.summary.toLocaleLowerCase(lang === "en" ? "en" : "tr").includes(normalizedQuery))
        .slice(0, 8);

  const typeIcon = { service: Wrench, knowledge: FileText, project: ImageIcon };
  const typeLabel = lang === "en"
    ? { service: "Service", knowledge: "Technical Note", project: "Project" }
    : { service: "Hizmet", knowledge: "Teknik Bilgi", project: "Proje" };

  return (
    <>
      <button type="button" className="site-search__trigger" onClick={() => setIsOpen(true)} aria-label={lang === "en" ? "Search the site" : "Sitede ara"}>
        <Search size={18} />
      </button>
      {isOpen && (
        <div className="site-search__overlay" role="dialog" aria-modal="true" onClick={() => setIsOpen(false)}>
          <div className="site-search__panel" onClick={(event) => event.stopPropagation()}>
            <div className="site-search__input-row">
              <Search size={18} aria-hidden="true" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={lang === "en" ? "Search services, projects, technical notes…" : "Hizmet, proje, teknik bilgi ara…"}
              />
              <button type="button" onClick={() => setIsOpen(false)} aria-label={lang === "en" ? "Close" : "Kapat"}><X size={18} /></button>
            </div>
            <div className="site-search__results">
              {normalizedQuery.length >= 2 && items === null && <p className="site-search__hint">{lang === "en" ? "Loading…" : "Yükleniyor…"}</p>}
              {normalizedQuery.length >= 2 && items !== null && results.length === 0 && <p className="site-search__hint">{lang === "en" ? "No results found." : "Sonuç bulunamadı."}</p>}
              {normalizedQuery.length < 2 && <p className="site-search__hint">{lang === "en" ? "Type at least 2 characters to search." : "Aramak için en az 2 karakter yazın."}</p>}
              {results.map((item) => {
                const Icon = typeIcon[item.type];
                return (
                  <a key={item.path} href={toPath(item.path)} className="site-search__result" onClick={() => setIsOpen(false)}>
                    <Icon size={16} aria-hidden="true" />
                    <span className="site-search__result-copy">
                      <strong>{item.title}</strong>
                      <small>{typeLabel[item.type]}</small>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
