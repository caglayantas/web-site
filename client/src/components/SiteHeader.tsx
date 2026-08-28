import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16 2.7a13.3 13.3 0 0 0-11.4 20.1L3 29l6.4-1.6A13.3 13.3 0 1 0 16 2.7Zm0 24.2a10.8 10.8 0 0 1-5.5-1.5l-.4-.2-3.8.9 1-3.7-.3-.4A10.8 10.8 0 1 1 16 26.9Zm5.9-8.1c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-2.6-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1a12.5 12.5 0 0 0 4.8 4.6c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4Z" />
    </svg>
  );
}

const navigation = [
  { href: "/", label: "Ana Sayfa", path: "/" },
  { href: "/hakkimizda", label: "Hakkımızda", path: "/hakkimizda" },
  { href: "/hizmetler", label: "Hizmetler", path: "/hizmetler" },
  { href: "/projeler", label: "Projeler", path: "/projeler" },
  { href: "/teknik-bilgiler", label: "Teknik Bilgiler", path: "/teknik-bilgiler" },
];

export default function SiteHeader() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const hasOpenedMenu = useRef(false);

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
        <a className="brand-lockup" href="/" aria-label="Perla Marine ana sayfa">
          <img
            className="brand-lockup__logo"
            src="/manus-storage/perla-marine-logo-real-transparent_d043978f.png"
            alt="Perla Marine"
          />
        </a>

        <nav className="desktop-nav" aria-label="Ana navigasyon">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={location === item.path || (item.path !== "/" && location.startsWith(`${item.path}/`)) ? "is-active" : ""}>
              {item.label}
            </a>
          ))}
          <div className="nav-contact-actions">
            <a className="nav-contact" href="/iletisim">
              Bize ulaşın <span aria-hidden="true">↗</span>
            </a>
            <a className="nav-whatsapp" href="https://wa.me/905454353201" target="_blank" rel="noreferrer" aria-label="WhatsApp ile Perla Marine’e ulaşın" title="WhatsApp ile iletişime geçin">
              <WhatsAppIcon />
            </a>
          </div>
        </nav>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          type="button"
          aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X size={21} /> : <Menu size={23} />}
        </button>

        {isOpen && (
          <nav ref={mobileNavRef} id="mobile-navigation" className="mobile-nav" aria-label="Mobil navigasyon">
            <p className="mobile-nav__intro">Tekneniz için doğru bakım ve teknik servis adımını birlikte netleştirelim.</p>
            {navigation.map((item, index) => (
              <a
                key={item.href}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mobile-nav__actions">
              <a className="mobile-nav__contact" href="/iletisim" onClick={() => setIsOpen(false)}>
                Bize ulaşın <span aria-hidden="true">↗</span>
              </a>
              <a className="mobile-nav__social" href="https://wa.me/905454353201" target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} aria-label="WhatsApp ile Perla Marine’e ulaşın">
                <WhatsAppIcon /> WhatsApp
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
