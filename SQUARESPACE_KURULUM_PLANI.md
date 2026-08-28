# Perla Marine Squarespace Kurulum Planı

## 1. Kurulum yaklaşımı

Bu plan, hazırlanan Perla Marine prototipini Squarespace 7.1 üzerinde **Fluid Engine** kullanarak yeniden kurmak için hazırlanmıştır. React prototipi Squarespace’e doğrudan içe aktarılmaz; bunun yerine sayfa bölümleri, metinler, görseller, bağlantılar ve form alanları Squarespace editöründe oluşturulur.

Kurulum boyunca tasarım dili **bakım-onarım, refit ve sahadaki uygulama deneyimi** üzerine kurulmalıdır. Site, öncelikle tekne ve yat sahiplerine bakım, arıza tespiti ve onarım hizmeti veren bir firma olarak konumlanmalı; üretici firmalara danışmanlık ayrı ve ikincil bir hizmet alanı olarak gösterilmelidir.

| Marka unsuru | Squarespace karşılığı |
|---|---|
| Koyu lacivert | Ana başlıklar, koyu arka planlar ve navigasyon vurguları |
| Fildişi / kırık beyaz | Ana sayfa ve iç sayfa zeminleri |
| Altın | İnce çizgiler, küçük etiketler ve sınırlı vurgu butonları |
| Kullanıcının gönderdiği Perla Marine logosu | Header, footer ve favicon |
| Tipografi | Serif karakterli büyük başlıklar; sade sans-serif gövde metinleri |

## 2. Site haritası ve genel ayarlar

Squarespace panelinde **Pages** bölümünden aşağıdaki sayfaları oluşturun. Menü isimlerini kısa ve anlaşılır tutun.

| Menü adı | Önerilen URL slug | Sayfanın amacı |
|---|---|---|
| Ana Menü | `/` | Bakım-onarım odağını ve ana operasyonları tanıtmak |
| Hakkımızda | `/hakkimizda` | Çalışma anlayışını ve sahadaki deneyimi aktarmak |
| Hizmetler | `/hizmetler` | Operasyonları sıralı ve bağımsız başlıklarla sunmak |
| Blog | `/blog` | Bakım, sistem ve uygulama notlarını yayınlamak |
| Teknik Değerlendirme | `/iletisim` | Form, telefon, e-posta ve Instagram iletişimini göstermek |

**Pages → Main Navigation** altında bu sayfaları aynı sırayla yerleştirin. Footer Navigation bölümünde de Hakkımızda, Hizmetler, Blog ve Teknik Değerlendirme bağlantılarını tekrar edin. Her sayfada tek bir ana menü bulunmalı; menüde hizmetlerin bütün alt başlıklarını listelemek yerine Hizmetler sayfasına yönlendirme yapılmalıdır.

## 3. Site-wide header ve footer kurulumu

### Header

**Edit → Header → Site Header** bölümünde paylaştığınız Perla Marine logo dosyasını yükleyin. Logoyu ayrı bir sembol ve yazı olarak yeniden üretmeyin; tam logo dosyasını kullanın. Logo yüksekliğini masaüstünde yaklaşık 55–65 piksel, mobilde yaklaşık 42–50 piksel aralığında tutun.

Header arka planını fildişi veya beyaz, metinleri koyu lacivert ve aktif menü alt çizgisini altın yapın. Sağ tarafta yalnızca **Teknik Değerlendirme** bağlantısını koyu lacivert buton olarak kullanın. Diğer sayfalarda sürekli “Bize Ulaşın” butonu tekrarlamayın.

### Footer

Footer’ı koyu lacivert zeminli üç bölümlü bir section olarak kurun. Sol bölümde aynı tam Perla Marine logosunu açık renkli bir logo alanı içinde kullanın. Orta bölümde Hakkımızda, Hizmetler ve Blog bağlantıları; sağ bölümde telefon, e-posta ve Instagram bilgileri yer alsın.

| Alan | İçerik |
|---|---|
| Telefon | `+90 545 435 32 01` bağlantısı: `tel:+905454353201` |
| E-posta | `info@perlamarine.com` bağlantısı: `mailto:info@perlamarine.com` |
| Instagram | `https://www.instagram.com/perlamarine.tr/` |
| Ana alan adı | `https://www.perlamarine.com/` |

Logo ve footer metinlerinde üretilmiş alternatif ikon veya marka işareti kullanmayın. Squarespace’te **Design → Browser Icon** alanına da mümkünse aynı logo dosyasının uygun şekilde kırpılmış favicon versiyonunu yükleyin.

## 4. Ana sayfa kurulumu

Ana sayfayı aşağıdaki section sırasıyla oluşturun. Her section için Fluid Engine’de **Add Section → Blank** seçerek daha kontrollü bir yerleşim elde etmek en iyi sonucu verir.

### Hero section

Tam genişlikte, koyu lacivert overlay uygulanmış bir orta ölçekli yat bakım görseli kullanın. Görselin üzerinde aşağıdaki metin yer alsın:

> **Tekneniz için doğru bakım. Güvenli seyir için doğru sistem.**

Alt açıklama olarak şu metni kullanın:

> Perla Marine; orta ölçekli tekne ve yatlarda kompozit, elektrik, motor, tahrik, dümen ve mekanik sistemlerin bakım-onarımını tekneye özel bir yaklaşımla yürütür.

Hero’da yalnızca bir ana buton kullanın: **Bakım-onarım hizmetleri**. İkinci bağlantı buton yerine sade bir metin bağlantısı olarak **Operasyonları keşfedin** yazılabilir ve Hizmetler sayfasına yönlendirilir.

### Operasyonlar section

Başlık:

> **Teknenizin ihtiyaç duyduğu işi, doğru sırayla ve anlaşılır biçimde yürütüyoruz.**

Bu section’da dört kartlı bir grid kullanın. Kartlar aşağıdaki sırada olmalıdır:

| Sıra | Başlık | Alt başlıklar |
|---|---|---|
| 1 | Kompozit çözümler | Model ve kalıp imalatı; kompozit imalat; kompozit tamir operasyonları |
| 2 | Elektrik sistemleri | Elektrik arıza tespiti; akü ve lityum sistemleri; güneş enerjisi bağlantıları |
| 3 | Motor, tahrik ve dümen sistemleri | Motor ve yardımcı ekipmanlar; şaft, kaplin ve pervane; dümen ve kumanda mekanizması |
| 4 | Mekanik tesisatlar | Pompa ve vana bakımı; boru ve hortum hatları; sızdırmazlık ve bağlantı kontrolleri |

Her karta konuya özgü orta ölçekli tekne sistemleri görseli ekleyin. Kart başlıklarında 01, 02, 03 gibi numaralar kullanmayın.

### Elektrik ve enerji section

Koyu lacivert arka planlı iki kolonlu bir section oluşturun. Sol tarafta başlık, açıklama ve üç kısa madde; sağ tarafta elektrik ve lityum sistemleri üzerinde çalışan teknisyen görseli yer alsın.

Başlık:

> **Enerji sistemlerinde güven, düzenli kurulum ve doğru bakımla başlar.**

Maddeler: Elektrik arıza tespiti; akü, lityum ve şarj sistemi bakımı; güneş enerjisi bağlantı ve performans kontrolü.

### Bakım yaklaşımı section

Açık fildişi arka planlı üç kolonlu bir section kullanın. Başlık:

> **Önce mevcut durumu anlıyor, sonra uygulanabilir bir onarım planı kuruyoruz.**

Kolonlar: **Dinliyoruz**, **Kontrol ediyoruz**, **Uyguluyoruz**. Bu bölümde numara veya aşama kodu kullanmayın.

### Motor, tahrik ve dümen section

Koyu lacivert zeminli iki kolonlu bir section oluşturun. Başlık:

> **Teknenin hareketini ve kontrolünü birlikte güvence altına alıyoruz.**

Açıklamada motor çevresi, şaft ve kaplin, pervane, dümen mekanizması ve kumanda bağlantılarındaki bakım, arıza tespiti ve onarım çalışmalarını anlatın. İlgili tahrik sistemi görselini sağ veya sol kolona yerleştirin.

### Üretici firmalara danışmanlık section

Bu bölümü ana bakım-onarım anlatısından sonra, daha açık ve fildişi bir arka plan üzerinde oluşturun.

Başlık:

> **Üretim yapan firmalar için sahadaki bakım bilgisini tasarım kararlarına taşıyoruz.**

Açıklamada model ve kalıp imalatı, servis edilebilirlik, sistem erişimi, kompozit uygulamalar ve teknik koordinasyondan bahsedin. Burada tek bir metin bağlantısı yeterlidir: **Danışmanlık kapsamını konuşalım**.

## 5. Hizmetler sayfası kurulumu

Hizmetler sayfası, ana sayfadaki kısa kartların genişletilmiş versiyonu olmalıdır. Hero başlığı şu yönde kullanılabilir:

> **Teknenizin ihtiyacı olan işi, sahadaki deneyimle tamamlıyoruz.**

Hero açıklamasında kompozit yüzeyler, elektrik ve enerji sistemleri, motor-tahrik-dümen grubu ve mekanik tesisatların bakım, arıza tespiti ve onarımını anlatın.

Ardından altı bağımsız hizmet kartı veya stacked section oluşturun:

| Bölüm | İçerik | Görsel |
|---|---|---|
| Kompozit çözümler | Model ve kalıp imalatı; kompozit imalat; kompozit tamir operasyonları | Gövde veya kompozit uygulama görseli |
| Elektrik sistemleri | Arıza tespiti; akü/lityum; şarj ve güneş enerjisi bağlantıları | Elektrik servis görseli |
| Motor, tahrik ve dümen | Motor; şaft-kaplin-pervane; dümen ve kumanda | Motor veya tahrik görseli |
| Mekanik tesisatlar | Pompa; vana; boru ve hortum; sızdırmazlık | Mekanik tesisat görseli |
| Güneş enerjisi ve lityum sistemleri | Enerji depolama; panel ve şarj düzeni; servis erişimi | Güneş paneli ve lityum servis görseli |
| Üretici firmalara danışmanlık | Servis edilebilirlik; sistem erişimi; teknik koordinasyon | Üretim sahasında teknik inceleme görseli |

Kartların altında sürekli buton kullanmak yerine yalnızca sayfa sonunda **Teknik değerlendirme** bağlantısı kullanın. Hizmet kartları arasında ince altın çizgiler veya boşluklar kullanılabilir; numaralı rota işaretleri kullanılmamalıdır.

## 6. Hakkımızda sayfası kurulumu

Hero başlığı:

> **Tekne bakımını, sahadaki deneyimle güvenilir hale getiriyoruz.**

Giriş metni:

> Perla Marine; orta ölçekli tekne ve yatlarda bakım-onarım, refit ve sistem yenileme operasyonlarını tekneye özel uygulama deneyimiyle yürütür.

Gövde bölümünde üç çalışma ilkesi kullanın: **Teknik bütünlük**, **Şeffaf süreç** ve **Uygulanabilirlik**. Her başlık birbirinden bağımsız kısa bir paragrafla açıklanmalıdır.

Sayfanın sonunda “Yeni projelerden sistem dönüşümlerine uzanan teknik ortaklık” temalı bir section oluşturun. Bu bölümde şirketin üretici firmalara proje bazlı danışmanlık verdiğini belirtin; ancak sayfanın ana anlatısını mühendislik danışmanlığı üzerine kurmayın.

## 7. Blog sayfası kurulumu

Blog sayfasında her yazı tek bir üst başlığa bağlı, bağımsız ve uygulama odaklı olmalıdır. İlk içerik havuzu için aşağıdaki başlıkları kullanabilirsiniz.

| Kategori | Yazı başlığı |
|---|---|
| Elektrik ve enerji sistemleri | Lityum ve akü sistemlerinde bakım kontrolü nerede başlar? |
| Motor, tahrik ve dümen | Motor, şaft ve dümen sistemlerinde bakım işaretleri |
| Mekanik tesisatlar | Pompa, vana ve hortum hatlarında planlı bakım |
| Kompozit çözümler | Model, kalıp ve kompozit tamirinde doğru hazırlık |

Squarespace’te **Blog Page → Add Post** yoluyla her yazıyı ayrı oluşturun. Her yazıya tek bir ana kategori, açıklayıcı bir URL slug, kapak görseli, alt metin ve benzersiz SEO açıklaması ekleyin. Blog kartlarında numara kullanmayın. Henüz yayımlanmamış yazılar için sahte müşteri yorumu, puan veya referans eklemeyin.

## 8. İletişim sayfası ve form kurulumu

Hero başlığı:

> **Teknenizin veya projenizin ihtiyaçlarını birlikte değerlendirelim.**

Sayfanın sol tarafında telefon, e-posta ve Instagram bağlantılarını görünür bir iletişim alanı olarak yerleştirin. Sağ tarafa **Add Block → Form** ile bir Squarespace Form Block ekleyin. Form alanları şu şekilde olmalıdır:

| Alan | Tür | Zorunlu |
|---|---|---|
| İletişim kişisi | Text | Evet |
| Tekne / Proje adı | Text | Hayır |
| E-posta adresiniz | Email | Evet |
| Teknik odak | Dropdown | Evet |
| Mevcut durum ve hedef | Long Text | Evet |

Dropdown seçenekleri Kompozit çözümler, Elektrik ve enerji sistemleri, Motor-tahrik-dümen, Mekanik tesisatlar, Bakım-onarım ve refit, Üretici danışmanlığı ve Diğer olmalıdır.

Form ayarlarında **Storage** bölümünden `info@perlamarine.com` adresini ekleyin. Zorunlu e-posta alanı, başvuruların Squarespace Contacts panelinde görünmesi için gereklidir [2]. Form yanıtlarını ikinci bir güvenlik kopyası olarak Google Drive’a bağlamak da mümkündür; Squarespace bir form için birden fazla depolama seçeneğini destekler [2]. Form Block’un teslim alabilmesi için en az bir depolama seçeneği gereklidir [2].

Gönderim sonrası mesajı şu şekilde ayarlayın: “Talebiniz alındı. Perla Marine ekibi, paylaştığınız teknik bilgiler üzerinden sizinle iletişime geçecektir.”

## 9. Alan adlarını bağlama

Önerilen yapı `www.perlamarine.com` alan adını birincil alan adı, `perlamarin.com` alan adını ise birincil adrese yönlenen ikincil alan adı olarak kullanmaktır. Squarespace’te **Settings → Domains → Use a Domain I Own** seçeneğiyle alan adını başlatın [1]. Alan adlarını üçüncü taraf sağlayıcıda tutup DNS bağlantısı yapabilirsiniz; bu durumda alan adı sağlayıcınızda DNS erişimi korunmalıdır [1].

DNS kayıtlarını Squarespace’in size gösterdiği güncel değerlerle girin. Genel Squarespace bağlantı akışında doğrulama için benzersiz CNAME, `www` için `ext.cust.squarespace.com` CNAME kaydı ve kök alan adı için Squarespace A kayıtları kullanılır [1]. Sağlayıcınızda mevcut MX kayıtlarını silmeyin; bu kayıtlar `info@perlamarine.com` gibi e-posta hizmetlerini etkileyebilir [1]. DNS değişikliklerinin uygulanması 24–48 saat sürebilir [1].

| Alan adı | Önerilen işlem |
|---|---|
| `www.perlamarine.com` | Primary Domain olarak seçin |
| `perlamarine.com` | `www.perlamarine.com` adresine yönlendirin |
| `perlamarin.com` | Aynı siteye bağlayıp primary domaine yönlendirin |
| `info@perlamarine.com` | MX kayıtlarını koruyun; e-posta çalışmasını DNS değişikliği sonrası test edin |

## 10. SEO ve yayın öncesi kontrol

Squarespace’in SEO kılavuzu, site başlığı, site açıklaması, her sayfaya özgü SEO açıklaması, favicon, sosyal paylaşım görselleri, okunabilir URL slug’ları, SSL ve Google Search Console doğrulamasını yayın öncesi kontrol listesine dahil eder [4]. Perla Marine için temel SEO metinleri aşağıdaki gibi kullanılabilir.

| Sayfa | SEO başlığı | SEO açıklaması |
|---|---|---|
| Ana Sayfa | Perla Marine | Tekne Bakım ve Onarım | Orta ölçekli tekne ve yatlarda kompozit, elektrik, motor, tahrik, dümen ve mekanik sistem bakım-onarımı. |
| Hakkımızda | Hakkımızda | Perla Marine | Perla Marine’in tekne bakım-onarım, refit ve sistem yenileme yaklaşımını keşfedin. |
| Hizmetler | Tekne Bakım-Onarım Hizmetleri | Perla Marine | Kompozit çözümlerden elektrik, motor, tahrik, dümen ve mekanik tesisat bakımına uzanan uygulama hizmetleri. |
| Blog | Perla Marine Bakım Notları | Tekne ve yat sistemleri, bakım, onarım ve kompozit uygulamalar üzerine pratik teknik notlar. |
| İletişim | Perla Marine Teknik Değerlendirme | Teknenizin bakım-onarım, refit veya sistem yenileme ihtiyacını Perla Marine ekibiyle paylaşın. |

Her görsel için açıklayıcı alt metin yazın. Örneğin “Orta ölçekli motor yatın motor ve tahrik sisteminde bakım çalışması” ifadesi, yalnızca “yat fotoğrafı” yazmaktan daha kullanışlıdır. Görselleri web için sıkıştırın; Squarespace SEO rehberi görsel boyutlarının ve sayfa ağırlığının kontrol edilmesini önerir [4].

Yayın öncesinde şu kontrolleri sırayla yapın: masaüstü ve mobil görünüm; header ve footer logosu; tüm menü bağlantıları; telefon, e-posta ve Instagram bağlantıları; form gönderimi; form e-posta bildirimi; favicon; SSL; `www.perlamarine.com` primary domain; `perlamarine.com` ve `perlamarin.com` yönlendirmeleri; 404 sayfası; sosyal paylaşım görseli; Google Search Console doğrulaması.

## 11. Uygulama sırası

En verimli kurulum sırası şöyledir: önce site ayarları ve logo, ardından header/footer, sonra Ana Sayfa, Hizmetler, Hakkımızda, Blog ve İletişim sayfaları. Formu alan adı bağlanmadan önce de oluşturabilirsiniz; fakat form e-posta bildirimini alan adı ve SSL etkinleştikten sonra gerçek bir test gönderimiyle doğrulayın. Son olarak SEO alanlarını doldurun, mobil görünümü kontrol edin ve siteyi yayınlayın.

> **Önemli:** DNS ekranında Squarespace’in o an gösterdiği kayıtları esas alın. Sağlayıcıya göre alan adı ve DNS ekranlarının adları değişebilir; özellikle e-posta için MX kayıtlarını silmeden ilerleyin [1].

## Kaynaklar

[1] [Squarespace — Connect a third-party domain to your Squarespace site](https://support.squarespace.com/hc/en-us/articles/205812378-Connect-a-third-party-domain-to-your-Squarespace-site)

[2] [Squarespace — Managing form and newsletter storage](https://support.squarespace.com/hc/en-us/articles/205814638-Managing-form-and-newsletter-storage) · [Form blocks](https://support.squarespace.com/hc/en-us/articles/206566737-Form-blocks)

[3] [Squarespace — Form blocks](https://support.squarespace.com/hc/en-us/articles/206566737-Form-blocks)

[4] [Squarespace — SEO checklist](https://support.squarespace.com/hc/en-us/articles/360002090267-SEO-checklist)
