const SITE_URL = "https://perlamarine.com";

/**
 * Creates the reciprocal hreflang <link> tags for the current page's TR/EN
 * pair (plus an x-default pointing at the Turkish version), so Google knows
 * these are language variants of the same content rather than duplicate or
 * unrelated pages.
 *
 * `trPath` must be the canonical Turkish path, e.g. "/hakkimizda" or
 * "/projeler/some-slug" — never the English (/en/...) variant, regardless of
 * which language the visitor currently has selected.
 *
 * Since this is a client-side-routed SPA, any hreflang tags from the
 * previous page are removed first so they don't linger across navigation.
 */
export function updateHreflangTags(trPath: string) {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());

  const enPath = trPath === "/" ? "/en" : `/en${trPath}`;
  const trUrl = `${SITE_URL}${trPath}`;
  const enUrl = `${SITE_URL}${enPath}`;

  const entries: [string, string][] = [
    ["tr", trUrl],
    ["en", enUrl],
    ["x-default", trUrl],
  ];

  entries.forEach(([hreflang, href]) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.setAttribute("hreflang", hreflang);
    link.href = href;
    document.head.appendChild(link);
  });
}
