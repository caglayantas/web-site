import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadAnalytics } from "@/lib/analytics";

export const COOKIE_CONSENT_KEY = "perla-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(true);

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

  const savePreferences = () => {
    if (analyticsChecked) accept();
    else reject();
    setShowPreferences(false);
  };

  if (!visible) return null;

  if (showPreferences) {
    return (
      <div className="cookie-consent cookie-consent--preferences" role="dialog" aria-label="Çerez tercihleri" aria-live="polite">
        <div className="cookie-consent__preferences-header">
          <strong>Çerez tercihleri</strong>
          <p>Hangi çerez kategorilerine izin vereceğinizi seçin. Detaylar için <Link href="/cerez">Çerez Politikamızı</Link> inceleyebilirsiniz.</p>
        </div>
        <div className="cookie-consent__preference-row">
          <label>
            <input type="checkbox" checked disabled aria-label="Zorunlu çerezler, her zaman aktif" />
            <span>Zorunlu çerezler</span>
          </label>
          <small>Sitenin temel işlevleri için gereklidir, kapatılamaz.</small>
        </div>
        <div className="cookie-consent__preference-row">
          <label>
            <input type="checkbox" checked={analyticsChecked} onChange={(event) => setAnalyticsChecked(event.target.checked)} />
            <span>Analiz çerezleri</span>
          </label>
          <small>Ziyaretçi istatistiklerini anlamamıza yardımcı olur (Google Analytics).</small>
        </div>
        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__reject" onClick={() => setShowPreferences(false)}>Geri</button>
          <button type="button" className="cookie-consent__accept" onClick={savePreferences}>Tercihleri Kaydet</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cookie-consent" role="dialog" aria-label="Çerez tercihleri" aria-live="polite">
      <p className="cookie-consent__copy">
        Sitemizde temel işlevler için zorunlu çerezler ve, izniniz dahilinde, ziyaretçi istatistiklerini anlamamıza yardımcı olan analiz çerezleri kullanıyoruz. Detaylar için <Link href="/cerez">Çerez Politikamızı</Link> inceleyebilirsiniz.
      </p>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__reject" onClick={reject}>Reddet</button>
        <button type="button" className="cookie-consent__preferences" onClick={() => setShowPreferences(true)}>Tercihler</button>
        <button type="button" className="cookie-consent__accept" onClick={accept}>Kabul Et</button>
      </div>
    </div>
  );
}
