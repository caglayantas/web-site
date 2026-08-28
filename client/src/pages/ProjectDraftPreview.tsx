import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Check, ExternalLink, Loader2, Wrench } from "lucide-react";
import { useRoute } from "wouter";

const SITE_URL = "https://www.perlamarine.com";

export default function ProjectDraftPreview() {
  const [, params] = useRoute("/yonetim/projeler/preview/:slug");
  const slug = params?.slug ?? "";
  const project = trpc.projects.preview.useQuery({ slug }, { enabled: Boolean(slug) });

  if (project.isLoading) {
    return <main className="draft-preview-shell draft-preview-shell--centered"><Loader2 className="animate-spin" size={28} /><span>Taslak önizleme hazırlanıyor…</span></main>;
  }

  if (project.isError || !project.data) {
    return <main className="draft-preview-shell draft-preview-shell--centered"><div className="draft-preview-error"><p className="eyebrow">Önizleme kullanılamıyor</p><h1>Taslak proje bulunamadı.</h1><p>Proje silinmiş, URL anahtarı değişmiş veya yönetici oturumunuz sona ermiş olabilir.</p><a className="draft-preview-back" href="/yonetim/projeler"><ArrowLeft size={16} /> Proje yönetimine dön</a></div></main>;
  }

  const value = project.data;
  return <main className="draft-preview-shell">
    <div className="draft-preview-bar" role="status" aria-label="Taslak önizleme durumu">
      <div className="draft-preview-bar__identity"><span className="draft-preview-badge"><Wrench size={14} /> TASLAK ÖNİZLEME</span><span className="draft-preview-bar__title">{value.title}</span></div>
      <div className="draft-preview-bar__actions"><a href="/yonetim/projeler" className="draft-preview-bar__link"><ArrowLeft size={15} /> Yönetim paneline dön</a>{value.status === "published" && <a href={`${SITE_URL}/projeler#${value.slug}`} className="draft-preview-bar__link draft-preview-bar__link--external">Yayındaki görünüm <ExternalLink size={14} /></a>}</div>
    </div>
    <section className="draft-preview-hero">
      <div className="draft-preview-hero__copy"><p className="eyebrow">{value.label} · {value.status === "published" ? "Yayında" : "Yayınlanmadan önce kontrol"}</p><h1>{value.title}</h1><p>{value.detail}</p><div className="draft-preview-hero__meta"><span><Check size={15} /> Önce/sonra karşılaştırması hazır</span><span><Check size={15} /> Teknik kapsam alanları görünür</span></div></div>
      <div className="draft-preview-hero__media"><BeforeAfterSlider before={value.beforeImage} after={value.afterImage} beforeAlt={`${value.title} önce görseli`} afterAlt={`${value.title} sonra görseli`} label={value.title} /></div>
    </section>
    <section className="draft-preview-content" aria-label="Proje teknik detayları">
      <div className="draft-preview-content__heading"><p className="eyebrow">Saha çalışması</p><h2>Bakım kapsamı ve uygulama sonucu</h2><p>Bu sayfa, projenin public görünümünü yayınlamadan önce kontrol etmek için oluşturulmuştur. Taslak kayıt public projeler listesinde gösterilmez.</p></div>
      <div className="draft-preview-facts"><article><span>Kapsam</span><h3>Kontrol ve uygulama alanları</h3><p>{value.scope || "Bu proje için kapsam bilgisi henüz girilmedi."}</p></article><article><span>Kullanılan sistemler</span><h3>Teknik bileşenler</h3><p>{value.systems || "Bu proje için kullanılan sistem bilgisi henüz girilmedi."}</p></article><article><span>Bakım sonucu</span><h3>Operasyon sonrası durum</h3><p>{value.results || "Bu proje için bakım sonucu henüz girilmedi."}</p></article></div>
    </section>
    <section className="draft-preview-next"><div><p className="eyebrow">Yayın öncesi kontrol</p><h2>İçerik, görseller ve teknik kapsam hazır mı?</h2><p>Her alanı kontrol ettikten sonra yönetim paneline dönerek projeyi taslakta tutabilir veya yayına alabilirsiniz.</p></div><a href="/yonetim/projeler" className="draft-preview-next__button">Projeyi düzenle <ArrowLeft size={16} /></a></section>
  </main>;
}
