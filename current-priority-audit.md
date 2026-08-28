# Perla Marine — Kullanım, SEO ve Güvenlik Öncelikli Audit

**Tarih:** 25 Ağustos 2026  
**Kapsam:** Gerçek önizleme davranışı, public rota kullanımı, içerik kalitesi, SEO görünürlüğü, production güvenliği ve yönetim akışları.

## Yönetici özeti

Denetimde public rotaların temel navigasyonunun çalıştığı, logo/görsel varlıkların bekleme sonrasında yüklendiği ve mobil ana sayfanın kullanılabilir olduğu görüldü. Buna karşılık canlı içerik kalitesi ve deployment güvenilirliği kritik öncelikte sorunlardır. Ana sayfadaki bazı yayınlanmış proje kayıtları anlamsız test metinleri ve konu-görsel uyumsuzlukları içeriyor. Ayrıca production env doğrulamasının fazla katı tasarlanması son deployment’ın `OWNER_OPEN_ID` eksikliği nedeniyle başlamamasına yol açtı; bu regresyon düzeltildi ancak düzeltme ayrı bir checkpoint ile canlıya alınmalıdır.

## Öncelik matrisi

| Öncelik | Alan | Bulgular | Etki | Önerilen karar |
|---|---|---|---|---|
| Kritik | Production erişilebilirliği | `OWNER_OPEN_ID` zorunlu kabul edildiği için container startup başarısız oldu. | Canlı siteye erişim kesilebilir. | Owner bildirim kimliğini startup zorunluluğundan çıkar; diğer gerçek runtime bağımlılıklarını koru; deployment health check yap. |
| Kritik | İçerik güveni | Yayındaki proje kayıtlarında `bvnmvnvngngchngvjh`, `vngchcnbcnbvcnbv` ve `asdasdnjjhjhjhjh` gibi anlamsız alanlar var. | Kurumsal güven, dönüşüm ve SEO kalite sinyalleri zarar görür. | Gerçek veriler doğrulanana kadar kayıtları taslak/inceleme durumuna al veya yönetim panelinde kullanıcı onayı iste; veri silme işlemi kullanıcı kararı olmadan yapılmamalı. |
| Kritik | Görsel-konu doğruluğu | Logo görseli bir bakım projesi gibi, elektrik görseli yakıt/sintine projesi gibi sunuluyor. | Ziyaretçiyi yanıltır; önce/sonra anlatısı güvenilirliğini kaybeder. | Her yayın öncesi görsel-konu eşleşmesi ve alt metin kontrolü ekle; gerçek saha görselleriyle kayıtları düzelt. |
| Yüksek | Form UX | Boş iletişim formu gönderiminde özel hata özeti/alan mesajları ilk tarayıcı gözleminde belirgin görünmedi; yalnızca form bölgesine kaydırma gerçekleşti. | Kullanıcı hangi alanı düzeltmesi gerektiğini anlayamayabilir. | `role=alert`, görünür alan hata metni, `aria-describedby` ve ilk hataya odaklanma davranışını gerçek tarayıcıda tekrar doğrula. |
| Yüksek | LCP algısı | Hizmetler hero görseli ilk ekran yakalamasında boş alan gibi göründü, bekleme sonrası yüklendi. | İlk izlenim ve algılanan performans zayıflar. | Görsel preload, doğru boyut/format, width-height oranı ve fetchpriority stratejisini ölçerek uygula. |
| Orta | SEO | Helmet ve server fallback metadata mevcut; sitemap lastmod dinamik içerikle iyileştirildi. Ancak kanonik alan adı hâlâ `www.perlamarine.com` varsayımına bağlı ve alan adı mevcut canlı yönlendirmesiyle ayrıca doğrulanmalı. | Search Console mülkü yanlış domaine bağlanabilir; indeksleme sinyalleri bölünebilir. | Domain DNS/HTTPS canonical hedefini kesinleştir; Search Console mülkü ve sitemap’i yalnızca doğrulanmış canonical domain için gönder. |
| Orta | SEO içerik kalitesi | Proje kayıtlarındaki anlamsız başlık/açıklamalar, teknik bilgi ve hizmet sayfalarındaki iyi metadata’yı aşağı çekiyor. | Düşük kaliteli sayfa sinyali ve düşük tıklama güveni. | İçerik kalite kontrolü, minimum anlamlı metin ve yayın öncesi editör onayı ekle. |
| Orta | Admin mimarisi | AdminProjects’te upload ve taslak mantığı custom hook’a ayrıldı; ancak ana sayfa ve form bileşenleri hâlâ yoğun JSX içeriyor. | Bakım maliyeti ve regresyon riski artar. | Form alanları, validation summary ve preview’ı alt bileşenlere ayır; hook’ları API/mutation sınırında tut. |

## Güvenlik durumu

CSP, nosniff, referrer policy, permissions policy, body limitleri, honeypot/rate limit, markdown sanitizasyonu ve admin/protected tRPC prosedürleri mevcut. Production debug collector public artifact’tan çıkarılmış ve yalnızca development Vite middleware’inde servis ediliyor. Env değerleri trim edilerek merkezi doğrulamaya bağlandı; ancak optional owner bildirim kimliğinin zorunlu tutulması deployment regresyonuna neden oldu ve kaldırıldı. Bundan sonra env doğrulama testleri, minimum gerekli runtime setini ve opsiyonel entegrasyonları ayrı sınıflandırmalı.

## Kullanılabilirlik doğrulama notları

Ana sayfa, Hakkımızda, Hizmetler, Projeler, Teknik Bilgiler ve İletişim rotaları tarayıcıda açıldı. Header logo, hero görseli, CTA’lar, telefon/e-posta/WhatsApp bağlantıları, footer politikaları ve mobil ana görünüm çalışır durumda. Hizmetler hero görseli ilk yakalamada gecikmeli görünse de sayfa bekletildiğinde render edildi. İletişim formu boş gönderim testi gerçek bir veri göndermeden yapıldı; görünür hata özetinin tekrar doğrulanması gerekiyor.

## Onay bekleyen aksiyon sırası

İlk olarak test içeriklerinin ve yanlış görsel eşleşmelerinin gerçek kayıtlar üzerinden temizlenmesi, ardından iletişim formu hata görünürlüğünün düzeltilmesi önerilir. Sonraki aşamada canonical domain kararı verilmeli ve Search Console/Analytics kurulumu bu karardan sonra yapılmalıdır. Bu rapor oluşturulurken Google entegrasyon maddeleri, kullanıcı talebi doğrultusunda bekleyen TODO olarak korunmuştur.
