# Kullanım Audit Ara Notları

Tarih: 2026-08-25

## Gerçek önizlemede görülen bulgular

Ana sayfa rotası açılıyor; header logosu, hero görseli, hizmet görselleri ve mobil menü ilk görünümde render ediliyor. Ana sayfa, Hakkımızda, Hizmetler, Projeler ve Teknik Bilgiler rotaları erişilebilir görünüyor.

Kritik içerik kalitesi sorunu: Son projeler bölümünde canlı veritabanından gelen kayıtların en az ikisinde kullanıcıya görünen başlık/açıklama alanları anlamsız test metinleri içeriyor. Örnekler: `bvnmvnvngngchngvjh`, `vngchcnbcnbvcnbv`, `asdasdnjjhjhjhjh`. Bu durum kurumsal güveni, SEO içerik kalitesini ve dönüşümü doğrudan zedeliyor.

Kritik medya doğrulama sorunu: Bazı proje kayıtlarında görsel ile proje konusu eşleşmiyor. Bir proje kartında logo görseli “bakım projesi” olarak kullanılmış; başka bir kartta elektrik servis görseli “yakıt ve sintine hatları” projesine bağlanmış. Önce/sonra eşleşmeleri teknik olarak açılıyor ancak gerçek saha bağlamını doğrulamayan içerikler yayınlanmış görünüyor.

UX notu: Ana sayfa interaktif öğeleri tarayıcı tarafından link, article/button ve slider olarak algılanıyor. “Tutarak sağa-sola sürükleyin” ipucu mevcut. Mobil ilk viewport’ta logo, hero görseli, CTA’lar ve güven bandı görünüyor.

İçerik aksiyonu: Admin paneline yayın öncesi içerik doğrulaması, minimum anlamlı başlık/açıklama kuralları, görsel-konu eşleşmesi kontrolü ve test kayıtlarının canlıdan kaldırılması eklenmeli. Mevcut kayıtlar kullanıcı onayı olmadan silinmemeli; önce taslak/inceleme durumuna alınması veya kullanıcıdan gerçek proje bilgisi istenmesi gerekir.

## İkinci tarayıcı gözlemi

`/hizmetler` rotasının gerçek ekran görüntüsünde, metin alanının sağındaki hero görsel alanı lacivert boş kalıyor. Sayfanın çıkarılmış HTML/Markdown içeriğinde `perla-service-electrical_bfa1b249.jpg` img kaydı mevcut olsa da görsel piksel olarak render edilmiyor. Bu, ana sayfadaki görsel düzeltmesinden farklı bir varlık/CSP/cache veya görsel yüklenme davranışı problemi olabilir ve kritik kullanım bulgusu olarak ayrıca doğrulanmalıdır. Hizmet kartlarının metin ve iletişim bağlantıları erişilebilir görünüyor.

## Hero görseli yeniden doğrulama

`/hizmetler` sayfası beklenerek tekrar görüntülendiğinde hero görseli doğru biçimde render edildi. İlk ekran görüntüsündeki lacivert boşluk kalıcı bir kırık URL/CSP hatası değil, görselin ilk tarayıcı yakalamasında henüz yüklenmemiş olmasıdır. Bununla birlikte LCP ve algılanan performans açısından bu gecikme ölçülmeli; ilgili görsel için preload veya boyut/format optimizasyonu değerlendirilebilir.

## İletişim formu boş gönderim gözlemi

Boş form gönderim denemesinde tarayıcı sayfanın form bölgesine kaydırıldı; ancak ekran çıkarımında alanların altında görünür özel hata metinleri veya üstte hata özeti belirginleşmedi. Native HTML doğrulama balonları tarayıcıya özgü olabilir, fakat erişilebilirlik ve kullanıcı deneyimi açısından hataların DOM içinde görünür `role=alert` mesajlarıyla doğrulanması gerekir. Bu bulgu kod ve gerçek ekran üzerinde ayrıca teyit edilmelidir; herhangi bir ileti gönderilmedi.

## Canlı sitemap gözlemi

Canlı `https://perlamarine-zbulf29n.manus.space/sitemap.xml` rotası HTTP ile erişilebilir ve XML geçerli görünüyor. Ancak tüm `<loc>` değerleri `https://www.perlamarine.com` alan adını kullanıyor; bu alan adının mevcut DNS/yönlendirme durumu Search Console gönderiminden önce kesinleştirilmeli. Sitemap üç proje URL’si ve üç teknik bilgi URL’si içeriyor. Yayındaki proje listesinde anlamsız slug olan `/projeler/bvnmvnvngngchngvjh` de yer alıyor; bu, içerik kalitesi ve indeksleme önceliği açısından kritik bir bulgu.

## Kalite filtresi sonrası doğrulama

Yeni public kalite filtresi ana sayfadaki anlamsız iki proje kaydını kaldırdı; ana sayfada yalnızca anlamlı `Yakıt ve sintine hatları` kaydı kaldı ve önce/sonra alanı da aynı kayıtla eşleşti. Geçersiz slug’a doğrudan gidildiğinde sayfa kalıcı hata/404 yerine kısa süreli `Proje yükleniyor…` görünümünde kaldı. Bu, veri görünürlüğünü durduruyor ancak kullanıcı deneyimi açısından geç yükleme/fallback metni ve uygun 404 metadata davranışı ayrıca iyileştirilebilir.
