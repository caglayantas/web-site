# Perla Marine — Tüm Site Denetim Bulguları

Denetim kapsamı: Ana sayfa, Hakkımızda, Hizmetler, Projeler, proje detayları, Teknik Bilgiler listesi ve makale detayları, Bize Ulaşın, SSS, yasal sayfalar, site haritası, ortak header/footer, public tRPC uçları ve admin erişim yüzeyleri.

## Kritik ve yüksek öncelik

| ID | Kategori | Öncelik | Bulgu |
|---|---|---:|---|
| S1 | SEO/çalışma | Kritik | SPA yapısı nedeniyle inner route’lar ilk HTML’de kendi içerik/title/description bilgilerini sunmuyor; sayfa metadata’sının önemli bölümü useEffect ile sonradan değişiyor. Crawler ve paylaşım botları Hakkımızda, Hizmetler, Projeler, Teknik Bilgiler, İletişim ve SSS için eksik/yanlış ilk içerik görebilir. |
| S2 | Güvenlik | Yüksek | CSP `script-src 'self' 'unsafe-inline' https:` ve `connect-src 'self' https:` seviyesinde geniş. Her HTTPS kaynağına izin verilmesi CSP’nin koruma değerini azaltıyor. |
| S3 | Güvenlik | Yüksek | İletişim rate limit’i process içi Map kullanıyor ve `x-forwarded-for` ilk değerine güveniyor. Autoscale/multiple instance ortamında bypass edilebilir; proxy yapılandırması yanlışsa IP spoofing mümkün olabilir. |
| S4 | Güvenlik | Yüksek | Global Express body parser limitleri 50 MB. Küçük iletişim/tRPC istekleri için bu limit bellek tüketimi ve DoS yüzeyini gereksiz büyütüyor. |
| S5 | Güvenlik | Yüksek | `sanitizeRichText` tanımlı olmasına rağmen knowledge create/update prosedürlerinde body kaydedilmeden önce kullanılmıyor. Görüntüleme katmanındaki sanitizasyon ek savunma sağlasa da depolama katmanında allowlist uygulanmıyor. |
| S6 | Uyum/güven | Yüksek | KVKK, gizlilik ve çerez metinleri kendi içinde “genel taslak” ve gerçek süreçlerle yayın öncesi kontrol edilmesi gerektiğini söylüyor. Bu haliyle gerçek veri saklama, analytics, bildirim, saklama süresi ve başvuru süreçleriyle uyum doğrulanmamış. |
| S7 | Çalışma/UX | Yüksek | Site haritasında `/blog` bağlantısı var; aktif App rotalarında `/blog` yok. Kullanıcılar kırık sayfaya yönlendiriliyor. |

## SEO ve içerik mimarisi

| ID | Öncelik | Bulgu |
|---|---:|---|
| SEO1 | Yüksek | ServicesNew, ProjectsNew, KnowledgeNew, ContactNew, FAQ ve Legal sayfalarında AboutNew kadar tutarlı sayfa bazlı title, description ve canonical yönetimi yok. |
| SEO2 | Yüksek | Ana sayfa Teknik Bilgiler kartlarında gerçek detay URL’leri kullanılıyor; ancak inner-page bağlantılarının bir bölümü hâlâ absolute `www.perlamarine.com` anchor’ları. Domain/preview/production geçişlerinde tutarsızlık ve tam sayfa yenileme riski oluşuyor. |
| SEO3 | Orta | Sitemap statik sayfaları ve yayınlanmış proje/makale detaylarını kapsıyor; ancak rota değişimlerini test edecek kırık link kontrolü bulunmuyor. Yasal sayfaların indekslenmesi ayrıca hedeflenmeli mi karar verilmemiş. |
| SEO4 | Orta | Ana sayfa JSON-LD Organization/WebSite içeriyor; Service, BreadcrumbList, Article ve FAQPage şemaları sayfa bazında tutarlı değil veya client-side üretiliyor. |
| SEO5 | Orta | Proje detayları title/description/canonical temelini taşıyor fakat Open Graph image, Article/CreativeWork/Service türü yapılandırılmış veri ve özgün paylaşım metası eksik. |
| SEO6 | Orta | Meta keywords bulunuyor; arama motorları için anlamlı bir sıralama katkısı sağlamıyor ve içerik stratejisi yerine gerçek başlık/özet/iç bağlantı iyileştirmeleri öncelikli olmalı. |
| SEO7 | Orta | Yasal sayfalar ve SSS için özgün sosyal paylaşım meta bilgileri yok. |
| SEO8 | Orta | Ana sayfa crawler fallback’i yalnızca temel H1 ve dört bağlantıyı sunuyor; hizmet kartları, projeler, teknik yazılar, FAQ ve şirket kanıtları ilk HTML’de görünmüyor. |

## Kullanıcı deneyimi ve erişilebilirlik

| ID | Öncelik | Bulgu |
|---|---:|---|
| UX1 | Yüksek | Header’da aktif durum yalnızca tam rota eşleşmesine bağlı. `/projeler/:slug` ve `/teknik-bilgiler/:slug` gibi detaylarda üst bölüm navigasyon vurgusu kayboluyor. |
| UX2 | Orta | Mobil menü Escape ve ilk focus davranışına sahip; ancak tam focus trap, dışarı tıklamada kapatma ve menü açıldığında arka plan inert/scroll kilidi davranışı ayrıca güçlendirilmeli. |
| UX3 | Orta | İç sayfalarda aynı site içinde tam absolute anchor kullanımı SPA geçişlerini ve preview deneyimini zayıflatıyor; router link standardı tüm public sayfalarda tekleştirilmeli. |
| UX4 | Orta | İletişim formu gönderim başarısızlığında WhatsApp/e-posta alternatifini söylüyor; ancak alan bazlı sunucu hatası eşleştirmesi ve tekrar deneme/başvuru kimliği akışı sınırlı. |
| UX5 | Orta | Proje ve Teknik Bilgiler içeriklerinde veri sorgusu hata fallback’i gösteriliyor; kullanıcıya gerçek verinin geçici olarak alınamadığı açıkça ayrıştırılmıyor. Fallback içerik ile canlı içerik arasındaki fark belirsiz. |
| UX6 | Orta | Ana sayfa ve public iç sayfalarda içerik blokları görsel olarak güçlü; ancak özellikle mobilde uzun hero + çoklu kart akışı için içerik yoğunluğu ve ilk eyleme ulaşma süresi ayrıca ölçülmeli. |
| UX7 | Düşük | Site haritası ve legal sayfalar kullanıcıya açık; ancak `/blog` kırık bağlantısı güven algısını doğrudan etkiliyor. |

## Performans ve teknik kalite

| ID | Öncelik | Bulgu |
|---|---:|---|
| P1 | Orta | Production build JavaScript bundle’ı yaklaşık 1 MB minified ve Vite 500 KB uyarısı veriyor. Route-level code splitting/dynamic import uygulanabilir. |
| P2 | Orta | Fontlar Google Fonts’tan render-blocking stylesheet olarak yükleniyor; font-display/preload ve fallback stratejisi ölçülmeli. |
| P3 | Orta | Hero boyutlandırılmış ve yüksek öncelikli; ancak inner page hero görsellerinde ortak width/height/fetch strategy standardı tüm sayfalarda doğrulanmalı. |
| P4 | Düşük | S3/storage görsellerinde response cache-control, WebP/AVIF varyantları ve CDN cache süreleri performans denetimine alınmalı. |
| P5 | Düşük | Browser console’da auth session cookie eksik logları görülebiliyor; public sayfalarda gereksiz auth gürültüsü hata ayıklamayı zorlaştırıyor. |

## Güçlü mevcut alanlar

Üretim HTTP yanıtlarında X-Powered-By kaldırılmış; nosniff, frame-ancestors/SAMEORIGIN, Referrer-Policy, Permissions-Policy ve HSTS/CSP başlıkları mevcut. robots.txt sitemap.xml’e işaret ediyor ve sitemap HTTP 200 XML döndürüyor. Public veriler tRPC üzerinden status filtreleriyle sunuluyor; admin prosedürleri adminProcedure ile korunuyor. Ana sayfa, AboutNew ve detay sayfalarında anlamlı H1, alt metin ve temel canonical yapıları bulunuyor. İletişim formunda Zod doğrulaması, honeypot ve kısa süreli abuse kontrolü var.

## Önerilen onay paketleri

**Paket A — Kritik güvenlik ve çalışma:** S2, S3, S4, S5, S6, S7.

**Paket B — SEO temeli:** S1, SEO1, SEO2, SEO3, SEO4, SEO8.

**Paket C — Erişilebilirlik ve UX:** UX1, UX2, UX3, UX4, UX5, UX6.

**Paket D — Performans ve ileri SEO:** SEO5, SEO6, SEO7, P1, P2, P3, P4, P5.

Kullanıcı onayı gelmeden hiçbir bulgu için kod değişikliği yapılmayacaktır.
