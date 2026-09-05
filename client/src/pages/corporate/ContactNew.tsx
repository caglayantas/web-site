import React, { useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { getPublishedServices, getPublishedRegions } from "@/lib/content";
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

type FormState = {
  name: string;
  email: string;
  service: string;
  region: string;
  message: string;
};

export type CorporateContactErrors = Partial<FormState> & {
  consent?: string;
};

/* =========================================================
   PAGE DATA
========================================================= */


const FALLBACK_SERVICE_OPTIONS: { value: string; label: string }[] = [
  { value: "Kompozit çözümler", label: "Kompozit çözümler" },
  { value: "Marin elektrik", label: "Marin elektrik" },
  { value: "Marin elektroniği", label: "Marin elektroniği" },
  { value: "Isıtma-soğutma", label: "Isıtma-soğutma" },
  { value: "Mekanik tesisat", label: "Mekanik tesisat" },
  { value: "Motor, tahrik ve dümen", label: "Motor, tahrik ve dümen" },
  { value: "Yelken ve arma donanım", label: "Yelken ve arma donanım" },
  { value: "Güverte ekipmanları", label: "Güverte ekipmanları" },
  { value: "Üretim danışmanlığı", label: "Üretim danışmanlığı" },
  { value: "Tekneye özel çözümler", label: "Tekneye özel çözümler" },
  { value: "Yat transferi", label: "Yat transferi" },
];

// Lead-generation categories that aren't published service pages of their own,
// always appended after the live services list.
const EXTRA_SERVICE_OPTIONS: { tr: string; en: string }[] = [
  { tr: "Teknik checkup", en: "Technical checkup" },
  { tr: "Survey / Ekspertiz", en: "Survey / Expertise" },
];

/* =========================================================
   FALLBACK PROJECT DATA
========================================================= */


const formFields = [
  "name",
  "email",
  "service",
  "message",
] as const;

const emptyForm: FormState = {
  name: "",
  email: "",
  service: "",
  region: "",
  message: "",
};

// Shown briefly while the live region list loads, and as a safety net if the
// fetch fails. Kept in sync with the actual "regions" table naming.

const FALLBACK_REGION_OPTIONS: { value: string; label: string }[] = [
  { value: "İzmir", label: "İzmir" },
  { value: "Muğla (Bodrum, Marmaris, Fethiye, Göcek, Datça)", label: "Muğla (Bodrum, Marmaris, Fethiye, Göcek, Datça)" },
  { value: "Aydın (Kuşadası, Didim)", label: "Aydın (Kuşadası, Didim)" },
  { value: "Antalya (Kemer, Kaş, Finike, Alanya)", label: "Antalya (Kemer, Kaş, Finike, Alanya)" },
  { value: "Marmara Bölgesi (İstanbul, Yalova, Bursa, Balıkesir)", label: "Marmara Bölgesi (İstanbul, Yalova, Bursa, Balıkesir)" },
  { value: "Diğer Bölgeler / Türkiye Geneli", label: "Diğer Bölgeler / Türkiye Geneli" },
];


export function validateCorporateContact(
  values: FormState,
  consent: boolean
): CorporateContactErrors {
  const next: CorporateContactErrors =
    {};

  if (!values.name.trim()) {
    next.name =
      "Ad soyad alanını doldurun.";
  }

  if (
    !/^\S+@\S+\.\S+$/.test(
      values.email.trim()
    )
  ) {
    next.email =
      "Geçerli bir e-posta adresi yazın.";
  }

  if (!values.service) {
    next.service =
      "Bir ihtiyaç kategorisi seçin.";
  }

  if (!values.message.trim()) {
    next.message =
      "Mevcut durumu ve hedefinizi paylaşın.";
  }

  /*
   * KVKK checkbox'ını form tarafında
   * zorunlu tutuyoruz.
   *
   * Ancak Supabase tablosunda consent
   * kolonu olmadığı için DB'ye göndermiyoruz.
   */
  if (!consent) {
    next.consent =
      "Aydınlatma onayını işaretleyin.";
  }

  return next;
}

/* =========================================================
   CONTACT
========================================================= */


export default function ContactNew() {
  const { t, lang } = useLanguage();
  usePageMetadata(
    "/iletisim",
    "İletişim | Perla Marine Tekne Teknik Check-up ve Servis",
    "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın; uygulanabilir sonraki adımı birlikte planlayalım.",
    "Contact | Perla Marine Boat Technical Checkup and Service",
    "Tell Perla Marine about your boat's maintenance, repair, electrical, mechanical, or propulsion needs; let's plan the next step together."
  );

  const [values, setValues] =
    useState<FormState>(
      emptyForm
    );

  // A second, lightweight spam signal alongside the honeypot field: real
  // visitors take at least a couple of seconds to read the form and fill it
  // in, while simple bots submit almost instantly after the page loads.
  const formMountedAtRef = useRef(Date.now());

  // Category and region options are fetched live from the same services/regions
  // tables the rest of the site uses, so a newly added service or region always
  // shows up here automatically instead of drifting out of sync with a
  // hand-maintained list.
  const [serviceOptions, setServiceOptions] = useState<{ value: string; label: string }[]>(FALLBACK_SERVICE_OPTIONS);
  const [regionOptions, setRegionOptions] = useState<{ value: string; label: string }[]>(FALLBACK_REGION_OPTIONS);

  useEffect(() => {
    getPublishedServices()
      .then((rows) => {
        const options = rows.map((row) => ({ value: row.title, label: lang === "en" ? (row.titleEn || row.title) : row.title }));
        setServiceOptions([...options, ...EXTRA_SERVICE_OPTIONS.map((o) => ({ value: o.tr, label: lang === "en" ? o.en : o.tr }))]);
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    getPublishedRegions()
      .then((rows) => {
        setRegionOptions(rows.map((row) => ({ value: row.name, label: lang === "en" ? (row.nameEn || row.name) : row.name })));
      })
      .catch(() => {});
  }, [lang]);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("kategori");
    if (!requested) return;
    setValues((current) => ({ ...current, service: requested }));
  }, []);

  const [consent, setConsent] =
    useState(false);

  const [errors, setErrors] =
    useState<CorporateContactErrors>(
      {}
    );

  const [submitted, setSubmitted] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const successRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      Object.keys(errors).length ===
      0
    ) {
      return;
    }

    const invalidField =
      document.querySelector<HTMLElement>(
        '#teklif-formu [aria-invalid="true"]'
      );

    invalidField?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    invalidField?.focus({
      preventScroll: true,
    });
  }, [errors]);

  useEffect(() => {
    if (!submitted) {
      return;
    }

    successRef.current?.focus({
      preventScroll: true,
    });
  }, [submitted]);

  const update = (
    field: keyof FormState,
    value: string
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitted(false);
    setSubmitError("");
  };

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError("");
    setSubmitted(false);

    const formData =
      new FormData(
        event.currentTarget
      );

    /*
     * Honeypot
     */
    const honeypot = String(
      formData.get(
        "website"
      ) ?? ""
    ).trim();

    if (honeypot) {
      setSubmitted(true);
      return;
    }

    /*
     * Suspiciously fast submission (likely a bot): pretend success without
     * actually inserting the row, same as the honeypot above.
     */
    if (Date.now() - formMountedAtRef.current < 2500) {
      setSubmitted(true);
      return;
    }

    /*
     * Form validation
     */
    const next =
      validateCorporateContact(
        values,
        consent
      );

    setErrors(next);

    if (
      Object.keys(next).length > 0
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * SUPABASE INSERT
       *
       * Tablo:
       * contact_messages
       *
       * Kolonlar:
       * id
       * name
       * email
       * service
       * region
       * message
       * status
       * created_at
       *
       * DİKKAT:
       * consent gönderilmiyor.
       */

      const { error } =
        await supabase
          .from(
            "contact_messages"
          )
          .insert({
            name:
              values.name.trim(),

            email:
              values.email
                .trim()
                .toLowerCase(),

            service:
              values.service.trim(),

            region:
              values.region.trim(),

            message:
              values.message.trim(),

            status:
              "new",

            consent: true,
          });

      if (error) {
        console.error(
          "[Contact] Supabase insert failed:",
          error
        );

        throw new Error(
          "Talebiniz şu anda gönderilemedi. Lütfen WhatsApp veya e-posta üzerinden ulaşın."
        );
      }

      /*
       * Başarılı gönderim
       */

      setSubmitted(true);

      setValues({
        ...emptyForm,
      });

      setConsent(false);
      setErrors({});
    } catch (error) {
      console.error(
        "[Contact] Submit failed:",
        error
      );

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Talep gönderilemedi. Lütfen WhatsApp veya e-posta üzerinden ulaşın."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageFrame>
      <CorporateHero
        data={usePageData().contact}
        compact
      />

      <section className="new-contact-layout">
        <div className="new-contact-copy">
          <p className="eyebrow">
            {t("contact.channelsEyebrow")}
          </p>

          <h2>
            {t("contact.channelsTitle")}
          </h2>

          <p>
            {t("contact.channelsIntro")}
          </p>

          <div className="contact-channel-grid">
            <a
              href="https://wa.me/905454353201"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle
                size={18}
              />
              {t("contact.whatsapp")}
            </a>

            <a href="tel:+905454353201">
              <Phone size={18} />
              +90 545 435 32 01
            </a>

            <a href="mailto:info@perlamarine.com">
              <Mail size={18} />
              info@perlamarine.com
            </a>
          </div>
        </div>

        <form
          id="teklif-formu"
          className="new-contact-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* =========================================
              HONEYPOT
          ========================================== */}

          <input
            className="form-honeypot"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="new-contact-form__heading">
            <span>
              {t("contact.formEyebrow").toUpperCase()}
            </span>

            <p>
              {t("contact.formTitle")}
            </p>
          </div>

          {Object.keys(errors)
            .length > 0 && (
            <div
              id="contact-form-error-summary"
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              Lütfen formdaki alanları
              kontrol edin. Hatalı alanlar
              aşağıda açıklanmıştır.
            </div>
          )}

          {/* NAME + EMAIL */}

          <div className="new-contact-form__row">
          <label>
            {t("contact.name")}

            <input
              id="name-field"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={(event) =>
                update(
                  "name",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.name
              )}
              aria-describedby={
                errors.name
                  ? "name-error"
                  : undefined
              }
            />

            {errors.name && (
              <small
                id="name-error"
                className="field-error"
                role="alert"
              >
                {errors.name}
              </small>
            )}
          </label>

          {/* EMAIL */}

          <label>
            {t("contact.email")}

            <input
              id="email-field"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.email
              )}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
            />

            {errors.email && (
              <small
                id="email-error"
                className="field-error"
                role="alert"
              >
                {errors.email}
              </small>
            )}
          </label>
          </div>

          {/* SERVICE */}

          <label>
            {t("contact.category")}

            <select
              id="service-field"
              name="service"
              value={
                values.service
              }
              onChange={(event) =>
                update(
                  "service",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.service
              )}
              aria-describedby={
                errors.service
                  ? "service-error"
                  : undefined
              }
            >
              <option value="">
                {t("contact.categoryPlaceholder")}
              </option>

              {serviceOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

            {errors.service && (
              <small
                id="service-error"
                className="field-error"
                role="alert"
              >
                {errors.service}
              </small>
            )}
          </label>

          {/* REGION */}

          <label>
            {t("contact.region")}

            <select
              id="region-field"
              name="region"
              value={
                values.region
              }
              onChange={(event) =>
                update(
                  "region",
                  event.target.value
                )
              }
            >
              <option value="">
                {t("contact.regionPlaceholder")}
              </option>

              {regionOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </label>

          {/* MESSAGE */}

          <label>
            {t("contact.message")}

            <textarea
              id="message-field"
              name="message"
              rows={3}
              value={
                values.message
              }
              onChange={(event) =>
                update(
                  "message",
                  event.target.value
                )
              }
              aria-invalid={Boolean(
                errors.message
              )}
              aria-describedby={
                errors.message
                  ? "message-error"
                  : undefined
              }
              placeholder={t("contact.messagePlaceholder")}
            />

            {errors.message && (
              <small
                id="message-error"
                className="field-error"
                role="alert"
              >
                {errors.message}
              </small>
            )}
          </label>

          {/* CONSENT */}

          <label className="consent-field">
            <input
              id="consent-field"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(
                  event.target.checked
                );

                setErrors(
                  (current) => ({
                    ...current,
                    consent:
                      undefined,
                  })
                );
              }}
              aria-invalid={Boolean(
                errors.consent
              )}
              aria-describedby={
                errors.consent
                  ? "consent-error"
                  : undefined
              }
            />

            <span>
              {t("contact.consent")}
            </span>
          </label>

          {errors.consent && (
            <small
              id="consent-error"
              className="field-error"
              role="alert"
            >
              {errors.consent}
            </small>
          )}

          {/* SUBMIT */}

          <button
            className="button button--navy"
            type="submit"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? t("contact.sending")
              : t("contact.submit")}

            {!isSubmitting && (
              <ArrowUpRight
                size={17}
              />
            )}
          </button>

          {/* SUBMIT ERROR */}

          {submitError && (
            <div
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              {submitError}
            </div>
          )}

          {/* SUCCESS */}

          {submitted && (
            <div
              id="contact-success"
              ref={successRef}
              className="new-contact-success"
              role="status"
              aria-live="polite"
              tabIndex={-1}
            >
              <span
                className="new-contact-success__mark"
                aria-hidden="true"
              >
                <Check
                  size={20}
                  strokeWidth={2.2}
                />
              </span>

              <div className="new-contact-success__copy">
                <span className="new-contact-success__eyebrow">
                  TALEBİNİZ ULAŞTI
                </span>

                <strong>
                  Teşekkür ederiz.
                </strong>

                <span>
                  En kısa sürede sizinle
                  iletişime geçeceğiz.
                  İsterseniz WhatsApp’tan da
                  yazabilirsiniz.
                </span>
              </div>

              <span
                className="new-contact-success__signal"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
              </span>
            </div>
          )}

          <p className="form-assurance">
            <BatteryCharging
              size={14}
            />
            {t("contact.disclaimer")}
          </p>
        </form>
      </section>
    </PageFrame>
  );
}

