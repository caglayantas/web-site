export function ContactNew() {
  usePageMetadata(
    "/iletisim",
    "İletişim | Perla Marine Tekne Teknik Check-up ve Servis",
    "Teknenizin bakım, onarım, elektrik, mekanik veya tahrik ihtiyacını Perla Marine’e aktarın; uygulanabilir sonraki adımı birlikte planlayalım."
  );

  const [values, setValues] =
    useState<FormState>(emptyForm);

  const [consent, setConsent] =
    useState(false);

  const [errors, setErrors] =
    useState<CorporateContactErrors>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const successRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Object.keys(errors).length === 0) {
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

    const formData = new FormData(
      event.currentTarget
    );

    const honeypot = String(
      formData.get("website") ?? ""
    ).trim();

    /*
     * Honeypot alanı doluysa bot kabul ediyoruz.
     * Kullanıcıya hata göstermeden işlemi sonlandırıyoruz.
     */
    if (honeypot) {
      setSubmitted(true);
      return;
    }

    const next = validateCorporateContact(
      values,
      consent
    );

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          service: values.service.trim(),
          message: values.message.trim(),

          // Veritabanındaki status alanı
          status: "new",
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
      <PageHero data={pageData.contact} />

      <section className="new-contact-layout">
        <div className="new-contact-copy">
          <p className="eyebrow">
            İletişim kanalları
          </p>

          <h2>
            İhtiyacınız için uygun yolu seçin.
          </h2>

          <p>
            Form üzerinden kapsamlı bilgi paylaşabilir,
            WhatsApp veya e-posta üzerinden doğrudan
            yazabilirsiniz.
          </p>

          <div className="contact-channel-grid">
            <a href="https://wa.me/905454353201">
              <MessageCircle size={18} />
              WhatsApp ile yazın
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
          {/* Honeypot - bot koruması */}
          <input
            className="form-honeypot"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="new-contact-form__heading">
            <span>TEKNİK DEĞERLENDİRME</span>
            <p>Teknenizi anlatın</p>
          </div>

          {Object.keys(errors).length > 0 && (
            <div
              id="contact-form-error-summary"
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              Lütfen formdaki alanları kontrol edin.
              Hatalı alanlar aşağıda açıklanmıştır.
            </div>
          )}

          <label>
            Adınız ve soyadınız

            <input
              id="name-field"
              name="name"
              value={values.name}
              onChange={(event) =>
                update(
                  "name",
                  event.target.value
                )
              }
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name
                  ? "name-error"
                  : "contact-form-error-summary"
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

          <label>
            E-posta adresiniz

            <input
              id="email-field"
              name="email"
              type="email"
              value={values.email}
              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email
                  ? "email-error"
                  : "contact-form-error-summary"
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

          <label>
            İhtiyaç kategorisi

            <select
              id="service-field"
              name="service"
              value={values.service}
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
                  : "contact-form-error-summary"
              }
            >
              <option value="">
                Bir kategori seçin
              </option>

              {serviceGroups.map(([title]) => (
                <option
                  key={title}
                  value={title}
                >
                  {title}
                </option>
              ))}
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

          <label>
            Mevcut durum ve hedef

            <textarea
              id="message-field"
              name="message"
              rows={5}
              value={values.message}
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
                  : "contact-form-error-summary"
              }
              placeholder="Teknenizin mevcut durumunu ve ihtiyacınızı kısaca anlatın."
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

          <label className="consent-field">
            <input
              id="consent-field"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(
                  event.target.checked
                );

                setErrors((current) => ({
                  ...current,
                  consent: undefined,
                }));

                setSubmitError("");
              }}
              aria-invalid={Boolean(
                errors.consent
              )}
              aria-describedby={
                errors.consent
                  ? "consent-error"
                  : "contact-form-error-summary"
              }
            />

            <span>
              KVKK aydınlatma metnini okudum ve
              iletişim kurulmasını kabul ediyorum.
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

          <button
            className="button button--navy"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Gönderiliyor…"
              : "Talebi gönder"}

            {!isSubmitting && (
              <ArrowUpRight size={17} />
            )}
          </button>

          {submitError && (
            <div
              className="form-error-summary"
              role="alert"
              aria-live="assertive"
            >
              {submitError}
            </div>
          )}

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
                  En kısa sürede sizinle iletişime
                  geçeceğiz. İsterseniz WhatsApp’tan
                  da yazabilirsiniz.
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
            <BatteryCharging size={14} />
            Bilgileriniz yalnızca ilk teknik
            değerlendirme için kullanılır.
          </p>
        </form>
      </section>
    </PageFrame>
  );
}
