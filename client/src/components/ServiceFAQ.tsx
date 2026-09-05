import { useEffect, useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { getPublishedFaqs, localizeFaq, type FaqRow } from "@/lib/content";

type FaqItem = { question: string; answer: string };

const fallbackQuestions: FaqRow[] = [
  { id: -1, question: "Bakım veya onarım talebi nasıl değerlendirilir?", answer: "Önce teknenin mevcut durumu, kullanım profili, konumu ve teknik ihtiyacı anlaşılır. Ardından gerekli inceleme ve uygulanabilir sonraki adım birlikte netleştirilir.", questionEn: "How is a maintenance or repair request assessed?", answerEn: "We first understand the boat's current condition, usage profile, location, and technical need. We then clarify the required inspection and the next actionable step together.", status: "published", sortOrder: 0 },
  { id: -2, question: "Teknenin bulunduğu marinada hizmet alabilir miyim?", answer: "Çalışma uygunluğu; teknenin bulunduğu bölge, işin kapsamı, erişim koşulları ve ekip planına göre değerlendirilir. İletişim formunda marina veya konum bilgisini paylaşabilirsiniz.", questionEn: "Can you provide service at my boat's marina?", answerEn: "Service availability is assessed based on the boat's region, the scope of work, access conditions, and our team's schedule. You can share your marina or location in the contact form.", status: "published", sortOrder: 1 },
  { id: -3, question: "Hangi tekne bakım ve onarım hizmetlerinde destek veriyorsunuz?", answer: "Kompozit, marin elektrik ve elektronik, iklimlendirme, mekanik tesisat, motor-tahrik-dümen, yelken arma, güverte ekipmanları ve tekneye özel çözümler üzerinde çalışıyoruz.", questionEn: "Which boat maintenance and repair services do you support?", answerEn: "We work on composite, marine electrical and electronics, climate control, mechanical systems, propulsion-steering, sailing rig, deck equipment, and boat-specific solutions.", status: "published", sortOrder: 2 },
  { id: -4, question: "Lityum akü ve BMS sistemlerinde hangi kontroller önemlidir?", answer: "Sistem tasarımı, bağlantı düzeni, şarj kaynakları, koruma bileşenleri, kablo kesitleri, ısı yönetimi ve servis erişimi birlikte değerlendirilmelidir.", questionEn: "What checks matter for lithium battery and BMS systems?", answerEn: "System design, wiring layout, charge sources, protection components, cable sizing, thermal management, and service access should all be assessed together.", status: "published", sortOrder: 3 },
  { id: -5, question: "Bakım süresi neye göre belirlenir?", answer: "Süre; arızanın kaynağına, sistemin erişilebilirliğine, gerekli parçalara, teknenin durumuna ve aynı anda yürütülecek operasyonlara göre değişir.", questionEn: "What determines the maintenance duration?", answerEn: "Duration depends on the source of the issue, system accessibility, required parts, the boat's condition, and any operations carried out at the same time.", status: "published", sortOrder: 4 },
  { id: -6, question: "Tekne üreticilerine hangi alanlarda danışmanlık veriyorsunuz?", answer: "Model ve kalıp imalatı, servis edilebilirlik, sistem erişimi, kompozit uygulamalar ve teknik koordinasyon gibi başlıklarda proje bazlı danışmanlık sunuyoruz.", questionEn: "What consulting do you offer to boat manufacturers?", answerEn: "We offer project-based consulting on model and mold production, serviceability, system access, composite applications, and technical coordination.", status: "published", sortOrder: 5 },
];

export default function ServiceFAQ({ compact = false }: { compact?: boolean }) {
  const { lang, toPath } = useLanguage();
  useEffect(() => {
    if (compact) return;
    const title = lang === "en" ? "FAQ | Perla Marine Boat Maintenance and Technical Service" : "SSS | Perla Marine Tekne Bakım ve Teknik Servis";
    const description = lang === "en"
      ? "Answers to frequently asked questions about Perla Marine's boat maintenance and repair, marine electrical, lithium BMS, propulsion, and mechanical services."
      : "Perla Marine’in tekne bakım-onarım, marin elektrik, lityum BMS, motor-tahrik ve mekanik tesisat hizmetleri hakkında sık sorulan soruların yanıtları.";
    const canonicalUrl = `https://www.perlamarine.com${toPath("/sss")}`;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonicalUrl);
    return () => { document.title = lang === "en" ? "Perla Marine | Boat & Yacht Maintenance and Repair" : "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [compact, lang]);
  const [items, setItems] = useState<FaqRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    getPublishedFaqs()
      .then((data) => {
        if (!mounted) return;
        setItems(data.length ? data : null);
      })
      .catch((error) => {
        console.error("[FAQ] fetch error:", error);
        if (mounted) setItems(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);
  const source = items?.length ? items : fallbackQuestions;
  const localized: FaqItem[] = source.map((item) => localizeFaq(item, lang));
  const visibleQuestions = compact ? localized.slice(0, 5) : localized;
  const schemaQuestions = visibleQuestions.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }));
  const t = {
    eyebrow: lang === "en" ? "Frequently Asked Questions" : "Sık sorulan sorular",
    heading: lang === "en" ? "Clear, technical answers to what's on your mind." : "Aklınıza takılan her şey için açık ve teknik cevaplar.",
    viewAll: lang === "en" ? "View all FAQ" : "Tüm SSS’yi görün",
    loading: lang === "en" ? "Loading frequently asked questions…" : "Sık sorulan sorular yükleniyor…",
  };

  return (
    <section className={`faq-section section ${compact ? "faq-section--compact" : ""}`} id="sss">
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: schemaQuestions })}</script>
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.heading}</h2>
        </div>
        {compact && <a className="text-link text-link--dark" href={toPath("/sss")}>{t.viewAll} <ArrowUpRight size={16} /></a>}
      </div>
      <div className="faq-list" aria-busy={loading}>
        {loading && <p className="home-content-empty">{t.loading}</p>}
        {visibleQuestions.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary><span>{item.question}</span><Plus size={18} aria-hidden="true" /></summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
