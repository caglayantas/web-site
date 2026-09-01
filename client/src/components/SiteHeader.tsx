import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { getListingsEnabled } from "@/lib/content";
import { useLanguage, type TKey } from "@/lib/i18n";

function FlagTR() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#e30a17" />
      <circle cx="12" cy="10" r="5.2" fill="#fff" />
      <circle cx="13.3" cy="10" r="4.2" fill="#e30a17" />
      <path fill="#fff" d="m18.5 6.7 1 3.05h3.2l-2.6 1.9 1 3.05-2.6-1.9-2.6 1.9 1-3.05-2.6-1.9h3.2z" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false">
      <rect width="30" height="20" fill="#012169" />
      <path stroke="#fff" strokeWidth="4" d="M0 0 30 20M30 0 0 20" />
      <path stroke="#c8102e" strokeWidth="2" d="M0 0 30 20M30 0 0 20" />
      <path stroke="#fff" strokeWidth="6.5" d="M15 0V20M0 10H30" />
      <path stroke="#c8102e" strokeWidth="4" d="M15 0V20M0 10H30" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16 2.7a13.3 13.3 0 0 0-11.4 20.1L3 29l6.4-1.6A13.3 13.3 0 1 0 16 2.7Zm0 24.2a10.8 10.8 0 0 1-5.5-1.5l-.4-.2-3.8.9 1-3.7-.3-.4A10.8 10.8 0 1 1 16 26.9Zm5.9-8.1c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-2.6-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1a12.5 12.5 0 0 0 4.8 4.6c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4Z" />
    </svg>
  );
}

const navItems: { key: TKey; path: string }[] = [
  { key: "nav.home", path: "/" },
  { key: "nav.about", path: "/hakkimizda" },
  { key: "nav.services", path: "/hizmetler" },
  { key: "nav.regions", path: "/hizmet-bolgelerimiz" },
  { key: "nav.projects", path: "/projeler" },
  { key: "nav.knowledge", path: "/teknik-bilgiler" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const { lang, t, toPath, stripLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [listingsEnabled, setListingsEnabled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const hasOpenedMenu = useRef(false);

  useEffect(() => {
    getListingsEnabled().then(setListingsEnabled).catch(() => setListingsEnabled(false));
  }, []);

  const activeNavigation = listingsEnabled
    ? [...navItems, { key: "nav.listings" as TKey, path: "/ilanlar" }]
    : navItems;

  const currentPath = stripLang(location);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 18);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    if (isOpen) {
      hasOpenedMenu.current = true;
      firstMenuLinkRef.current?.focus();
      return;
    }
    if (hasOpenedMenu.current) menuButtonRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(mobileNavRef.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen]);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="site-header__inner">
        <a className="brand-lockup" href={toPath("/")} aria-label="Perla Marine">
          <img
            className="brand-lockup__logo"
            src="/manus-storage/perla-marine-logo-real-transparent_d043978f.png"
            alt="Perla Marine"
          />
        </a>

        <nav className="desktop-nav" aria-label={lang === "tr" ? "Ana navigasyon" : "Main navigation"}>
          {activeNavigation.map((item) => (
            <a key={item.path} href={toPath(item.path)} className={currentPath === item.path || (item.path !== "/" && currentPath.startsWith(`${item.path}/`)) ? "is-active" : ""}>
              {t(item.key)}
            </a>
          ))}
          <div className="nav-contact-actions">
            <a className="nav-contact" href={toPath("/iletisim")}>
              {t("nav.contact")} <span aria-hidden="true">↗</span>
            </a>
            <a className="nav-whatsapp" href="https://wa.me/905454353201" target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a className="nav-lang-switch" href={lang === "tr" ? `/en${currentPath === "/" ? "" : currentPath}` : currentPath} aria-label={lang === "tr" ? "Switch to English" : "Türkçe'ye geç"}>
              <span className="nav-lang-switch__flag" aria-hidden="true">{lang === "tr" ? <FlagGB /> : <FlagTR />}</span>
            </a>
          </div>
        </nav>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? (lang === "tr" ? "Menüyü kapat" : "Close menu") : (lang === "tr" ? "Menüyü aç" : "Open menu")}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={21} /> : <Menu size={23} />}
        </button>

        {isOpen && (
          <nav ref={mobileNavRef} id="mobile-navigation" className="mobile-nav" aria-label={lang === "tr" ? "Mobil navigasyon" : "Mobile navigation"}>
            <p className="mobile-nav__intro">{lang === "tr" ? "Tekneniz için doğru bakım ve teknik servis adımını birlikte netleştirelim." : "Let's work out the right maintenance and service step for your boat together."}</p>
            {activeNavigation.map((item, index) => (
              <a
                key={item.path}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={toPath(item.path)}
                onClick={() => setIsOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
            <a href={lang === "tr" ? `/en${currentPath === "/" ? "" : currentPath}` : (currentPath === "/" ? "/" : currentPath)} onClick={() => setIsOpen(false)} className="mobile-nav__lang">
              <span className="mobile-nav__lang-flag" aria-hidden="true">{lang === "tr" ? <FlagGB /> : <FlagTR />}</span> {lang === "tr" ? "English" : "Türkçe"}
            </a>
            <div className="mobile-nav__actions">
              <a className="mobile-nav__contact" href={toPath("/iletisim")} onClick={() => setIsOpen(false)}>
                {t("nav.contact")} <span aria-hidden="true">↗</span>
              </a>
              <a className="mobile-nav__social" href="https://wa.me/905454353201" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} aria-label="WhatsApp">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
