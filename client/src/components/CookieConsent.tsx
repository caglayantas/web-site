import { useEffect, useState } from "react";
import { Link } from "wouter";
import { loadAnalytics } from "@/lib/analytics";
import { useLanguage } from "@/lib/i18n";

export const COOKIE_CONSENT_KEY = "perla-cookie-consent";

export default function CookieConsent() {
  const { t, toPath } = useLanguage();
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
      <div className="cookie-consent cookie-consent--preferences" role="dialog" aria-label={t("cookie.prefsTitle")} aria-live="polite">
        <div className="cookie-consent__preferences-header">
          <strong>{t("cookie.prefsTitle")}</strong>
          <p>{t("cookie.prefsDesc")} <Link href={toPath("/cerez")}>{t("cookie.policyLink")}</Link>.</p>
        </div>
        <div className="cookie-consent__preference-row">
          <label>
            <input type="checkbox" checked disabled aria-label={t("cookie.necessary")} />
            <span>{t("cookie.necessary")}</span>
          </label>
          <small>{t("cookie.necessaryDesc")}</small>
        </div>
        <div className="cookie-consent__preference-row">
          <label>
            <input type="checkbox" checked={analyticsChecked} onChange={(event) => setAnalyticsChecked(event.target.checked)} />
            <span>{t("cookie.analytics")}</span>
          </label>
          <small>{t("cookie.analyticsDesc")}</small>
        </div>
        <div className="cookie-consent__actions">
          <button type="button" className="cookie-consent__reject" onClick={() => setShowPreferences(false)}>{t("cookie.back")}</button>
          <button type="button" className="cookie-consent__accept" onClick={savePreferences}>{t("cookie.savePrefs")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cookie-consent" role="dialog" aria-label={t("cookie.prefsTitle")} aria-live="polite">
      <p className="cookie-consent__copy">
        {t("cookie.text")} <Link href={toPath("/cerez")}>{t("cookie.policyLink")}</Link>.
      </p>
      <div className="cookie-consent__actions">
        <button type="button" className="cookie-consent__reject" onClick={reject}>{t("cookie.reject")}</button>
        <button type="button" className="cookie-consent__preferences" onClick={() => setShowPreferences(true)}>{t("cookie.preferences")}</button>
        <button type="button" className="cookie-consent__accept" onClick={accept}>{t("cookie.accept")}</button>
      </div>
    </div>
  );
}
