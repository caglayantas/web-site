
# Ana Sayfa Analiz Notları

Mevcut canlı ana sayfa; hero, dört güven göstergesi, dört öne çıkan hizmet kartı, üç proje kartı, üç önce/sonra slider kartı, teknik bilgiler, SSS ve iletişim CTA bölümlerinden oluşuyor. Navigasyon net; proje ve teknik bilgi içerikleri veritabanından besleniyor. Önce/sonra kontrolleri erişilebilir aria etiketleri ve klavye slider düğmesiyle görünür durumda. Hero mesajı güçlü ve Sessiz Kuvvet görsel dili tutarlı; ancak üst bölümde bakım-onarım/refit konumlandırması ile WhatsApp/iletişim aksiyonu arasında daha belirgin bir önceliklendirme yapılabilir.

Browser incelemesinde ana sayfanın içerik akışı uzun fakat anlaşılır; hizmetler ve projeler görsel olarak güçlü, SSS ve teknik bilgiler güven oluşturuyor. En önemli UX fırsatları; gerçek saha kanıtını ve proje sonuçlarını daha görünür yapmak, slider kullanım ipucunu eklemek, hizmetleri daha hızlı taranabilir hale getirmek ve hero görseli için LCP/format optimizasyonu.

Resmi web kaynakları: web.dev Core Web Vitals iyi deneyim için LCP’nin 2.5 saniye içinde, INP’nin 200 ms veya altında ve CLS’nin 0.1 veya altında olmasını öneriyor. MDN scroll-driven animations dokümanı `scroll()`/`view()` timeline’larıyla scroll konumuna bağlı animasyonların CSS/Web Animations API üzerinden yapılabildiğini açıklıyor. MDN View Transition API dokümanı SPA’de DOM durumları arasında ve MPA navigasyonlarında animasyonlu geçişler için `document.startViewTransition()` yaklaşımını açıklıyor.


Motion.dev erişilebilirlik rehberi, `reducedMotion="user"` veya `useReducedMotion()` ile kullanıcı cihaz tercihlerine göre transform/layout animasyonlarını kapatmayı; opacity gibi düşük riskli geçişleri korumayı öneriyor. Parallax ve autoplay video reduced-motion kullanıcılarında devre dışı bırakılmalı. Bu, Perla Marine’de hero/parallax ve kart reveal animasyonlarının temel kuralı olmalı.


web.dev görsel yükleme rehberi; viewport dışı görsellerde native `loading="lazy"`, ilk viewport/LCP görselinde eager yükleme ve kritik hero görselinde `fetchpriority="high"` kullanılmasını öneriyor. Tüm görsellere width/height veya sabit aspect-ratio verilmesi CLS riskini azaltıyor. Responsive `picture/srcset` ve WebP/AVIF kullanımı ana sayfanın görsel ağırlığı için uygun.
