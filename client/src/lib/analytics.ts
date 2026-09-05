/**
 * Google Analytics (GA4) yükleyicisi.
 *
 * MEASUREMENT_ID boş/placeholder olduğu sürece hiçbir şey yüklenmez.
 * Gerçek Ölçüm Kimliğinizi (G-XXXXXXXXXX formatında, analytics.google.com
 * üzerinden alınır) aşağıya yapıştırın.
 *
 * Site bir SPA (tek sayfa uygulama) olduğu için, sayfa içi gezinmeler
 * tarayıcıyı yeniden yüklemez ve GA4'ün otomatik page_view olayını
 * tetiklemez. Bu yüzden ilk yüklemede otomatik page_view'i kapatıp
 * (send_page_view: false), her rota değişiminde trackPageview() ile
 * elle bir page_view gönderiyoruz — aksi halde Analytics yalnızca
 * ziyaretçinin indiği ilk sayfayı görür, sonraki tüm gezinmeleri kaçırır.
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
    gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true, send_page_view: false });
  `;
  document.head.appendChild(inline);

  // Send the pageview for whatever page the visitor was already on when
  // analytics finished loading (first load, or the moment consent was given).
  trackPageview(window.location.pathname + window.location.search);
}

export function isAnalyticsLoaded(): boolean {
  return alreadyLoaded;
}

/** Call this on every SPA route change so GA4 sees each page, not just the first. */
export function trackPageview(path: string): void {
  if (!alreadyLoaded) return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", "page_view", {
    page_path: path,
    page_title: document.title,
    page_location: window.location.href,
  });
}
