import React, { useEffect, useState } from "react";
import { getPublishedKnowledgePosts } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Check,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Factory,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Settings2,
  Wrench,
  X,
} from "lucide-react";

import { usePageData, usePageMetadata, PageFrame, CorporateHero } from "./pageShared";

type KnowledgePost = {
  id: number | string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  publishedAt: string | null;
  categoryEn?: string;
  titleEn?: string;
  excerptEn?: string;
  bodyEn?: string;
};


const fallbackKnowledge: KnowledgePost[] = [
  {
    id: 1,
    slug: "tekne-marin-elektrik-sistemleri-ve-lityum-aku-bms-bakimi",
    category: "Marin elektrik ve enerji sistemleri",
    title:
      "Tekne marin elektrik sistemleri ve lityum akü BMS bakımı",
    excerpt:
      "Akü, şarj, güç dağıtımı ve BMS katmanlarını birlikte değerlendiren pratik bakım çerçevesi.",
    body:
      "Akü, şarj ve BMS sistemlerinin birlikte değerlendirilmesi; güvenli ve sürdürülebilir bir marin enerji altyapısı için temel adımdır.",
    coverImage:
      "/manus-storage/perla-service-marine-electronics-1600_858e312b.webp",
    publishedAt: null,
  },

  {
    id: 2,
    slug: "tekne-motor-saft-pervane-ve-dumen-sistemi-bakim-kontrolu",
    category: "Motor, tahrik ve dümen sistemleri",
    title:
      "Tekne motor, şaft, pervane ve dümen sistemi bakım kontrolü",
    excerpt:
      "Titreşim, ses, boşluk ve bağlantı değişimlerini erken fark etmek için sistem bazlı kontrol notları.",
    body:
      "Motor ve tahrik sistemlerinde titreşim, bağlantı, şaft, kaplin ve pervane kontrolleri bakım planının önemli parçalarıdır.",
    coverImage:
      "/manus-storage/perla-service-propulsion-v2-1600_5ff2ef59.webp",
    publishedAt: null,
  },

  {
    id: 3,
    slug: "tekne-mekanik-tesisat-bakiminda-pompa-vana-ve-hortum-kontrolu",
    category: "Mekanik tesisat ve tekne bakım",
    title:
      "Tekne mekanik tesisat bakımında pompa, vana ve hortum kontrolü",
    excerpt:
      "Sızdırmazlık, akış, erişim ve sintine güvenliği için uygulanabilir bakım adımları.",
    body:
      "Mekanik tesisatlarda sızdırmazlık, hortum bağlantıları, pompalar, vanalar ve servis erişimi düzenli olarak kontrol edilmelidir.",
    coverImage:
      "/manus-storage/perla-service-mechanical-v2-1600_b2b0c9ef.webp",
    publishedAt: null,
  },
];

/* =========================================================
   PAGE HERO
========================================================= */


function makeSlug(
  value: string
) {
  return value
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderKnowledgeBody(
  body: string
) {
  return body
    .split(/\n+/)
    .map((paragraph) => {
      const text =
        paragraph
          .replace(/^#+\s*/, "")
          .replace(/^>\s*/, "")
          .trim();

      if (!text) {
        return "";
      }

      return `<p>${text}</p>`;
    })
    .join("");
}


export default function KnowledgeNew() {
  const { lang, toPath } = useLanguage();
  usePageMetadata(
    "/teknik-bilgiler",
    "Teknik Bilgiler | Perla Marine Bakım ve Servis Rehberleri",
    "Tekne sahipleri ve üretici ekipleri için marin elektrik, motor-tahrik ve mekanik tesisat bakım rehberlerini okuyun.",
    "Technical Notes | Perla Marine Maintenance & Service Guides",
    "Read maintenance guides on marine electrical, propulsion, and mechanical systems for boat owners and manufacturer teams."
  );

  const [posts, setPosts] =
    useState<KnowledgePost[]>(
      fallbackKnowledge
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        const data = await getPublishedKnowledgePosts();
        if (!data.length) return;

        if (mounted) {
          const mapped: KnowledgePost[] = data.map((post) => ({
            id: post.id,
            slug: post.slug || makeSlug(post.title),
            category: post.category || "Teknik bilgi",
            title: post.title || "",
            excerpt: post.excerpt || "",
            body: post.body || "",
            coverImage: post.coverImage || null,
            publishedAt: post.publishedAt || null,
            categoryEn: post.categoryEn ?? "",
            titleEn: post.titleEn ?? "",
            excerptEn: post.excerptEn ?? "",
            bodyEn: post.bodyEn ?? "",
          }));

          setPosts(mapped);
        }
      } catch (error) {
        console.error(
          "[Knowledge] Failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const displayPosts = lang === "en" ? posts.map((p) => ({
    ...p,
    category: p.categoryEn || p.category,
    title: p.titleEn || p.title,
    excerpt: p.excerptEn || p.excerpt,
    body: p.bodyEn || p.body,
  })) : posts;

  return (
    <PageFrame>
      <CorporateHero
        data={usePageData().knowledge}
      />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              {lang === "en" ? "Maintenance Notes" : "Bakım notları"}
            </p>

            <h2>
              {lang === "en" ? <>Short, clear guides<br /><em>for technical decisions.</em></> : <>Teknik kararlar için<br /><em>kısa ve net rehberler.</em></>}
            </h2>
          </div>

          <p>
            {lang === "en"
              ? "Technical Notes is a simple content archive made up of technical articles that support maintenance decisions."
              : "Teknik Bilgiler; bakım kararlarını destekleyen teknik yazılardan oluşan sade bir içerik arşividir."}
          </p>
        </div>

        {loading &&
          posts.length === 0 && (
            <p>
              {lang === "en" ? "Loading technical notes..." : "Teknik bilgiler yükleniyor..."}
            </p>
          )}

        <div className="knowledge-grid">
          {displayPosts.map((post) => (
            <article
              className="knowledge-card"
              id={post.slug}
              key={post.id}
            >
              {post.coverImage && (
                <img
                  className="knowledge-card__cover"
                  src={
                    post.coverImage
                  }
                  alt={`${post.title} ${lang === "en" ? "cover image" : "kapak görseli"}`}
                  loading="lazy"
                />
              )}

              <span>
                {post.category}
              </span>

              <h3>
                {post.title}
              </h3>

              <p>
                {post.excerpt}
              </p>

              <div className="knowledge-card__actions">
                <a
                  href={toPath(`/teknik-bilgiler/${post.slug}`)}
                  className="text-link text-link--dark"
                >
                  {lang === "en" ? "Read article" : "Yazıyı aç"}
                  <ArrowUpRight
                    size={15}
                  />
                </a>

                {post.publishedAt && (
                  <small>
                    {new Date(
                      post.publishedAt
                    ).toLocaleDateString(
                      lang === "en" ? "en-US" : "tr-TR"
                    )}
                  </small>
                )}
              </div>

              <details className="knowledge-card__details">
                <summary>
                  {lang === "en" ? "Quick preview" : "Kısa önizleme"}
                </summary>

                <div
                  className="knowledge-card__body"
                  dangerouslySetInnerHTML={{
                    __html:
                      renderKnowledgeBody(
                        post.body
                      ),
                  }}
                />
              </details>
            </article>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}

/* =========================================================
   CONTACT FORM
========================================================= */


