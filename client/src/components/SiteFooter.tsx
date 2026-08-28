import { ArrowUpRight, Instagram } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M16 2.7a13.3 13.3 0 0 0-11.4 20.1L3 29l6.4-1.6A13.3 13.3 0 1 0 16 2.7Zm0 24.2a10.8 10.8 0 0 1-5.5-1.5l-.4-.2-3.8.9 1-3.7-.3-.4A10.8 10.8 0 1 1 16 26.9Zm5.9-8.1c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.8 8.8 0 0 1-2.6-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.4 0-.6.2-.8l.5-.6c.2-.2.2-.4.3-.6 0-.2 0-.4-.1-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1a12.5 12.5 0 0 0 4.8 4.6c.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4Z" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__route" aria-hidden="true"><span /></div>
      <div className="site-footer__top">
        <div className="footer-brand">
          <img className="footer-brand__logo" src="/manus-storage/perla-marine-logo-236c7830_dc603e8f.webp" alt="Perla Marine" />
          <p>Denizde güven, detaylarda başlayan özenli bakım ve doğru uygulamayla büyür.</p>
        </div>

        <div className="footer-nav">
          <p className="footer-label">Keşfedin</p>
          <a href="/hakkimizda">Hakkımızda</a>
          <a href="/hizmetler">Hizmetler</a>
          <a href="/teknik-bilgiler">Teknik Bilgiler</a>
          <a href="/sss">SSS</a>
          <a href="/site-haritasi">Site haritası</a>
        </div>

        <div className="footer-nav">
          <p className="footer-label">İletişim</p>
          <a href="/iletisim">Bize ulaşın <ArrowUpRight size={14} /></a>
          <a href="tel:+905454353201">+90 545 435 32 01</a>
          <a href="mailto:info@perlamarine.com">info@perlamarine.com</a>
          <div className="footer-social-links" aria-label="Sosyal medya ve WhatsApp bağlantıları">
            <a className="footer-social-link footer-social-link--icon" href="https://www.instagram.com/perlamarine.tr/" target="_blank" rel="noreferrer" aria-label="Perla Marine Instagram hesabı">
              <Instagram size={25} aria-hidden="true" />
            </a>
            <a className="footer-social-link footer-social-link--icon footer-social-link--whatsapp" href="https://wa.me/905454353201" target="_blank" rel="noreferrer" aria-label="WhatsApp ile Perla Marine’e ulaşın" title="WhatsApp ile iletişime geçin">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Perla Marine. Tüm hakları saklıdır.</p>
        <div className="footer-legal-links" aria-label="Yasal bilgiler">
          <a href="/kvkk">KVKK / Aydınlatma</a>
          <a href="/gizlilik">Gizlilik</a>
          <a href="/cerez">Çerez politikası</a>
        </div>
      </div>
    </footer>
  );
}
