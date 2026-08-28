# Perla Marine Teknik Mimari Denetim Raporu

**Denetim kapsamı:** production debug çıktıları, ortam değişkenleri, tRPC yetkilendirme middleware’i, admin bileşen mimarisi, dinamik SEO/head yönetimi, sitemap otomasyonu ve Vite code-splitting.

**Sonuç:** Projede temel güvenlik ve route-level code-splitting uygulanmış durumda; ancak production’a ait olmayan debug varlığının dağıtıma kopyalanması, ortam değişkenlerinin çalışma zamanında zorunlu doğrulanmaması, route metadata kapsamının kısmi kalması ve ana JavaScript paketinin hâlâ büyük olması düzeltilmesi gereken başlıca konulardır. Bu denetimde kod değişikliği yapılmamıştır.

## Önceliklendirilmiş özet

| Öncelik | Alan | Bulgular | Etki | Önerilen durum |
|---|---|---|---|---|
| **Yüksek** | Production güvenliği | `dist/public/__manus__/debug-collector.js` production build içine kopyalanıyor ve canlı URL’den 200 ile erişilebiliyor. HTML’e production’da enjekte edilmiyor; fakat dosya hâlâ dağıtılıyor. | Gereksiz client-side gözlemleme kodu, saldırı yüzeyi ve dağıtım hijyeni riski. | Production build’den tamamen çıkarılmalı; yalnızca development Vite plugin’i ve dosya akışı korunmalı. |
| **Yüksek** | Environment güvenliği | `server/_core/env.ts` kritik değerleri boş string varsayılanlarıyla kabul ediyor; production zorunlu env doğrulaması yok. | Eksik/yanlış konfigürasyon uygulamanın hatalı veya kısmen çalışır biçimde başlamasına yol açabilir. | Production başlangıcında şema tabanlı zorunlu doğrulama ve güvenli hata mesajı eklenmeli. |
| **Orta-Yüksek** | SEO alan adı ve sitemap | Sitemap `https://www.perlamarine.com` alan adına sabitlenmiş; mevcut yayın alanı `perlamarine-zbulf29n.manus.space`. Önceki HTTP kontrolünde perlamarine.com, Squarespace üzerindeki `www.perlamarin.com` adresine yönleniyordu. | Google yanlış/redirect olan URL’leri keşfedebilir; canonical, sitemap ve gerçek yayın alanı birbiriyle çelişebilir. | Önce tek kanonik yayın alanı kesinleştirilmeli, sonra sitemap/canonical/OG URL’leri aynı alan adına alınmalı. |
| **Orta** | SEO head yönetimi | `react-helmet-async` kullanılmıyor. Mevcut yaklaşım `document` manipülasyonu ve server-side string replacement ile çalışıyor. Route title/description/canonical/OG title/description kısmen güncelleniyor; OG URL, OG image, Twitter alanları ve JSON-LD route bazında server-side tam güncellenmiyor. | Crawler için temel metadata var; sosyal paylaşım ve dinamik detay sayfalarında route-specific metadata eksik kalabilir. | Ya mevcut server metadata katmanı tüm alanları kapsayacak şekilde tamamlanmalı ya da request-safe Helmet/SSR mimarisine geçilmeli. |
| **Orta** | Kod mimarisi | `AdminProjects.tsx` 219 satır; form state’i, doğrulama, slug üretimi, taslak kaydı, upload mutation’ı, önizleme ve özet ekranı aynı dosyada. | Bakım maliyeti ve test izolasyonu artıyor; yeni içerik alanları eklenirken regresyon riski yükseliyor. | `useProjectEditor`, `useProjectDraft`, `useImageUpload` gibi hook’lar ve ayrı panel/field bileşenleri çıkarılmalı. |
| **Orta** | Bundle performansı | Route-level `lazy()` kullanılıyor; ancak production build’de ana chunk yaklaşık **778.73 kB**, gzip yaklaşık **220.96 kB** ve Vite 500 kB üstü chunk uyarısı veriyor. `vite.config.ts` içinde `manualChunks` veya vendor ayrıştırması yok. | İlk JavaScript yükü ve parse/execute maliyeti artıyor; özellikle mobil LCP/INP etkilenebilir. | Route split korunmalı; ağır vendor’lar, animasyon, ikon ve grafik bağımlılıkları kontrollü manual chunk’lara ayrılmalı. |
| **Düşük-Orta** | LCP preload | Hero preload etiketi `type="image/jpeg"` belirtiyor; storage yanıtı ise aynı varlık için `image/webp` dönüyor. | Tarayıcı preload’u MIME uyumsuzluğu nedeniyle beklenen ölçüde kullanmayabilir. | Preload MIME değeri gerçek yanıtla hizalanmalı veya canonical WebP URL’si kullanılmalı. |

## Debug script denetimi

`vite.config.ts` içindeki `vitePluginManusDebugCollector()` doğru biçimde `NODE_ENV === "production"` durumunda HTML’e script tag’i eklemiyor. Ancak debug dosyası `client/public/__manus__/debug-collector.js` altında bulunduğu için Vite bunu statik public asset olarak `dist/public/__manus__/debug-collector.js` konumuna kopyalıyor. Build çıktısındaki dosya 25.168 byte boyutunda ve canlı URL’den erişilebilir durumda.

Bu durum, “çalıştırılmıyor” ile “canlı derlemeden çıkarıldı” arasındaki farktır. Kullanıcı talebi açısından sorun devam ediyor: debug collector production artifact içinde yer alıyor. Dosyanın production’a kopyalanmasını engellemek için public varlık konumu build kapsamı dışında tutulmalı veya production build sırasında güvenli bir şekilde filtrelenmelidir. Debug collector endpoint’i production’da gerçek bir log alıcısı olarak register edilmiyor; bu olumlu bir nokta olmakla birlikte dosyanın dağıtılmasına gerekçe oluşturmaz.

## Ortam değişkenleri denetimi

`server/_core/env.ts` yalnızca sınırlı bir env nesnesi sunuyor ve değerleri `?? ""` ile varsayılanlaştırıyor. `DATABASE_URL`, `JWT_SECRET`, OAuth ve Forge değerlerinin production’da mevcut ve biçimsel olarak doğru olduğu başlangıçta doğrulanmıyor. Ayrıca kaynak kodunda farklı `process.env` okumaları doğrudan bulunuyor; bu, tek bir env sözleşmesinin zaman içinde dağılmasına yol açabilir.

Client tarafında kullanılan `VITE_*` değerleri build sırasında tarayıcı bundle’ına gömülür. Vite dokümantasyonu, `VITE_*` değişkenlerinin client’a açıkça taşındığını ve hassas bilgilerin bu prefix ile tutulmaması gerektiğini belirtir [1]. Bu nedenle `VITE_FRONTEND_FORGE_API_KEY` yalnızca gerçekten frontend için kısıtlanmış/public-scope bir anahtarsa kullanılmalı; server-only `BUILT_IN_FORGE_API_KEY` kesinlikle client import zincirine girmemelidir. Mevcut kod taramasında server Forge anahtarı client kaynaklarında kullanılmıyor; bu olumlu bir sonuçtur.

Önerilen sıkılaştırma, production’da zorunlu değişkenleri Zod benzeri bir şema ile doğrulamak, biçimsel hatalarda secret değerlerini loglamadan süreci durdurmak ve client için izin verilen public env isimlerini ayrıca belgelemektir. `.env` dosyalarının repository’ye girmemesi için mevcut ignore kuralları korunmalıdır.

## tRPC yetkilendirme denetimi

Mevcut middleware yapısı temel olarak doğru kurulmuş:

| Kontrol | Gözlem |
|---|---|
| Kimlik doğrulama | `requireUser`, `ctx.user` yoksa `UNAUTHORIZED` döndürüyor. |
| Admin yetkisi | `adminProcedure`, `ctx.user.role !== 'admin'` durumunda `FORBIDDEN` döndürüyor. |
| Admin kapsamı | Proje, FAQ ve Knowledge Base admin list/create/update/remove/upload/preview prosedürleri `adminProcedure` ile korunuyor. |
| Public kapsam | Yayınlanmış içerik sorguları public; iletişim formu public kalmak zorunda ve honeypot/rate limit içeriyor. |
| Context | `createContext` her request’te kullanıcıyı çözmeye çalışıyor; başarısız auth sonucu anonim context olarak devam ediyor. |

Bu yapı tRPC’nin middleware tabanlı authorization modeline uygundur [2] [3]. İncelenen router’da doğrudan bir admin yetki bypass’ı görülmedi. Bununla birlikte `protectedProcedure` tanımlı olmasına rağmen mevcut router kullanımında admin dışı protected bir prosedür görünmüyor; ileride kullanıcıya özel yeni prosedürler eklenirken bu middleware’in kullanılması gerekir.

En belirgin eksik, yetkilendirmenin yalnızca kaynak metin testleriyle değil, request context seviyesinde otomatik testlerle kanıtlanmasıdır. Anonim kullanıcının admin list/create/update/remove/upload/preview çağrılarında reddedildiği ve authenticated non-admin kullanıcının `FORBIDDEN` aldığı testler eklenmelidir. `createContext` içindeki geniş `catch` bloğu public endpoint’ler için güvenli bir fail-closed davranış sağlıyor; ancak auth altyapısı arızalarını gözlemlemek için secret içermeyen kontrollü bir server log/metric eklenebilir.

## Kod mimarisi ve refactoring denetimi

`AdminProjects.tsx` içinde küçük görsel parçalar mevcut olsa da iş mantığı ile UI aynı dosyada kalmış durumda. Dosya; `ProjectForm` modeli, slug üretimi, hata normalizasyonu, otomatik taslak kaydı, form doğrulama, upload mutation’ı, sürükle-bırak dosya işleme, canlı önizleme, kaydedilen proje özeti ve ana liste ekranını birlikte yönetiyor.

Önerilen bölme şu sınırlar üzerinden yapılmalı:

| Yeni modül | Sorumluluk |
|---|---|
| `hooks/useProjectEditor.ts` | Form state, slug senkronizasyonu, karakter sayaçları, doğrulama ve mutation çağrıları. |
| `hooks/useProjectDraft.ts` | Local draft yükleme/kaydetme/temizleme ve debounce zamanlaması. |
| `hooks/useImageUpload.ts` | Dosya türü/boyutu, önizleme, crop/WebP akışı ve upload hata durumu. |
| `components/admin/ProjectFormPanel.tsx` | Form alanları ve alan bazlı hata odağı. |
| `components/admin/ProjectLivePreview.tsx` | Taslak kart ve görsel önizleme. |
| `components/admin/SavedProjectSummary.tsx` | Başarı özeti ve canlı önizleme bağlantısı. |

Bu refactoring işlevsel bir güvenlik açığı değildir; fakat admin panelinin büyümesi halinde yüksek regresyon potansiyeline sahip bir bakım riskidir. `AdminKnowledge.tsx` ve `AdminFAQ.tsx` kısa delegasyon dosyaları olduğundan öncelik `AdminProjects.tsx` olmalıdır.

## SEO ve metadata denetimi

Sitede SEO için güçlü bir temel mevcut: `client/index.html` içinde title, description, canonical, Open Graph, Twitter, Organization/WebSite JSON-LD ve crawler fallback’i bulunuyor; `server/_core/vite.ts` ve production static fallback route metadata’yı route’a göre title, description, canonical, OG title ve OG description seviyesinde güncelliyor.

Ancak dinamik kapsam tam değil. `client/src/pages/CorporatePages.tsx`, `KnowledgePost.tsx`, `ProjectDetail.tsx` ve `ServiceFAQ.tsx` içinde `document.title` ve bazı meta elementleri client-side değiştiriliyor. `KnowledgePost` ve `ProjectDetail` JSON-LD’yi hydration sonrasında ekliyor. Server-side crawler response’unda route-specific OG image, Twitter image/title/description, `og:url` ve detay sayfasına özgü JSON-LD aynı kapsamda üretilmiyor.

`react-helmet-async` paketinin bulunmaması tek başına runtime hatası değildir. Mevcut server string replacement yaklaşımı da çalışabilir. Fakat kullanıcı gereksinimi özellikle Helmet yönündeyse, doğrudan paketi eklemek yerine önce request başına güvenli head üretim stratejisi belirlenmelidir; aksi halde client-only Helmet kullanımı sosyal crawler sorununu çözmeyebilir. Alternatif ve daha düşük riskli yol, mevcut `routeMetadata` modelini genişletip her route için OG/Twitter/JSON-LD alanlarını server response’unda tamamlamaktır. `react-helmet-async`, asynchronous server render senaryolarında head verisini request bazında kapsüllemek için kullanılan bir çözümdür [5].

## Sitemap ve arama motoruna bildirim denetimi

`server/sitemap.ts` dinamik olarak yayınlanmış Knowledge Base yazılarını ve projeleri veritabanından çekiyor; statik rotalarla birleştiriyor, tekrarları kaldırıyor ve Express üzerinden `/sitemap.xml` olarak servis ediyor. Bu bölüm işlevsel olarak otomatik durumdadır. `robots.txt` de sitemap adresini bildiriyor.

Bununla birlikte üç düzeltme gereklidir. Birincisi, `SITE_URL` sabitinin gerçek kanonik yayın alanıyla eşleşmesi gerekir. İkincisi, statik rotalarda her request’te `new Date()` kullanılması sabit sayfaların `lastmod` değerini gereksiz yere sürekli değiştirir. Üçüncüsü, robots.txt içinde sitemap URL’si bulunması ile Search Console Sitemaps raporuna gönderim aynı şey değildir. Google, gönderilen sitemap’lerin durum ve hata geçmişini Search Console veya API üzerinden takip eder [4]. Gerçek Search Console gönderimi için doğrulanmış alan adı mülkü ve Google hesabı/API erişimi gerekir.

## Code-splitting ve bundle denetimi

`client/src/App.tsx` route-level `lazy()` ve `Suspense` kullanıyor; Hakkımızda, Hizmetler, Projeler, Teknik Bilgiler, proje detayı, Knowledge post ve admin sayfalarının büyük bölümü ayrı async chunk’lara ayrılmış. Bu nedenle “hiç code-splitting yok” bulgusu doğru değildir.

Ancak production build ölçümü ana chunk’ın hâlâ büyük olduğunu gösteriyor: yaklaşık 778.73 kB minified ve 220.96 kB gzip. Vite ayrıca 500 kB üzeri chunk uyarısı veriyor. `Home`, `NotFound`, `ServiceFAQ`, `Legal` ve bazı global bileşenler başlangıç bundle’ında kalıyor; ayrıca `vite.config.ts` içinde vendor manual chunk stratejisi bulunmuyor.

İyileştirme sırası; önce home initial path’te gerçekten kullanılmayan ağır bağımlılıkları ayırmak, sonra vendor chunk’larını (`react`, `framer-motion`, ikonlar ve ağır UI paketleri) ölçerek bölmek, ardından gerçek RUM/Core Web Vitals verisiyle doğrulamak olmalıdır. Sırf dosya sayısını artırmak her zaman performans kazancı sağlamaz; ölçüm sonrası ayrıştırma yapılmalıdır.

## Önerilen uygulama sırası

| Aşama | İş | Gerekçe |
|---|---|---|
| 1 | Debug collector’ı production artifact’ından çıkarmak ve build assertion eklemek. | En net production güvenlik/hijyen açığı. |
| 2 | Production env şeması ve public/server env ayrımı. | Yanlış konfigürasyonu erken durdurur; secret sızıntısı riskini azaltır. |
| 3 | Kanonik alan adını kesinleştirip sitemap/canonical/OG URL’lerini hizalamak. | Arama motoru sinyallerinin bölünmesini önler. |
| 4 | AdminProjects hook/component refactoring’i. | Yeni admin özelliklerinde bakım ve test maliyetini düşürür. |
| 5 | Server-side metadata kapsamını tamamlamak; Helmet kullanımı için SSR kararı vermek. | Dinamik sosyal paylaşım ve crawler görünürlüğünü güçlendirir. |
| 6 | Bundle analizinden sonra manual chunk ve preload MIME düzeltmesi. | Mobil başlangıç yükünü ölçülebilir biçimde azaltır. |
| 7 | Auth boundary integration testleri. | Admin prosedürlerinin gerçek context ile korunmasını kanıtlar. |

**Denetim kararı:** Kritik tespit production debug asset’ının dağıtımda kalmasıdır. Yetkilendirme middleware’i genel olarak doğru görünmektedir; ancak integration test kapsamı artırılmalıdır. Sitemap ve dinamik metadata altyapısı mevcut olmakla birlikte kanonik alan adı ve route-specific sosyal metadata açısından tamamlanmamıştır. Code-splitting uygulanmış, fakat ana bundle için ikinci optimizasyon turu gereklidir.

## Kaynaklar

[1]: https://vite.dev/guide/env-and-mode "Vite — Env Variables and Modes"
[2]: https://trpc.io/docs/server/authorization "tRPC — Authorization"
[3]: https://trpc.io/docs/server/middlewares "tRPC — Middlewares"
[4]: https://support.google.com/webmasters/answer/7451001 "Google Search Console — Sitemaps report"
[5]: https://www.npmjs.com/package/react-helmet-async "react-helmet-async package documentation"
