import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadAnalytics } from "@/lib/analytics";

export const COOKIE_CONSENT_KEY = "perla-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === "accepted") {
      loadAnalytics();
    } else if (stored !== "rejected") {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    loadAnalytics();
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-label="Çerez tercihleri" aria-live="polite">
      <p className="cookie-consent__copy">
        Sitemizde temel işlevler için zorunlu çerezler ve, izniniz dahilinde, ziyaretçi istatistiklerini anlamamıza yardımcı olan analiz çerezleri kullanıyoruz. Detaylar için <Link href="/cerez">Çerez Politikamızı</Link> inceleyebilirsiniz.
      </p>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__reject" onClick={reject}>Sadece Zorunlu</button>
        <button type="button" className="cookie-consent__accept" onClick={accept}>Kabul Et</button>
      </div>
    </div>
  );
}
