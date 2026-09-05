import React, { useEffect, useRef, useState } from "react";
import { getPublishedProjects } from "@/lib/content";
import { useLanguage } from "@/lib/i18n";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
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

type Project = {
  id: number | string;
  slug: string;
  label: string;
  title: string;
  detail: string;
  scope: string;
  systems: string;
  results: string;
  before: string;
  after: string;
  gallery: string[];
  labelEn?: string;
  titleEn?: string;
  detailEn?: string;
  scopeEn?: string;
  systemsEn?: string;
  resultsEn?: string;
};


const fallbackProjects: Project[] = [
  {
    id: 1,
    slug: "elektrik-enerji",
    label: "Elektrik ve enerji",
    title: "Akü ve güç dağıtım sistemi",
    detail:
      "Mevcut pano düzeninin okunabilirliği, bağlantı güvenliği ve servis erişimi için kontrol kapsamı.",
    scope:
      "Akü grubu, şarj hattı, ana dağıtım ve servis erişimi kontrol edildi.",
    systems:
      "Akü, şarj cihazı, BMS, sigorta ve güç dağıtım panosu.",
    results:
      "Bağlantı düzeni sadeleştirildi; bakım ve arıza tespiti için daha okunabilir bir altyapı hedeflendi.",
    before: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp",
    after: "/manus-storage/perla-service-marine-electronics_a9f3a57f_2b833740.webp",
    gallery: [],
  },

  {
    id: 2,
    slug: "motor-tahrik",
    label: "Motor ve tahrik",
    title: "Şaft ve pervane sistemi",
    detail:
      "Motor, şaft, kaplin ve pervane hattında bakım önceliklerini görünür kılan teknik değerlendirme.",
    scope:
      "Motor bağlantıları, şaft hattı, kaplin ve pervane çevresindeki erişim noktaları ele alındı.",
    systems:
      "İçten takma motor, şaft, kaplin, pervane ve dümen hattı.",
    results:
      "Tahrik hattındaki kontrol noktaları servis planına alınarak sonraki bakım adımları netleştirildi.",
    before: "/manus-storage/perla-service-propulsion_1dad9846.webp",
    after: "/manus-storage/perla-service-mechanical_1537487f.webp",
    gallery: [],
  },

  {
    id: 3,
    slug: "mekanik-sistemler",
    label: "Mekanik sistemler",
    title: "Yakıt ve sintine hatları",
    detail:
      "Pompa, vana, hortum ve erişim noktalarının servis planına alınması için sistem bazlı kontrol.",
    scope:
      "Pompa, vana, hortum, bağlantı ve sintine erişim noktaları kontrol kapsamına alındı.",
    systems:
      "Yakıt, sintine, deniz suyu, pompa ve vana hatları.",
    results:
      "Sızdırmazlık ve erişim öncelikleri görünür hale getirilerek planlı bakım akışına dönüştürüldü.",
    before: "/manus-storage/perla-service-mechanical_1537487f.webp",
    after: "/manus-storage/perla-service-electrical_bfa1b249_34b9f24d.webp",
    gallery: [],
  },
];

/* =========================================================
   FALLBACK KNOWLEDGE
========================================================= */


function ProjectLightbox({
  projects,
  activeIndex,
  onClose,
  onChange,
}: {
  projects: Project[];
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const { lang } = useLanguage();
  const project = projects[activeIndex];

  const [imageIndex, setImageIndex] =
    useState(0);

  useEffect(() => {
    setImageIndex(0);
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setImageIndex(
          (current) => (current + 1) % (2 + project.gallery.length)
        );
      }

      if (event.key === "ArrowLeft") {
        setImageIndex(
          (current) =>
            (current - 1 + 2 + project.gallery.length) % (2 + project.gallery.length)
        );
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        onKeyDown
      );
    };
  }, [onClose, project.gallery.length]);

  const images = [project.before, project.after, ...project.gallery];
  const image = images[imageIndex];
  const captionFor = (index: number) =>
    index === 0
      ? (lang === "en" ? "Before · current condition" : "Önce · mevcut durum")
      : index === 1
      ? (lang === "en" ? "After · targeted scope" : "Sonra · hedeflenen kapsam")
      : (lang === "en" ? `Additional photo ${index - 1}` : `Ek fotoğraf ${index - 1}`);

  return (
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} ${lang === "en" ? "image gallery" : "görsel galerisi"}`}
      onClick={onClose}
    >
      <div
        className="project-lightbox__panel"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="project-lightbox__top">
          <span>{project.label}</span>

          <button
            type="button"
            onClick={onClose}
            aria-label={lang === "en" ? "Close gallery" : "Galeriyi kapat"}
          >
            <X size={22} />
          </button>
        </div>

        <div className="project-lightbox__image-wrap">
          <button
            type="button"
            className="project-lightbox__nav project-lightbox__nav--left"
            onClick={() =>
              setImageIndex(
                (current) =>
                  (current - 1 + images.length) % images.length
              )
            }
            aria-label={lang === "en" ? "Previous image" : "Önceki görsel"}
          >
            <ArrowLeft size={22} />
          </button>

          <img
            src={image}
            alt={`${project.title} — ${captionFor(imageIndex)}`}
          />

          <button
            type="button"
            className="project-lightbox__nav project-lightbox__nav--right"
            onClick={() =>
              setImageIndex(
                (current) =>
                  (current + 1) % images.length
              )
            }
            aria-label={lang === "en" ? "Next image" : "Sonraki görsel"}
          >
            <ArrowRight size={22} />
          </button>
        </div>

        <div className="project-lightbox__caption">
          <div>
            <strong>
              {project.title}
            </strong>

            <span>
              {captionFor(imageIndex)}
              {images.length > 2 ? ` · ${imageIndex + 1}/${images.length}` : ""}
            </span>
          </div>

          <div className="project-lightbox__project-switcher">
            {projects.map(
              (item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    index === activeIndex
                      ? "is-active"
                      : ""
                  }
                  onClick={() =>
                    onChange(index)
                  }
                  aria-label={lang === "en" ? `Open ${item.title} gallery` : `${item.title} galerisini aç`}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROJECTS
========================================================= */


export default function ProjectsNew() {
  const { lang, toPath } = useLanguage();
  usePageMetadata(
    "/projeler",
    "Projeler | Perla Marine Saha Bakım ve Refit Çalışmaları",
    "Perla Marine’in tekne ve yat bakım, refit, elektrik, mekanik ve tahrik sistemleri saha çalışmalarını inceleyin.",
    "Projects | Perla Marine Field Maintenance & Refit Work",
    "Explore Perla Marine's field work on boat and yacht maintenance, refit, electrical, mechanical, and propulsion systems."
  );

  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const [projects, setProjects] =
    useState<Project[]>(
      fallbackProjects
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const data = await getPublishedProjects();
        if (!data.length) return;

        if (mounted) {
          const mapped: Project[] = data.map((project) => ({
            id: project.id,
            slug: project.slug ?? `project-${project.id}`,
            label: project.label ?? "",
            title: project.title ?? "",
            detail: project.detail ?? "",
            scope: project.scope ?? "",
            systems: project.systems ?? "",
            results: project.results ?? "",
            before: project.beforeImage ?? "",
            after: project.afterImage ?? "",
            gallery: Array.isArray(project.galleryImages) ? project.galleryImages : [],
            labelEn: project.labelEn ?? "",
            titleEn: project.titleEn ?? "",
            detailEn: project.detailEn ?? "",
            scopeEn: project.scopeEn ?? "",
            systemsEn: project.systemsEn ?? "",
            resultsEn: project.resultsEn ?? "",
          }));

          setProjects(mapped);
        }
      } catch (error) {
        console.error(
          "[Projects] Failed:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const displayProjects = lang === "en" ? projects.map((p) => ({
    ...p,
    label: p.labelEn || p.label,
    title: p.titleEn || p.title,
    detail: p.detailEn || p.detail,
    scope: p.scopeEn || p.scope,
    systems: p.systemsEn || p.systems,
    results: p.resultsEn || p.results,
  })) : projects;

  return (
    <PageFrame>
      <CorporateHero data={usePageData().projects} />

      <section className="corporate-section">
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">
              {lang === "en" ? "Field work" : "Saha çalışmaları"}
            </p>

            <h2>
              {lang === "en" ? <>See the current condition first,<br /><em>then the target.</em></> : <>Önce mevcut durumu,<br /><em>sonra hedefi görün.</em></>}
            </h2>
          </div>

          <p>
            {lang === "en"
              ? "We assess maintenance and refit scope system by system, making the process visible from the current condition to the next actionable step."
              : "Bakım ve refit kapsamını sistem bazında değerlendiriyor, mevcut durumdan sonraki uygulanabilir adıma kadar süreci görünür hale getiriyoruz."}
          </p>
        </div>

        {loading &&
          projects.length === 0 && (
            <p>{lang === "en" ? "Loading projects..." : "Projeler yükleniyor..."}</p>
          )}

        <div className="project-detail-grid">
          {displayProjects.map(
            (project, index) => (
              <article
                id={project.slug}
                className="project-detail-card"
                key={project.id}
              >
                <div className="project-comparison project-comparison--slider">
                  <BeforeAfterSlider
                    before={
                      project.before
                    }
                    after={
                      project.after
                    }
                    beforeAlt={`${project.title} ${lang === "en" ? "before · current condition" : "önce · mevcut durum"}`}
                    afterAlt={`${project.title} ${lang === "en" ? "after · target scope" : "sonra · hedeflenen kapsam"}`}
                    label={project.title}
                  />

                  <button
                    type="button"
                    className="project-comparison__lightbox-link"
                    onClick={() =>
                      setActiveIndex(
                        index
                      )
                    }
                    aria-label={lang === "en" ? `Enlarge ${project.title} images` : `${project.title} görsellerini büyüt`}
                  >
                    {lang === "en" ? "Enlarge images" : "Görselleri büyüt"}
                    <ChevronRight
                      size={13}
                    />
                  </button>

                  {project.gallery.length > 0 && (
                    <div className="project-comparison__thumb-strip">
                      {project.gallery.slice(0, 3).map((url: string, photoIndex: number) => (
                        <button
                          type="button"
                          key={url}
                          className="project-comparison__thumb"
                          onClick={() =>
                            setActiveIndex(
                              index
                            )
                          }
                          aria-label={lang === "en" ? `Enlarge photo ${photoIndex + 1} for ${project.title}` : `${project.title} için ${photoIndex + 1}. ek fotoğrafı büyüt`}
                        >
                          <img src={url} alt="" loading="lazy" decoding="async" />
                        </button>
                      ))}
                      <button
                        type="button"
                        className="project-comparison__thumb-all"
                        onClick={() =>
                          setActiveIndex(
                            index
                          )
                        }
                        aria-label={lang === "en" ? `View all photos for ${project.title}` : `${project.title} için tüm fotoğrafları görüntüle`}
                      >
                        <ImageIcon size={13} />
                        {lang === "en" ? "All photos" : "Tüm fotoğraflar"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="project-detail-card__copy">
                  <span>
                    {project.label}
                  </span>

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.detail}
                  </p>

                  <div className="project-detail-card__facts">
                    <div>
                      <strong>
                        {lang === "en" ? "Scope" : "Kapsam"}
                      </strong>

                      <p>
                        {project.scope}
                      </p>
                    </div>

                    <div>
                      <strong>
                        {lang === "en" ? "Systems Used" : "Kullanılan sistemler"}
                      </strong>

                      <p>
                        {project.systems}
                      </p>
                    </div>

                    <div>
                      <strong>
                        {lang === "en" ? "Maintenance Result" : "Bakım sonucu"}
                      </strong>

                      <p>
                        {project.results}
                      </p>
                    </div>
                  </div>

                  <a href={`${toPath("/iletisim")}?kategori=${encodeURIComponent(project.label)}`}>
                    <strong>
                      {lang === "en" ? "Discuss this scope" : "Bu kapsamı konuşun"}
                      <ArrowUpRight
                        size={15}
                      />
                    </strong>
                  </a>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {activeIndex !== null && (
        <ProjectLightbox
          projects={displayProjects}
          activeIndex={
            activeIndex
          }
          onClose={() =>
            setActiveIndex(null)
          }
          onChange={
            setActiveIndex
          }
        />
      )}
    </PageFrame>
  );
}

/* =========================================================
   KNOWLEDGE
========================================================= */


