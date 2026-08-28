import { useState, type FormEvent } from "react";
import PageHero from "@/components/PageHero";
import { supabase } from "@/lib/supabase";
import { ArrowUpRight, Check, MessageCircle, MapPin, Phone, Mail, AlertCircle } from "lucide-react";

const SITE_URL = "https://www.perlamarine.com";

const serviceOptions = [
  "Kompozit çözümler", "Marin elektrik", "Marin elektroniği", "Isıtma, soğutma ve havalandırma", "Mekanik tesisat", "Motor, tahrik ve dümen", "Yelken ve arma bakımı", "Güverte üstü ekipmanlar", "Tekneye özel çözümler", "Üretici danışmanlığı",
];

export type FieldErrors = Record<string, string>;

export function validateContactForm(values: Record<string, unknown>): FieldErrors {
  const nextErrors: FieldErrors = {};
  if (!String(values.name || "").trim()) nextErrors.name = "Ad soyad alanını doldurun.";
  if (!String(values.email || "").match(/^\S+@\S+\.\S+$/)) nextErrors.email = "Geçerli bir e-posta adresi yazın.";
  if (!String(values.service || "")) nextErrors.service = "Bir ihtiyaç kategorisi seçin.";
  if (!String(values.message || "").trim()) nextErrors.message = "Mevcut durumu ve hedefinizi kısaca paylaşın.";
  if (!values.consent) nextErrors.consent = "İletişim talebiniz için aydınlatma onayını işaretleyin.";
  return nextErrors;
}

export default function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: data.get("name"),
      email: data.get("email"),
      service: data.get("service"),
      message: data.get("message"),
      consent: data.get("consent"),
    };
    const nextErrors = validateContactForm(values);
    setErrors(nextErrors);
    setSubmitted(false);
    setSubmitError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    const { error } = await supabase.from("contact_requests").insert({
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim() || null,
      project: String(data.get("project") || "").trim() || null,
      vessel: String(data.get("vessel") || "").trim() || null,
      location: String(data.get("location") || "").trim() || null,
      service: String(data.get("service") || ""),
      preferred: String(data.get("preferred") || "").trim() || null,
      message: String(data.get("message") || "").trim(),
      consent: true,
    });

    setSubmitting(false);

    if (error) {
      console.error("[Contact] Supabase insert failed:", error);
      setSubmitError("Talebiniz gönderilemedi. Lütfen birkaç saniye sonra tekrar deneyin veya telefon, e-posta ya da WhatsApp üzerinden doğrudan ulaşın.");
      return;
    }

    setSubmitted(true);
    form.reset();
  }

  const describedBy = (field: string) => errors[field] ? `${field}-error` : undefined;
  const invalid = (field: string) => errors[field] ? true : undefined;

  return <>
    <PageHero eyebrow="Bize ulaşın" title="Teknenizin veya projenizin ihtiyaçlarını birlikte değerlendirelim." intro="Bakım-onarım, refit, yeni bir sistem planı veya üretim danışmanlığı için teknenizin mevcut durumunu ve ihtiyacınızı paylaşın." variant="contact" />
    <section className="contact-page section">
      <div className="contact-page__details">
        <p className="eyebrow">İletişim başlangıcı</p><h2>Önce sizi ve teknenizi dinleyelim.</h2>
        <p>Formdaki bilgiler, ilk teknik değerlendirmeyi doğru kapsamda yapabilmemiz için kullanılır. Konum ve fotoğraf gibi ek bilgiler, gerekirse sonraki görüşmede paylaşılabilir.</p>
        <div className="contact-direct">
          <a href="tel:+905454353201"><Phone size={16} /><span>Telefon</span>+90 545 435 32 01</a>
          <a href="mailto:info@perlamarine.com"><Mail size={16} /><span>E-posta</span>info@perlamarine.com</a>
          <a href="https://wa.me/905454353201" target="_blank" rel="noreferrer"><MessageCircle size={16} /><span>WhatsApp</span>Mesaj gönderin</a>
          <a href="https://www.instagram.com/perlamarine.tr/" target="_blank" rel="noreferrer"><span>Instagram</span>@perlamarine.tr</a>
        </div>
        <div className="coverage-note"><MapPin size={18} aria-hidden="true" /><div><b>Çalışma kapsamı</b><p>Teknenizin bulunduğu marina veya bölgeyi formda belirtin. Uygunluk; işin kapsamı, erişim koşulları ve ekip planına göre değerlendirilir.</p></div></div>
        <div className="project-steps" aria-label="Teknik değerlendirme adımları"><div><p><b>Bağlam</b><small>Teknenizi, kullanım profilini ve mevcut durumu anlayalım.</small></p></div><div><p><b>Teknik odak</b><small>İhtiyacı doğru hizmet kategorisiyle eşleştirelim.</small></p></div><div><p><b>Değerlendirme</b><small>Bakım, onarım veya danışmanlık için sonraki adımı netleştirelim.</small></p></div></div>
      </div>
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <div className="contact-form__heading"><span>TEKNİK DEĞERLENDİRME</span><p>Servis ve teklif talebi</p></div>
        {Object.keys(errors).length > 0 && <div className="form-error-summary" role="alert"><AlertCircle size={16} /><span>Lütfen aşağıdaki alanları kontrol edin: {Object.values(errors).join(" ")}</span></div>}
        {submitError && <div className="form-error-summary" role="alert"><AlertCircle size={16} /><span>{submitError}</span></div>}
        <div className="form-row">
          <label>Adınız ve soyadınız<input name="name" required autoComplete="name" placeholder="Adınız ve soyadınız" aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />{errors.name && <small id="name-error" className="field-error">{errors.name}</small>}</label>
          <label>E-posta adresiniz<input name="email" type="email" required autoComplete="email" placeholder="ornek@eposta.com" aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />{errors.email && <small id="email-error" className="field-error">{errors.email}</small>}</label>
        </div>
        <div className="form-row"><label>Telefon numaranız<input name="phone" type="tel" autoComplete="tel" placeholder="+90 ..." /></label><label>Tekne / proje adı <span>(varsa)</span><input name="project" placeholder="Proje veya tekne adı" /></label></div>
        <div className="form-row"><label>Tekne tipi<input name="vessel" placeholder="Motor yat, yelkenli, üretim projesi..." /></label><label>Konum / marina<input name="location" placeholder="Bulunduğu marina veya bölge" /></label></div>
        <div className="form-row">
          <label>İhtiyaç kategorisi<select name="service" required defaultValue="" aria-invalid={invalid("service")} aria-describedby={describedBy("service")}><option value="" disabled>Bir kategori seçin</option>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select>{errors.service && <small id="service-error" className="field-error">{errors.service}</small>}</label>
          <label>Tercih edilen iletişim<select name="preferred" defaultValue="E-posta"><option>E-posta</option><option>Telefon</option><option>WhatsApp</option></select></label>
        </div>
        <label>Mevcut durum ve hedef<textarea name="message" required rows={5} placeholder="Teknenin kullanım profili, mevcut sistemler ve çözmek istediğiniz teknik konuyu kısaca paylaşın." aria-invalid={invalid("message")} aria-describedby={describedBy("message")} />{errors.message && <small id="message-error" className="field-error">{errors.message}</small>}</label>
        <label className="consent-field"><input name="consent" type="checkbox" required aria-invalid={invalid("consent")} aria-describedby={describedBy("consent")} /> <span>Kişisel verilerimin <a href={`${SITE_URL}/kvkk`}>Aydınlatma Metni</a> kapsamında işlenmesini kabul ediyorum.{errors.consent && <small id="consent-error" className="field-error">{errors.consent}</small>}</span></label>
        <button className="button button--navy" type="submit" disabled={submitting}>{submitting ? "Gönderiliyor..." : "Teknik değerlendirme talebi"} <ArrowUpRight size={17} /></button>
        {submitted && <div className="form-success" role="status" aria-live="polite"><Check size={15} /><span>Talebiniz başarıyla alındı. Bilgileriniz Perla Marine ekibine iletildi; en kısa sürede sizinle iletişime geçeceğiz.</span></div>}
        <p className="form-assurance"><Check size={14} /> Bilgileriniz yalnızca talebinizin ilk değerlendirmesi için kullanılır. Alternatif olarak +90 545 435 32 01 veya info@perlamarine.com üzerinden doğrudan ulaşabilirsiniz.</p>
      </form>
    </section>
  </>;
}
