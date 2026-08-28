# Perla Marine Ana Sayfa Analizi ve Güncel Web Teknolojileri Önerileri

**Hazırlayan:** Manus AI  
**Kapsam:** Mevcut ana sayfa deneyimi, tasarım şablonları, animasyon sistemi, performans, erişilebilirlik ve uygulanabilir teknoloji yol haritası.

## Yönetici özeti

Perla Marine ana sayfası bugün güçlü bir kurumsal temele sahip: lacivert–fildişi–altın renk dili tutarlı, hero mesajı hatırlanabilir, hizmetler teknik açıdan kapsamlı, proje alanı ve önce/sonra karşılaştırmaları güven oluşturmaya çalışıyor. Sayfa; hizmetler, projeler, önce/sonra, teknik bilgiler, SSS ve iletişim bölümleriyle eksiksiz bir bilgi mimarisine sahip.

Bununla birlikte ana sayfa, ziyaretçiye aynı anda çok sayıda bilgi sunduğu için **daha belirgin bir öncelik sırasına** ihtiyaç duyuyor. İlk hedef, Perla Marine’in “genel danışmanlık veren bir mühendislik firması” değil, **tekne ve yatlarda bakım, onarım, refit ve teknik servis uygulamaları yapan bir ekip** olduğunu ilk ekranda daha keskin biçimde anlatmak olmalı. İkinci hedef, yapılan işin kanıtını gerçek saha fotoğrafları, kapsam, uygulama ve sonuç bilgileriyle güçlendirmek olmalı.

Teknoloji açısından mevcut React 19, Vite 7, Tailwind CSS 4, Framer Motion 12, Wouter, tRPC ve Drizzle altyapısı yeni bir framework değişikliğini gerektirmiyor. En doğru yaklaşım; mevcut yapıyı koruyup **CSS scroll-driven animations, View Transition API için progressive enhancement, Motion’ın reduced-motion desteği, responsive image optimizasyonu ve içerik veritabanının daha görünür kullanımı** üzerine ilerlemektir.

## 1. Mevcut ana sayfanın ayrıntılı analizi

### 1.1. Güçlü taraflar

Hero bölümü, “Denizde güven, detaylarda başlar.” mesajıyla marka için uygun bir giriş sağlıyor. Büyük tekne görseli, düşük anahtarlı lacivert yüzey ve altın vurgu Perla Marine’in “sessiz kuvvet” fikrini taşıyor. Başlık kısa, akılda kalıcı ve premium bir algı oluşturuyor.

Hizmetler bölümü teknik kapsamı iyi anlatıyor. Kompozit çözümler, marin elektrik, marin elektroniği ve iklimlendirme gibi kartların görsel ve açıklama ile birlikte verilmesi, ziyaretçiye firmanın yalnızca tek bir uzmanlık alanına sıkışmadığını gösteriyor. Kartların detay pencereleri, ana sayfadan ayrılmadan daha fazla bilgi verme açısından doğru bir yaklaşım.

Projeler ve önce/sonra bölümleri sayfanın en değerli güven bileşenleri. Proje kartları ziyaretçiyi detay sayfasına taşıyor; slider kontrolleri hem fare hem klavye için kullanılabiliyor. Teknik bilgiler ve SSS bölümleri de ziyaretçinin karar vermeden önceki bilgi ihtiyacını destekliyor.

### 1.2. İyileştirilmesi gereken taraflar

İlk ekranda iki farklı davranış aynı anda teşvik ediliyor: “Hizmetleri keşfedin” ve “Teknenizi anlatın” yaklaşımı. Bu iki amaçtan biri ana CTA, diğeri ikincil CTA olarak açıkça ayrılmalı. Benim önerim, ana CTA’nın **“Hizmet kapsamını inceleyin”**, ikincil CTA’nın ise **“Teknenizi anlatın”** olmasıdır. WhatsApp sabit butonu korunabilir; hero içinde ayrıca tekrar edilmemelidir.

Güven göstergeleri görsel olarak iyi çalışıyor; ancak “10+ yıl deneyim”, “7/24 hizmet” ve “Orijinal parça” gibi ifadeler mümkün olduğunca doğrulanabilir açıklamalarla desteklenmeli. Özellikle 7/24 hizmet, gerçekten sürekli operasyon veya kesintisiz iletişim modeli yoksa “ihtiyaç halinde hızlı geri dönüş” gibi daha doğru bir dille ifade edilebilir.

Hizmetler bölümü kapsamlı olmasına rağmen ziyaretçinin ilk bakışta hangi hizmetten başlaması gerektiğini söylemiyor. Ana sayfada dört öncelikli alanı öne çıkarıp kalan hizmetleri “Tüm hizmetler” sayfasına bırakmak daha hızlı taranabilir bir yapı sağlar. Öncelikli dört alanın Marin Elektrik, Motor–Tahrik–Dümen, Mekanik Tesisat ve Kompozit Çözümler olması mantıklıdır; çünkü bunlar bakım-onarım algısını en güçlü taşıyan başlıklardır.

Projeler bölümünde başlık ve kısa açıklama var; fakat karar vermeyi kolaylaştıracak “sorun / uygulama / sonuç” özeti daha görünür olmalı. Gerçek saha verileri geldikçe her kartın altında şu üç kısa satır kullanılabilir: **Mevcut durum**, **Uygulanan kapsam**, **Bakım sonucu**. Doğrulanmamış süre, tasarruf veya performans iddiaları eklenmemelidir.

Önce/sonra slider’larında kontroller mevcut ve erişilebilir olsa da ilk kez gelen kullanıcıya slider’ın nasıl kullanılacağı açıkça söylenmiyor. Kart üstünde küçük bir “Sürükleyerek karşılaştırın” etiketi ve mobilde “Parmağınızla sağa-sola çekin” açıklaması etkileşimi artırır.

## 2. Önerilen tasarım şablonları

Perla Marine için hazır bir tema kopyalamak yerine üç yapısal şablonun güçlü taraflarını birleştirmek daha doğru olur. Böylece mevcut marka dili korunur ve site jenerik bir “marine template” görünümüne düşmez.

| Şablon yaklaşımı | Görsel karakter | Perla Marine’de kullanım | Değerlendirme |
|---|---|---|---|
| **Editorial Marine** | Büyük serif başlıklar, geniş görseller, bol boşluk ve kontrollü metin | Hero, Hakkımızda ve Teknik Bilgiler bölümleri | Marka prestijini ve uzmanlığı güçlendirir |
| **Case Study Refit** | Önce/sonra görselleri, kapsam etiketleri, sonuç odaklı proje kartları | Projeler ve ana sayfa saha çalışmaları | Gerçek iş kanıtını öne çıkarır |
| **Technical Command Center** | Sistem kartları, kısa veri etiketleri, ince çizgiler ve durum göstergeleri | Hizmetler, bakım süreci ve SSS | Teknik içeriği daha hızlı taranabilir yapar |

Önerilen nihai yapı, **Editorial Marine + Case Study Refit** ağırlıklı olmalı; Technical Command Center yaklaşımı ise yalnızca bilgi yoğun bölümlerde kullanılmalı. Her bölümü kart, çizgi ve etiketlerle doldurmak sayfanın premium boşluk duygusunu zayıflatabilir.

### Önerilen ana sayfa sırası

Hero bölümünden hemen sonra dört güven göstergesi korunmalı. Ardından ziyaretçiyi “hangi konuda yardımcı olabiliriz?” sorusuna taşıyan dört öncelikli hizmet alanı gelmeli. Bu bölümden sonra kısa bir bakım süreci akışı yer almalı: **Mevcut durumu anlarız → Kapsamı netleştiririz → Uygulamayı planlarız → Sonucu teslim ederiz.**

Süreç akışından sonra projeler ve önce/sonra bölümleri gelmeli. Teknik bilgiler ve SSS, bu kanıt bölümlerinin ardından konumlandırılmalı. Son bölümde tek bir güçlü iletişim çağrısı kullanılmalı. Böylece ana sayfa “hizmet → süreç → kanıt → bilgi → iletişim” mantığıyla ilerler.

## 3. Önerilen animasyon sistemi

Animasyonlar Perla Marine’de dikkat çekmek için değil, **teknik içeriğin anlaşılmasını ve bölüm geçişlerinin hissedilmesini sağlamak** için kullanılmalı. Büyük ve sürekli hareketler premium algıyı zayıflatabilir.

### Hero animasyonu

Hero görseli sayfa açılırken çok hafif bir opacity ve scale geçişiyle görünmeli. Başlık ve alt metin aynı anda değil, yaklaşık 60–80 milisaniyelik küçük aralıklarla ortaya çıkabilir. Arka plan görseline sürekli parallax uygulanması yerine, masaüstünde sınırlı ve mobilde kapalı bir hareket tercih edilmeli.

### Hizmet kartları

Kart üzerine gelindiğinde görselin 1.02–1.04 oranında büyümesi, başlık ile kısa açıklamanın çok hafif kontrast değişimi ve altın çizginin genişlemesi yeterli olur. Kartların tamamını sürekli hareket ettiren animasyonlardan kaçınılmalı. Açılan detay penceresinde opacity ve küçük bir scale geçişi kullanılabilir.

### Scroll-driven animasyonlar

Bölüm başlıklarının ve ince rota çizgilerinin scroll konumuna bağlı olarak görünmesi için CSS scroll-driven animations değerlendirilebilir. MDN, bu modülün animasyon değerlerini zaman yerine scroll tabanlı bir timeline’a bağladığını ve `scroll()` ile `view()` fonksiyonlarının kullanılabildiğini açıklıyor.[2] Bu yaklaşım; basit reveal, progress çizgisi ve bölüm işaretleri için JavaScript scroll listener’larına göre daha sade bir seçenek sunar.

### View Transition geçişleri

Projeler, Teknik Bilgiler ve Hizmetler gibi route değişimlerinde desteklenen tarayıcılarda View Transition API progressive enhancement olarak eklenebilir. MDN’ye göre API, SPA içinde DOM durumları arasındaki geçişleri ve MPA navigasyonlarını animasyonlamak için kullanılabilir.[3] Wouter’ın mevcut yapısı nedeniyle bu özellik zorunlu bir router değişimi olarak değil, destek varsa çalışan küçük bir yardımcı katman olarak uygulanmalıdır. Desteklenmeyen tarayıcılarda normal navigasyon devam etmelidir.

### Önce/sonra slider

Mevcut slider davranışı korunmalı; ancak handle üzerinde daha belirgin bir tutma alanı, kart üzerinde kısa kullanım ipucu ve sürükleme sırasında ince altın vurgu eklenmeli. Slider’ı otomatik hareket ettirmek önerilmez. Bu etkileşim ziyaretçinin kontrolünde kaldığında teknik karşılaştırma daha güvenilir hissedilir.

### Erişilebilirlik kuralı

Motion.dev, `reducedMotion="user"` veya `useReducedMotion()` ile cihazın hareket azaltma tercihini izlemeyi; transform ve layout animasyonlarını kapatıp opacity gibi daha düşük riskli geçişleri korumayı öneriyor.[4] Perla Marine’de tüm reveal, parallax, modal ve slider animasyonları bu tercihe uymalıdır. Hareket azaltma açıkken hero parallax kapatılmalı, kart animasyonları sadeleşmeli ve içerik doğrudan görünür olmalıdır.

## 4. Kullanılabilecek güncel teknolojiler

| Teknoloji | Kullanım önerisi | Öncelik |
|---|---|---|
| **CSS Scroll-Driven Animations** | Bölüm reveal’leri, progress çizgileri ve rota çizimleri | Yüksek |
| **View Transition API** | SPA route geçişleri için progressive enhancement | Orta |
| **Framer Motion / Motion** | Modal, kart, lightbox ve kontrollü layout animasyonları | Yüksek; zaten mevcut |
| **`picture` + `srcset` + AVIF/WebP** | Hero ve servis görsellerini ekran boyutuna göre sunmak | Çok yüksek |
| **`loading="lazy"`** | İlk viewport dışındaki servis ve proje görselleri | Çok yüksek |
| **`fetchpriority="high"`** | Yalnızca ilk hero/LCP görseli | Yüksek |
| **`content-visibility: auto`** | Uzun ana sayfanın aşağıdaki bölümlerini daha verimli render etmek | Orta |
| **IntersectionObserver** | Scroll-driven CSS’in desteklenmediği davranışlar için fallback reveal | Orta |
| **Wouter route helper** | View Transition destek katmanı ve route değişimlerinde scroll yönetimi | Orta |

web.dev, viewport dışındaki görseller için native `loading="lazy"`, ilk viewport ve özellikle LCP görseli için eager yükleme yaklaşımını öneriyor.[5] Aynı kaynak, görsellerde width/height veya sabit boyut/aspect-ratio tanımlamanın layout shift riskini azalttığını belirtiyor.[5] Mevcut ana sayfa çok sayıda tekne görseli kullandığı için bu optimizasyon, yeni animasyon eklemekten daha yüksek ticari değer üretebilir.

Core Web Vitals tarafında hedefler LCP için 2.5 saniye veya daha iyi, INP için 200 milisaniye veya daha iyi ve CLS için 0.1 veya daha düşük olmalıdır.[1] Bu değerler Perla Marine için yalnızca teknik hedef değil, özellikle mobil marina bağlantılarında kullanıcı deneyimi hedefi olarak ele alınmalıdır.

## 5. Performans ve SEO önerileri

Hero görseli ilk viewport’un en büyük görseli olduğu için responsive boyutlarda sunulmalı ve yalnızca bu görsel yüksek öncelikli yüklenmelidir. Altındaki hizmet, proje ve teknik bilgi görselleri lazy-load edilmeli; her görsel için doğru aspect-ratio ayrılmalıdır. Bu, sayfanın toplam görsel ağırlığını düşürür ve CLS riskini azaltır.

Ana sayfanın içerik metni, “tekne ve yat bakım-onarım”, “marin elektrik”, “motor ve tahrik bakımı”, “mekanik tesisat”, “kompozit tamir” ve “refit” gibi arama niyeti yüksek ifadeleri doğal biçimde içermeli. Ancak her bölümde aynı “bize ulaşın” çağrısının tekrarlanması yerine içerik ile CTA arasında daha güçlü bağ kurulmalı.

Teknik Bilgiler içeriklerinin her biri için SEO başlığı, meta açıklama, kapak görseli, kategori ve yayın tarihi alanları ileride admin paneline eklenebilir. Bu alanlar, ana sayfanın içerik sistemini yalnızca görsel bir blog alanı olmaktan çıkarıp organik arama giriş noktalarına dönüştürür.

## 6. Önceliklendirilmiş uygulama planı

### Faz A — Yüksek değerli, düşük riskli iyileştirmeler

Hero CTA hiyerarşisi netleştirilmeli, slider kullanım ipucu eklenmeli, hizmet kartları dört öncelikli kategoriye göre yeniden gruplanmalı ve ana sayfada admin panelinden seçilen öne çıkan teknik içerikler kapak görselleriyle gösterilmelidir. Bu faz görsel dili değiştirmeden anlaşılabilirliği artırır.

### Faz B — Performans ve erişilebilirlik temeli

Hero için responsive image, doğru fetch priority, viewport dışı görseller için lazy loading, tüm görsellerde boyut/aspect-ratio ve reduced-motion kontrolleri uygulanmalıdır. Bu faz animasyon eklemeden önce yapılmalıdır; çünkü hızlı ve stabil bir sayfa premium algının temelidir.

### Faz C — Kontrollü animasyon sistemi

Hizmet kartı hover’ları, bölüm reveal’leri, modal geçişleri ve lightbox hareketleri ortak easing ve süre token’larıyla standardize edilmelidir. Sonra scroll-driven CSS ile yalnızca rota çizgileri, progress göstergeleri ve bölüm başlıkları canlandırılmalıdır. Parallax ve ağır WebGL bu aşamada önerilmez.

### Faz D — Route ve içerik deneyimi

Desteklenen tarayıcılarda View Transition API ile sayfa geçişleri test edilmeli; desteklenmeyen ortamlarda normal Wouter navigasyonu korunmalıdır. Teknik içeriklere SEO alanları ve proje detaylarına gerçek saha ölçümleri eklendikçe ana sayfa daha güçlü bir referans merkezi haline gelir.

## Sonuç

Perla Marine ana sayfasının temel problemi tasarım kalitesinin düşük olması değil, **mevcut güçlü parçaların daha net bir ticari hikâyeye bağlanması**dır. Yeni bir tema veya ağır bir 3D teknoloji yerine; bakım-onarım konumlandırmasının netleştirilmesi, gerçek proje kanıtının güçlendirilmesi, görsel performansının iyileştirilmesi ve kontrollü scroll/micro-interaction sistemi kurulması daha doğru yatırım olur.

Benim önerdiğim nihai tasarım formülü şudur: **Editorial Marine görünümü + Case Study Refit kanıtı + sınırlı Technical Command Center bilgisi + performans öncelikli animasyon sistemi.** Bu yaklaşım Perla Marine’in mevcut Sessiz Kuvvet kimliğini korurken ana sayfayı daha çağdaş, daha hızlı ve daha ikna edici hale getirir.

## Kaynaklar

[1]: https://web.dev/articles/vitals "Web.dev — Web Vitals"
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations "MDN — CSS scroll-driven animations"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API "MDN — View Transition API"
[4]: https://motion.dev/docs/react-accessibility "Motion — Create accessible animations in React"
[5]: https://web.dev/articles/browser-level-image-lazy-loading "Web.dev — Browser-level image lazy loading for the web"
