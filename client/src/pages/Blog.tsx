/**
 * Perla Marine / Sessiz Kuvvet: Blog, teknik konuları aşırı görsel gürültü olmadan, editoryal
 * beyaz alan ve asimetrik içerik blokları ile erişilebilir hale getiren bilgi merkezi sayfasıdır.
 */
import PageHero from "@/components/PageHero";
import RouteConnector from "@/components/RouteConnector";
import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    category: "Elektrik ve enerji sistemleri",
    title: "Lityum ve akü sistemlerinde bakım kontrolü nerede başlar?",
    excerpt: "Bağlantı düzeni, şarj davranışı ve servis erişimi üzerinden pratik bir kontrol çerçevesi.",
    featured: true,
  },
  {
    category: "Motor, tahrik ve dümen",
    title: "Motor, şaft ve dümen sistemlerinde bakım işaretleri",
    excerpt: "Titreşim, ses, boşluk ve bağlantı değişimlerini erken fark etmek için sahadan notlar.",
  },
  {
    category: "Mekanik tesisatlar",
    title: "Pompa, vana ve hortum hatlarında planlı bakım",
    excerpt: "Sızdırmazlık, erişim ve deniz suyu sistemlerinde düzenli kontrolün pratik karşılığı.",
  },
  {
    category: "Kompozit çözümler",
    title: "Model, kalıp ve kompozit tamirinde doğru hazırlık",
    excerpt: "Yüzey hazırlığı, katman düzeni ve yapısal bütünlük için uygulama notları.",
  },
  {
    category: "Sezon öncesi bakım",
    title: "Tekneyi sezona hazırlarken hangi sistemler birlikte kontrol edilmeli?",
    excerpt: "Enerji, sintine, yakıt, dümen ve güverte ekipmanlarını tek bir bakım planında ele alma yaklaşımı.",
  },
  {
    category: "Marin elektrik",
    title: "Tekne elektrik sistemlerinde güvenli kontrol sırası",
    excerpt: "Akü, şarj, pano, kablo ve bağlantıların bakım sırasında birlikte değerlendirilmesi.",
  },
  {
    category: "Isıtma ve soğutma",
    title: "Klima ve Webasto sistemlerinde bakım belirtileri",
    excerpt: "Performans düşüşü, ses, koku ve drenaj sorunlarını erken fark etmek için saha notları.",
  },
  {
    category: "Tekne sahipleri için rehber",
    title: "Arıza tarifini teknik ekibe aktarırken hangi bilgiler önemlidir?",
    excerpt: "Konum, belirti, zamanlama ve mevcut sistem bilgisiyle ilk değerlendirmeyi hızlandırmak.",
  },
];

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Teknik kararlar için açık, güncel ve uygulanabilir notlar."
        intro="Perla Marine bilgi merkezinde; yat sistemleri, enerji teknolojileri, bakım ve teknik planlama üzerine odaklanmış içerikler bulacaksınız."
        variant="blog"
      />

      <section className="section blog-index">
        <div className="blog-index__intro">
          <p className="eyebrow">Bakım notları</p>
          <p>Kompozit, elektrik, motor, tahrik ve mekanik tesisat operasyonlarında karşılaşılan başlıkları; tekne sahipleri ve üretici ekipleri için sade, bağımsız yazılar halinde ele alıyoruz.</p>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <article className={`article-card ${article.featured ? "article-card--featured" : ""}`} key={article.title}>
              <p>{article.category}</p>
              <h2>{article.title}</h2>
              <span className="article-card__rule" aria-hidden="true" />
              <div className="article-card__footer">
                <span>{article.excerpt}</span>
                <a href="https://www.perlamarine.com/iletisim" aria-label={`${article.title} hakkında iletişime geçin`}><ArrowUpRight size={19} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <RouteConnector label="uygulama notları" align="left" />
    </>
  );
}
