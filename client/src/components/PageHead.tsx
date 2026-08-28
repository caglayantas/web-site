import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.perlamarine.com";
const DEFAULT_IMAGE = `${SITE_URL}/manus-storage/perla-hero-medium-yacht-service_7ccec84c_3e23263b.webp`;

type Metadata = { title: string; description: string; path: string; image?: string };

const metadata: Record<string, Metadata> = {
  "/": { title: "Perla Marine | Tekne ve Yat Bakım-Onarım", description: "Perla Marine, tekne ve yatlar için bakım-onarım, marin elektrik, kompozit, motor-tahrik, dümen ve mekanik tesisat çözümleri sunar.", path: "/" },
  "/hakkimizda": { title: "Hakkımızda | Perla Marine Kurumsal Tekne Bakım ve Teknik Servis", description: "Perla Marine’in kurumsal kimliğini, denizcilik bakım-onarım vizyonunu ve teknik servis çalışma standardını keşfedin.", path: "/hakkimizda" },
  "/hizmetler": { title: "Hizmetler | Perla Marine Tekne ve Yat Bakım-Onarım", description: "Kompozit, marin elektrik, elektronik, mekanik tesisat, motor-tahrik-dümen ve tekneye özel bakım çözümlerini inceleyin.", path: "/hizmetler" },
  "/projeler": { title: "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları", description: "Perla Marine’in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin.", path: "/projeler" },
  "/teknik-bilgiler": { title: "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri", description: "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberleri.", path: "/teknik-bilgiler" },
  "/iletisim": { title: "İletişim | Perla Marine Tekne Teknik Check-up ve Servis", description: "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın.", path: "/iletisim" },
  "/sss": { title: "SSS | Perla Marine Tekne Bakım ve Teknik Servis", description: "Perla Marine tekne bakım-onarım ve teknik servis hizmetleri hakkında sık sorulan sorular.", path: "/sss" },
};

function resolveMetadata(location: string): Metadata {
  const path = location.split("?")[0].replace(/\/$/, "") || "/";
  if (metadata[path]) return metadata[path];
  if (path.startsWith("/projeler/")) return { ...metadata["/projeler"], path };
  if (path.startsWith("/teknik-bilgiler/")) return { ...metadata["/teknik-bilgiler"], path };
  return { ...metadata["/"], path: "/" };
}

export default function PageHead({ location }: { location: string }) {
  const page = resolveMetadata(location);
  const canonical = `${SITE_URL}${page.path}`;
  const image = page.image ?? DEFAULT_IMAGE;
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: canonical,
    name: page.title,
    description: page.description,
    inLanguage: "tr-TR",
    isPartOf: { "@type": "WebSite", url: `${SITE_URL}/`, name: "Perla Marine" },
  };
  return <Helmet>
    <title>{page.title}</title>
    <meta name="description" content={page.description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="tr_TR" />
    <meta property="og:site_name" content="Perla Marine" />
    <meta property="og:title" content={page.title} />
    <meta property="og:description" content={page.description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content="Perla Marine tekne bakım ve teknik servis çalışması" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={page.title} />
    <meta name="twitter:description" content={page.description} />
    <meta name="twitter:image" content={image} />
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </Helmet>;
}
