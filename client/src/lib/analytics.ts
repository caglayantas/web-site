/**
 * Google Analytics (GA4) yükleyicisi.
 *
 * MEASUREMENT_ID boş/placeholder olduğu sürece hiçbir şey yüklenmez.
 * Gerçek Ölçüm Kimliğinizi (G-XXXXXXXXXX formatında, analytics.google.com
 * üzerinden alınır) aşağıya yapıştırın.
 */
const MEASUREMENT_ID: string = "G-M4QSKD02EG";

export function isAnalyticsConfigured(): boolean {
  return /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) && MEASUREMENT_ID !== "G-XXXXXXXXXX";
}

let alreadyLoaded = false;

export function loadAnalytics(): void {
  if (alreadyLoaded || !isAnalyticsConfigured()) return;
  alreadyLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  const inline = document.createElement("script");
  inline.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });
  `;
  document.head.appendChild(inline);
}
