# Perla Marine Baştan Tasarım Doğrulama Kaydı

## Bağlantı hedefleri

Header sırası; Ana Sayfa (`https://www.perlamarine.com/`), Hakkımızda (`/hakkimizda`), Hizmetler (`/hizmetler`), Blog (`/blog`), Bize ulaşın (`/iletisim`) ve Translate (Google Translate üzerinden İngilizce görünüm) şeklindedir. Header logosu Ana Sayfa’ya gider. Mobil menü aynı hedefleri ve Translate bağlantısını tekrar eder.

Footer’da Hakkımızda, Hizmetler, Blog, Bize ulaşın, telefon, e-posta ve Instagram bağlantıları vardır. Ana Sayfa’da hero hizmet bağlantısı ve Hizmetler bölümüne iç anchor, tüm hizmetler bağlantısı, Blog bağlantısı, üç konu anchor’ı ve Bize ulaşın bağlantısı vardır. Ana rotalar `/`, `/hakkimizda`, `/hizmetler`, `/blog` ve `/iletisim` için yerel HTTP kontrolleri 200 sonucunu vermiştir.

## Klavye ve erişilebilirlik

DOM sırasına göre skip-link, logo, masaüstü navigasyon bağlantıları, iletişim/Translate bağlantıları ve mobil menü düğmesi erişilebilir etkileşim sırasındadır. Mobil menü düğmesinde `aria-label` ve `aria-expanded`; navigasyonlarda `aria-label`; logo, hero ve hizmet görsellerinde anlamlı `alt` metinleri bulunur. `a`, `button`, form alanları ve seçilebilir kontroller için görünür altın `:focus-visible` halkası uygulanmıştır.

## Kontrast kontrolü

| Ön plan | Arka plan | Oran |
|---|---|---:|
| `#FFFDF8` | `#041F3D` | 16.28:1 |
| `#E0BF7B` | `#041F3D` | 9.39:1 |
| `#073A6B` | `#FFFDF8` | 11.31:1 |
| `#546373` | `#FFFDF8` | 6.06:1 |
| `#C79B48` | `#041F3D` | 6.47:1 |

Masaüstü ve mobil ekran görüntüleri ana rotaların tamamı için alınmış; TypeScript ve Vitest kontrolleri başarılı olmuştur.

## Mobil menü odak akışı

Mobil menü düğmesi `aria-controls="mobile-navigation"` ile menüyü tanımlar. Menü açıldığında ilk Ana Sayfa bağlantısı programatik olarak odaklanır; Tab sırası Hakkımızda, Hizmetler, Blog, Bize ulaşın ve Translate bağlantıları üzerinden ilerler. Escape tuşu menüyü kapatır ve odak menü düğmesine geri verilir. Tüm bu etkileşimli öğeler ortak `:focus-visible` altın halkasıyla görünür odak durumuna sahiptir. TypeScript kontrolü, Vitest ve ana rota HTTP kontrolleri son Header güncellemesinden sonra yeniden başarılıdır.

## Gerçek tarayıcı klavye testi

Chromium headless testi 390×844 mobil görünümde çalıştırıldı. Menü düğmesi odaklandı; Enter sonrası ilk odak `Ana Sayfa` bağlantısına geçti. Sonraki Tab sırası `Hakkımızda`, `Hizmetler`, `Blog`, `Bize ulaşın`, `Translate` ve ardından hero CTA oldu. Escape sonrası menü `aria-expanded=false` durumunda kapandı ve odak menü düğmesine geri döndü. Menüyü kapattıktan sonra Shift+Tab ile odak Perla Marine logo bağlantısına geçti. 1280×720 görünümde Translate bağlantısı görünür bulundu ve Google Translate hedef URL’si doğrulandı.

## Rakip analiz uygulaması — iletişim formu fallback doğrulaması

16 Ağustos 2026 tarihinde güncel geliştirme önizlemesindeki `/iletisim` rotasında gerçek tarayıcı etkileşimiyle test yapıldı. Ad, e-posta, telefon, tekne/proje, tekne tipi, konum/marina, hizmet kategorisi ve mesaj alanları dolduruldu; kategori seçildi, KVKK onayı işaretlendi ve form gönderildi. Gönderim sonrası `role="status"` alanı görünür oldu. Sunucu taraflı e-posta servisi yapılandırılmadığı açıkça belirtildi; e-posta taslağı bağlantısı ve WhatsApp bağlantısı görünür alternatifler olarak sunuldu. Telefon ve e-posta bilgileri form altında korundu. Bu testte gerçek e-posta gönderilmedi.

## Manuel görsel editör yorumları — doğrulama

Footer’da beyaz kontrastlı logo, yasal bağlantı grubu, yalnızca büyütülmüş Instagram ikonu ve sağ hizalı telif satırı masaüstü ve mobil ekranlarda doğrulandı. Header’da Bize Ulaşın yanında Instagram ikon bağlantısı masaüstünde, mobil menü içinde erişilebilir metinli ikon bağlantısı olarak görünüyor. Ana sayfada dört maddeli güven bandı, tekne sahipleri ve üretici firmaları kapsayan Blog başlığı, ihtiyacı dinleme/çözüm bulma iletişim metni ve 7/24 mobil hizmet ifadesi görsel olarak doğrulandı. SSS başlığı “Aklınızdaki sorular için açık ve teknik cevaplar.” olarak masaüstü ve mobilde taşmasız görüntülendi.

## Güven mesajları için yayın notu

Perla Marine sitesinde deneyim yılı, garanti kapsamı, orijinal parça politikası, 7/24 servis veya benzeri işletme iddiaları; kullanıcı tarafından açıkça doğrulanıp işletme verisi olarak onaylanmadıkça kesin güven mesajı şeklinde yayınlanmamalıdır. Bu nedenle ana sayfadaki güven bandı nötr süreç ifadeleriyle tutulmuştur: tekneye özel bakım, şeffaf süreç, sistem bütünlüğü ve planlı iletişim. Onaylı veriler ileride sağlanırsa bu alanlar kanıtlanabilir içerikle güncellenebilir.

## Son görsel editör yorumları — doğrulama

Header’daki Instagram ikonunun masaüstü ve mobil navigasyondan kaldırıldığı doğrulandı. Blog başlığı tekne sahipleri ve üretici firmalara yönelik daha davetkâr bir ifadeye güncellendi. SSS başlığı “Aklınıza takılan her şey için açık ve teknik cevaplar.” olarak masaüstü ve mobilde taşmasız görüntülendi. Footer’da orijinal renkli logo geri getirildi; yasal bağlantılar alt satıra taşındı ve telif metni sola hizalandı. Masaüstü ve mobil ekran görüntülerinde alt satır ve footer içerikleri taşma olmadan görüntülendi.

## Son footer/header erişilebilirlik doğrulaması

Güncel geliştirme önizlemesindeki `/sss` rotasında gerçek tarayıcı klavye testi yapıldı. İlk Tab ile “Ana içeriğe geç” skip-link’i görünür focus aldı; sayfadaki navigasyon bağlantıları, altı adet SSS `summary` kontrolü ve footer bağlantıları erişilebilir öğeler olarak listelendi. Sayfanın sonuna kaydırıldığında KVKK / Aydınlatma, Gizlilik ve Çerez politikası bağlantıları ayrı ve klavye erişilebilir `a` öğeleri olarak doğrulandı. Header’daki Instagram ikonu artık görünür veya focus sırasına dahil değil. Footer Instagram bağlantısı ise aria-label ile korunuyor.

## Son tur gerçek focus ölçümü

Güncel SSS önizlemesinde footer altındaki üç yasal bağlantı sırayla focuslandı. Her bağlantı `A` elementi, `tabIndex=0` ve aktif focus durumunda ölçüldü; ortak focus stili `3px solid rgb(199, 155, 72)` olarak gözlemlendi. Sıra `KVKK / Aydınlatma` → `Gizlilik` → `Çerez politikası` ve hedefleri sırasıyla `/kvkk`, `/gizlilik`, `/cerez` olarak doğrulandı. Önceki 375×812 mobil ekran görüntüsünde bu alt satır taşmadan görüntülenmişti; aynı üç bağlantının doğal anchor yapısı mobilde de korunmaktadır.

Gerçek Tab testi başlangıcında ilk focus `Ana içeriğe geç` skip-link’inde görüldü; computed style `3px solid rgb(199, 155, 72)` idi. İkinci Tab adımında focus, Perla Marine logo ana sayfa bağlantısına geçti ve ekran görüntüsünde altın focus halkası görünür durumdaydı.

Gerçek Tab sırası adım adım şu şekilde doğrulandı: `Ana içeriğe geç` → Perla Marine logo bağlantısı → Ana Sayfa → Hakkımızda → Hizmetler → Blog → Bize ulaşın → ilk SSS sorusu. Her adımda aktif öğe tespit edildi; header bağlantılarında `3px solid rgb(199, 155, 72)` focus halkası görüldü. İlk SSS `summary` kontrolü klavye ile erişilebilir ve aktif focus aldı.

## Gerçek footer yasal bağlantı Tab testi

Gerçek klavye Tab akışı footer’a kadar sürdürüldü. SSS bölümünün son sorusundan sonra footer sırası `Hakkımızda` → `Hizmetler` → `Blog` → `SSS` → `Site haritası` olarak ilerledi. Instagram bağlantısından sonra gerçek Tab adımlarıyla `KVKK / Aydınlatma` → `Gizlilik` → `Çerez politikası` bağlantılarına ulaşıldı. Her üç yasal bağlantıda aktif öğe `A`, `tabIndex=0` ve focus görünümü `3px solid rgb(199, 155, 72)` olarak ölçüldü. 375×812 mobil ekran görüntüsünde header, SSS başlığı ve açılır soru satırları taşmadan görüntülendi; footer alt satırının mobil düzeni de önceki mobil doğrulamayla uyumludur.

## Kullanıcı onaylı güven mesajları ve logo doğrulaması

Ana sayfa güven bandında kullanıcı tarafından doğrulanan `10+ yıl deneyim`, `7/24 hizmet` ve `Orijinal parça / garantili operasyonlar` mesajları masaüstü ve 375×812 mobil görünümde taşmadan görüntülendi. Footer’daki orijinal renkli logo beyaz zeminli ayrı bir alan içinde doğal renkleriyle gösterildi; koyu footer zemini üzerinde yeterli ayrışma sağlandı. TypeScript, Vitest ve üretim build kontrolleri başarılıdır.

## İşletme mesajları ve logo erişilebilirlik kontrolü

Ana sayfada gerçek Tab ile ilk focus `Ana içeriğe geç` skip-link’ine geldi; focus görünümü `3px solid rgb(199, 155, 72)` olarak ölçüldü. Güven bandındaki dört başlık `rgb(7, 58, 107)` renkte ve okunabilir metin içeriyor: `10+ yıl deneyim`, `7/24 hizmet`, `Orijinal parça` ve `Planlı iletişim`. Footer logo elementi görünür ve anlamlı `alt="Perla Marine"` metnine sahip. Beyaz logo zemini ile renkli orijinal logo ayrışması görsel kontrolde doğrulandı.

## Son kontrast ölçümü

Tarayıcıdaki gerçek CSS değerleriyle yapılan ölçümde güven bandı başlıkları `rgb(7, 58, 107)` ve zemin `rgb(255, 253, 248)` olarak görüldü; hesaplanan kontrast oranı **11.31:1**. Footer logo alanı gerçek `rgb(255, 255, 255)` beyaz zeminde `277×92px` ölçüldü ve logo alt metni `Perla Marine` olarak doğrulandı. Beyaz logo paneli ile footer lacivert zemini arasındaki `#06294e` / `#ffffff` kontrastı **14.63:1** olarak hesaplandı. Bu değerler metin ve logo alanının güçlü ayrıştığını gösterir.

## Son checkpoint

Son kontrast ve erişilebilirlik doğrulamalarından sonra kaydedilen güncel checkpoint sürümü: `98aa821b`.

## Yeni logo ve WhatsApp doğrulaması

Kullanıcının sağladığı `perla-marine-logo_236c7830.webp` dosyası webdev kalıcı varlığı olarak `/manus-storage/perla-marine-logo-236c7830_dc603e8f.webp` adresine bağlandı; footer görselinin `alt` değeri `Perla Marine` olarak doğrulandı. Header ve footer’da iki WhatsApp bağlantısı gerçek tarayıcıda ölçüldü; her ikisi de `https://wa.me/905454353201` hedefine ve `WhatsApp ile Perla Marine’e ulaşın` erişilebilir adına sahip. Masaüstü ve 375×812 mobil görünümlerinde logo ve ikonların taşmadığı görüldü.

WhatsApp erişilebilirlik son kontrolünde header ve footer bağlantılarının her ikisi için focus görünümü `3px solid rgb(199, 155, 72)` olarak ölçüldü. Her iki bağlantının erişilebilir adı `WhatsApp ile Perla Marine’e ulaşın`, hedefi `https://wa.me/905454353201` ve yeni logo görselinin alt metni `Perla Marine` olarak doğrulandı.

## Son logo paneli ve WhatsApp ikonu doğrulaması

Footer’daki beyaz logo paneli kaldırıldı; logo artık doğrudan koyu footer yüzeyinde sade görsel olarak yer alıyor. Header’da önceki doğrulanmış şeffaf logo dosyası korunuyor. WhatsApp işareti, genel sohbet balonu yerine telefon sembollü WhatsApp marka formuna yakın inline SVG olarak Instagram ikonunun hemen yanına yerleştirildi. Masaüstü ve 375×812 mobil ekranlarda ikon sırası, logo görünümü ve alt footer yerleşimi taşmasız doğrulandı.

## Logo paneli ve WhatsApp son tarayıcı ölçümü

Gerçek tarayıcı ölçümünde Header logosu `/manus-storage/perla-marine-logo-real-transparent_d043978f.png` olarak korunuyor; Footer logosu kullanıcı yüklemesi olan `/manus-storage/perla-marine-logo-236c7830_dc603e8f.webp` dosyasını kullanıyor ve beyaz panel elementi bulunmuyor. Header ve Footer WhatsApp bağlantılarının her ikisinde `svg path` mevcut, erişilebilir ad `WhatsApp ile Perla Marine’e ulaşın`, hedef `https://wa.me/905454353201` ve focus görünümü `3px solid rgb(199, 155, 72)` olarak doğrulandı.

## Vakum infüzyon görseli ve Footer ikon sırası doğrulaması

Kompozit Çözümler kartındaki görsel, vakum torbalı reçine infüzyon sürecini gösteren kompozit üretim görseliyle değiştirildi. Görsel masaüstü ve 375×812 mobil kart kırılımında doğru oranla ve taşma olmadan görünüyor. Footer’da Instagram ikonu önce, WhatsApp ikonu hemen yanında olacak şekilde sosyal bağlantı sırası korunuyor.

Not: Görsel üretim kotası dolu olduğu için görsel arama sonucundan seçilen uygun varlık kullanıldı; yayın öncesinde kullanım lisansı/izin durumu doğrulanmalıdır.

## DOM doğrulaması

Gerçek tarayıcı DOM ölçümünde Footer sosyal sırası Instagram (`https://www.instagram.com/perlamarine.tr/`) ardından WhatsApp (`https://wa.me/905454353201`) olarak doğrulandı; her iki ikonun SVG yolu mevcut. Kompozit kart görseli `/manus-storage/perla-composite-vacuum-infusion_c6928b76.jpg` kaynağını ve `Kompozit Çözümler bakım ve uygulama hizmeti` alt metnini kullanıyor.

### Görsel kullanım durumu

Kompozit kartındaki vakum infüzyon görseli, görsel üretim kotası nedeniyle arama sonucundan seçilmiştir. Kullanıcı, bu varlığın **geçici olarak kullanılmasını** onayladı. Görselin lisans/kullanım hakkı doğrulanana kadar kalıcı marka varlığı olarak değerlendirilmemelidir; sonraki adım lisanslı veya kullanıcıya ait bir fotoğrafla değiştirmektir.

## Footer ikonları aynı satır doğrulaması

Instagram ve WhatsApp bağlantıları ortak `.footer-social-links` kapsayıcısına alındı. `display: flex`, yatay yön ve sabit ikon genişliği ile ikonlar hem masaüstü hem 375×812 mobil görünümde yan yana kaldı; alt alta düşme veya taşma gözlenmedi. Erişilebilir bağlantı adları ve focus görünümü korunuyor.

## Footer sosyal ikonlarının DOM/CSS ölçümü

Gerçek tarayıcı ölçümünde `.footer-social-links` `display: flex`, `flex-direction: row` ve `white-space: nowrap` olarak doğrulandı. Instagram ve WhatsApp bağlantılarının üst konumu aynı (`topDifference: 0`); yatay konumları sırasıyla `left: 915` ve `left: 958` olarak ölçüldü. Focus halkası `3px solid rgb(199, 155, 72)` görünür durumdadır.

## Sistem odaklı görsel adayları

Görsel üretim kotası nedeniyle yeni kart görselleri için arama adayları inceleniyor. Marin elektrik adayları arasında `iTM2zLGd8K0q.jpg` (Boating Mag, 2560×1919; tekne akü/şarj sistemi) ve `lsDfyXtZmN3r.jpg` (Sportsman Boats, 1920×1080; akü/şarj ekipmanı) bulunuyor. Marin elektronik adayları arasında `PZDYjONWDZOR.jpg` (Marlin, 2000×900; elektronik suite) ve `A4gePKIfdvqV.jpg` (Attainable Adventure Cruising, 2560×1422; radar ekranları) bulunuyor. Bu görsellerin lisansları yayın öncesi ayrıca doğrulanmalıdır.

## Mevcut sistem görsellerinin görsel incelemesi

Mevcut Marin Elektrik görselinde ağırlıklı olarak elektrik panosu, sigorta/terminal düzeni ve akü bankası görülüyor; elektrik odağı uygun olmakla birlikte teknisyen ve çevre unsurları da kadrajda. Mevcut Marin Elektroniği görselinde radar kubbesi, çoklu navigasyon ekranları ve konsol ekipmanları görülüyor; elektronik odağı uygun olmakla birlikte teknisyen ve kokpit çevresi de kadrajda. Kullanıcı isteğindeki “yalnızca sistem” hedefi için daha sıkı ekipman kadrajları tercih edilecek.

Mevcut Isıtma-Soğutma görseli marin klima ünitesi, geniş hava kanalları ve borulama ekipmanını gösteriyor; kadrajın solundaki teknisyen nedeniyle ekipman odaklı daha sıkı bir kırpma uygulanacak.

Elektrik görseli kaynak olarak kalıcı varlık alanına kaydedildi. Sağdaki elektrik panosu, terminaller ve akü bankası korunarak sol taraftaki teknisyen bölümü kırpılacak; kartta yalnızca elektrik sisteminin görünür olması hedefleniyor.

Marin elektronik görseli kalıcı varlık alanına kaydedildi. Sol ve orta bölümdeki radar kubbesi, navigasyon ekranları ve kontrol paneli korunarak sağdaki teknisyen/kokpit kısmı kırpılacak; kartta elektronik ekipmanın öne çıkması hedefleniyor.

## Ekipman odaklı hizmet görselleri — son doğrulama

Marin Elektrik kartı el ve teknisyen figürlerini dışarıda bırakan, sigorta/terminal/pano ekipmanını öne çıkaran son kadrajı kullanıyor. Marin Elektroniği kartı radar kubbesi ve navigasyon ekranlarını, Isıtma-Soğutma kartı ise klima/Webasto ekipmanını öne çıkarıyor. Üç görsel 1920×1280 WebP olarak kalıcı webdev varlıklarına yüklendi; ServiceGrid URL’leri güncellendi.

## Etkileşim ve form deneyimi doğrulaması

Hizmet kartlarına fotoğraf büyümesi, açıklama metni renk vurgusu ve hover/focus durumunda görünen “Detayları incele” işareti eklendi. Marin Elektrik kartı Enter, Space veya tıklama ile açılan erişilebilir Radix Dialog bileşenini kullanıyor; Escape ile kapanma ve mobilde dikey akış doğrulandı. İletişim formunda hata özeti, alan bazlı Türkçe açıklamalar ve `aria-invalid` / `aria-describedby` ilişkileri korunarak gönderim sonrası yeşil başarı paneli ve kısa check animasyonu eklendi. Gerçek tarayıcı kontrolü sonucu: Dialog başlığı doğru, Escape sonrası kapalı, hata özeti görünür ve başarı durumu görünür. TypeScript, Vitest (4 test) ve üretim build’i başarılıdır.

## Tüm hizmet pop-up’ları ve üste dön butonu doğrulaması

Dokuz hizmet kartının tamamı kendi başlığı, bakım kapsamı, operasyon listesi, Perla Marine yaklaşım notu ve iletişim CTA’sını taşıyan ortak Dialog yapısına bağlandı. Her kart tıklama, Enter ve Space ile açılıyor; Escape ile kapanıyor. Global üste dön butonu 480px kaydırma sonrasında görünür oluyor, erişilebilir adıyla focus edilebiliyor ve `window.scrollTo({ behavior: "smooth" })` ile üst konuma dönüyor. Gerçek tarayıcı testinde dokuz pop-up’ın dokuzunda da başlık bulundu; üste dön butonu görünür oldu ve animasyon sonunda scroll konumu 11px ölçüldü. Mobil ve masaüstü ekran görüntüleri alındı; TypeScript, Vitest (4 test) ve production build başarılıdır.

## Üste dön butonu dairesel ilerleme doğrulaması

Üste dön butonuna SVG tabanlı dairesel ilerleme halkası eklendi. Halka, dokümanın toplam kaydırılabilir yüksekliğine göre `stroke-dashoffset` değerini güncelliyor; ok ikonu merkezde korunuyor. Gerçek tarayıcı testinde sayfanın üstünde `stroke-dashoffset: 119.3805`, sayfanın altında `0` ölçüldü ve `progressChanged: true` sonucu alındı. Buton görünürlüğü, smooth scroll sonrası 11px üst konum, mobil/masaüstü görünüm ve reduced-motion CSS desteği doğrulandı.

## Bölüm kontrastına göre üste dön teması

Üste dön butonu, görünür olduğu andaki viewport alt noktasında bulunan sayfa bölümünü `elementsFromPoint` ile örnekliyor. Şeffaf arka planlar atlanıyor; RGB arka plan luminance değeri açık/koyu tema seçmek için kullanılıyor. Açık zeminlerde lacivert buton ve lacivert ilerleme halkası, koyu zeminlerde lacivert buton üzerinde fildişi-altın vurgular kullanılıyor. Gerçek tarayıcı testinde üstte `back-to-top--on-light`, orta ve alt bölümlerde `back-to-top--on-dark` sınıfları ölçüldü. TypeScript, Vitest, production build ve masaüstü/mobil önizlemeler başarılıdır.

Bu uygulamadaki süreç, `/home/ubuntu/skills/scroll-contrast-navigation/SKILL.md` altında yeniden kullanılabilir beceriye dönüştürüldü ve `quick_validate.py` ile doğrulandı.

## Üste dön mikro-etkileşim doğrulaması

Açık/koyu tema değişimlerine `background-color`, `color`, `border-color` ve `box-shadow` için yumuşak 420ms/320ms geçişler eklendi. Hover ve focus-visible durumlarında buton kontrollü biçimde büyüyor, hafifçe yukarı kalkıyor, drop-shadow parlama ve dış vurgu halkası gösteriyor. `prefers-reduced-motion: reduce` altında transform, filter ve vurgu animasyonları devre dışı bırakılıyor. Gerçek tarayıcı testinde hover sırasında transform matrix değeri `1.0186`, drop-shadow ve pseudo-element opacity ölçüldü; tema, progress ring, dokuz pop-up ve iletişim formu akışları regresyon testinden geçti.

## Dokunmatik CTA ve Dialog geçiş doğrulaması

Üste dön butonunda coarse pointer cihazlar için kısa basma geri bildirimi eklendi; CTA butonlarına aynı parlama, focus halkası, kontrollü büyüme ve aktif basma dili taşındı. Hizmet Dialog’larında açılış 380ms, kapanış 260ms kontrollü easing animasyonlarıyla yeniden tanımlandı; overlay geçişleri ayrı animasyonlarla yumuşatıldı. Reduced-motion tercihi altında transform, filter ve Dialog keyframe animasyonları kapatılıyor. Gerçek tarayıcı testinde Dialog animasyon adı `service-dialog-in`, süresi `0.38s`, CTA hover transform `1.025/-2px`, üste dön hover transform `1.06/-2px` ve parlama halkası opacity `0.3` ölçüldü. TypeScript, Vitest, production build, mobil/masaüstü önizleme ve mevcut form/pop-up regresyon akışları başarılıdır.

## Ana sayfa rollback doğrulaması

Kullanıcı talebi üzerine son referans odaklı ana sayfa revizyonu geri alındı ve önceki onaylı ana sayfa görünümü geri yüklendi. Önceki hero, hizmetler, blog, SSS ve iletişim CTA yapısı korunurken; dokuz hizmet pop-up’ı, CTA mikro-etkileşimleri, Dialog geçişleri, dairesel ilerleme halkası, kontrast teması ve iletişim formu akışları korunmuştur. Gerçek tarayıcı regresyonunda dokuz pop-up başlığı, CTA/üste dön hover değerleri, Dialog animasyonu, ilerleme değişimi, kontrast sınıfları ve form hata/başarı durumları başarılıdır. TypeScript, Vitest, production build ve rollback sonrası önizleme başarılıdır.

## Üste dön butonu konum ve görünürlük düzeltmesi

Sorunun nedeni, mikro-etkileşim stillerinde `.back-to-top` için `position: relative` kuralının önceki `position: fixed` kuralını geçersiz kılmasıydı. Son stil katmanında buton yeniden `position: fixed`, `right: 24px`, `bottom: 24px` ve `z-index: 40` olarak sabitlendi; mobilde sağ/alt boşluklar 16px olarak korunuyor. Görünürlük davranışı 480px kaydırma eşiğinden sonra çalışıyor. Gerçek tarayıcı ölçümü `position: fixed`, `right: 24`, `bottom: 24`, görünürlük `true` ve smooth scroll sonrası 11px konumunu doğruladı. Mobil 375px önizleme ve tüm regresyon testleri başarılıdır.

## Giriş ekranı rollback doğrulaması

Son giriş ekranı ve header revizyonu geri alındı; önceki onaylı beyaz header ve “Denizde güven, detaylarda başlar.” hero görünümü geri yüklendi. Üste dön butonunun sağ alt sabit konumu, dairesel ilerleme halkası, kontrast teması, CTA mikro-etkileşimleri, dokuz hizmet pop-up’ı, Dialog geçişleri ve iletişim formu korunuyor. TypeScript, 4 Vitest testi, production build ve gerçek tarayıcı regresyon akışları başarılıdır; üste dön ölçümü `position: fixed`, sağ 24px, alt 24px olarak doğrulandı.

## Banner navigasyon güncellemesi

Banner navigasyonu istenen sıraya göre düzenlendi: Ana Sayfa, Hakkımızda, Hizmetler, Projeler, Teknik Bilgiler, Bize Ulaşın ve WhatsApp. Projeler bağlantısı mevcut tekneye özel çözümler alanına, Teknik Bilgiler bağlantısı blog sayfasına, Bize Ulaşın iletişim sayfasına ve WhatsApp bağlantısı `https://wa.me/905454353201` hedefine yönleniyor. Gerçek tarayıcı testinde masaüstü link sırası ve hedefleri, mobil açılır menü sırası ve WhatsApp hedefi doğrulandı. TypeScript, Vitest, production build ve masaüstü önizleme başarılıdır.

## Yeni banner sayfaları doğrulaması

Banner hedefleri yeni sayfa sistemine bağlandı: `/hakkimizda`, `/hizmetler`, `/projeler`, `/teknik-bilgiler` ve `/iletisim`. Eski `/blog` görünür navigasyondan kaldırıldı; eski sayfa bileşenleri artık banner üzerinden erişilebilir değil. Yeni sayfalar ortak Perla Marine kurumsal hero, teknik açıklama ve çağrı yapısını kullanıyor. Gerçek tarayıcıda altı ana rota açıldı; yeni beş sayfada hero yapısı ve başlıklar doğrulandı. Masaüstü 1280px ve mobil 375px önizlemelerinde taşma görülmedi. WhatsApp bağlantısı doğrudan `https://wa.me/905454353201` hedefine yönleniyor. TypeScript, Vitest, production build ve route doğrulamaları başarılıdır.

## Proje, iletişim ve Teknik Bilgiler güncellemesi

Projeler sayfasına üç önce/sonra görsel çifti, her biri için kapsam açıklaması ve iletişim bağlantısı eklendi; görseller örnek teknik varlık olarak açıkça etiketlendi ve gerçek onaylı saha fotoğrafları geldiğinde değiştirilebilecek yapı kuruldu. Bize Ulaşın sayfası yeni kurumsal tasarıma taşındı; alan bazlı doğrulama, hata özeti ve `contactSuccessIn` animasyonlu başarı durumu eklendi. Teknik Bilgiler sayfası altı kategori kartıyla blog içerik yapısına bağlandı. Gerçek tarayıcı testinde form hata özeti görünür, başarı mesajı görünür ve animasyonu `0.36s`, proje önce/sonra kartı 3, detay açıklaması 3, teknik bilgi kartı 6 olarak doğrulandı. TypeScript, 6 Vitest testi, production build ve mobil/masaüstü önizlemeleri başarılıdır.

## Proje lightbox ve ana sayfa içerik güncellemesi

Projeler sayfasındaki altı önce/sonra görsel tetikleyicisi büyütülebilir lightbox galerisine bağlandı. Galeri overlay tıklaması ve Escape ile kapanıyor; önceki/sonraki oklar, proje seçici düğmeleri, `role=dialog`, `aria-modal`, açıklayıcı alt metinler ve mobil kırılım destekleniyor. Ana sayfaya üç seçili proje/önce-sonra kartı eklendi. Blog alanı `Teknik Bilgiler` başlığı, teknik içerik açıklaması ve üç teknik bilgi kartıyla revize edildi. Gerçek tarayıcı testinde lightbox açılışı, önce/sonra değişimi, Escape kapanışı, ana sayfa proje bölümü ve Teknik Bilgiler başlığı doğrulandı. TypeScript, 6 Vitest testi, production build ve 1280px/375px önizlemeleri başarılıdır.

## Ayrı Projeler ve Önce/Sonra bölümleri

Ana sayfadaki birleşik proje/önce-sonra alanı iki ayrı bölüme ayrıldı. Projeler bölümü üç bağımsız proje kartı ve kapsam açıklamasıyla; Önce/Sonra bölümü üç ayrı karşılaştırma kartı, merkezi yön göstergesi ve Projeler sayfasına bağlantıyla çalışıyor. Mevcut Projeler lightbox galerisi korunuyor. Gerçek tarayıcı testinde ana sayfada 3 proje kartı, 3 önce/sonra kartı ve Teknik Bilgiler başlığı doğrulandı. Masaüstü tam sayfa ve 375px mobil önizlemelerde dikey akış, kart oranları ve taşma kontrol edildi. TypeScript, 6 Vitest testi ve production build başarılıdır.

## Ana sayfa slider ve proje bağlantıları

Önce/Sonra kartlarına pointer/touch sürükleme ve klavye ok tuşlarıyla çalışan erişilebilir karşılaştırma slider’ı eklendi. Slider konumu başlangıçta yüzde 50’den klavye ile 55’e, pointer sürükleme ile farklı bir değere güncellendi; `role=slider`, `aria-valuenow`, Home/End ve reduced-motion uyumu korundu. Ana sayfa Projeler ve Önce/Sonra kartları sırasıyla `elektrik-enerji`, `motor-tahrik` ve `mekanik-sistemler` anchor’larına bağlandı. İki bölüm arasına lacivert-altın ayırıcı ve farklı fildişi arka plan eklendi. Gerçek tarayıcıda altı proje bağlantısı, altı karşılaştırma slider’ı, yön değişimi, lightbox regresyonu ve 1280px/375px responsive görünüm doğrulandı. TypeScript, 6 Vitest testi ve production build başarılıdır.
