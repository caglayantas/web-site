import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

const fallbackQuestions = [
  { question: "Bakım veya onarım talebi nasıl değerlendirilir?", answer: "Önce teknenin mevcut durumu, kullanım profili, konumu ve teknik ihtiyacı anlaşılır. Ardından gerekli inceleme ve uygulanabilir sonraki adım birlikte netleştirilir." },
  { question: "Teknenin bulunduğu marinada hizmet alabilir miyim?", answer: "Çalışma uygunluğu; teknenin bulunduğu bölge, işin kapsamı, erişim koşulları ve ekip planına göre değerlendirilir. İletişim formunda marina veya konum bilgisini paylaşabilirsiniz." },
  { question: "Hangi tekne bakım ve onarım hizmetlerinde destek veriyorsunuz?", answer: "Kompozit, marin elektrik ve elektronik, iklimlendirme, mekanik tesisat, motor-tahrik-dümen, yelken arma, güverte ekipmanları ve tekneye özel çözümler üzerinde çalışıyoruz." },
  { question: "Lityum akü ve BMS sistemlerinde hangi kontroller önemlidir?", answer: "Sistem tasarımı, bağlantı düzeni, şarj kaynakları, koruma bileşenleri, kablo kesitleri, ısı yönetimi ve servis erişimi birlikte değerlendirilmelidir." },
  { question: "Bakım süresi neye göre belirlenir?", answer: "Süre; arızanın kaynağına, sistemin erişilebilirliğine, gerekli parçalara, teknenin durumuna ve aynı anda yürütülecek operasyonlara göre değişir." },
  { question: "Tekne üreticilerine hangi alanlarda danışmanlık veriyorsunuz?", answer: "Model ve kalıp imalatı, servis edilebilirlik, sistem erişimi, kompozit uygulamalar ve teknik koordinasyon gibi başlıklarda proje bazlı danışmanlık sunuyoruz." },
];

export default function ServiceFAQ({ compact = false }: { compact?: boolean }) {
  useEffect(() => {
    if (compact) return;
    const title = "SSS | Perla Marine Tekne Bakım ve Teknik Servis";
    const description = "Perla Marine’in tekne bakım-onarım, marin elektrik, lityum BMS, motor-tahrik ve mekanik tesisat hizmetleri hakkında sık sorulan soruların yanıtları.";
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", "https://www.perlamarine.com/sss");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://www.perlamarine.com/sss");
    return () => { document.title = "Perla Marine | Tekne ve Yat Bakım-Onarım"; };
  }, [compact]);
  const query = trpc.faq.published.useQuery();
  const source = query.data?.length ? query.data : fallbackQuestions;
  const visibleQuestions = compact ? source.slice(0, 5) : source;
  const schemaQuestions = visibleQuestions.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } }));

  return (
    <section className={`faq-section section ${compact ? "faq-section--compact" : ""}`} id="sss">
      <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: schemaQuestions })}</script>
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Sık sorulan sorular</p>
          <h2>Aklınıza takılan her şey için açık ve teknik cevaplar.</h2>
        </div>
        {compact && <a className="text-link text-link--dark" href="/sss">Tüm SSS’yi görün <ArrowUpRight size={16} /></a>}
      </div>
      <div className="faq-list" aria-busy={query.isLoading}>
        {query.isLoading && <p className="home-content-empty">Sık sorulan sorular yükleniyor…</p>}
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
