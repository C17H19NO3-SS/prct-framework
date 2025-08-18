# Prct Framework

## Amaç

**Prct Framework**, özellikle **monolitik uygulamalar** geliştiren ve **tek başına çalışan geliştiriciler** için tasarlanmıştır. Temel hedefi, uygulama geliştirme sürecini daha hızlı, daha az konfigürasyon ile ve daha zahmetsiz hale getirmektir.

## Çalışma Mantığı

1. **Sunucu Başlatma**
   Uygulama çalıştırıldığında, ilk olarak `views/main.tsx` dosyası **Server-Side Rendering (SSR)** yöntemiyle işlenir. Bu sayede sayfanın ilk yüklenme süresi hızlanır ve SEO uyumluluğu artar.

2. **React Entegrasyonu**
   SSR ile oluşturulan çıktıya, `index.tsx` dosyasında bulunan React projesi **Scripts parametresi** üzerinden enjekte edilir. Böylece hem hızlı ilk render alınır hem de istemci tarafında React uygulaması sorunsuz şekilde devreye girer.

3. **Cache Yönetimi (Redis Opsiyonel)**
   Eğer `.env` dosyasında `USE_REDIS=true` olarak tanımlandıysa:

   - Framework, `REDIS_URL` üzerinden Redis sunucusuna bağlanır.
   - `/(:page?)` patternine uyan tüm istekler, Redis üzerinde **cache** kontrolüne tabi tutulur.
   - Eğer sayfa önceden cache’de varsa, yanıt Redis üzerinden çok daha hızlı bir şekilde döndürülür.
   - Cache bulunmuyorsa, SSR çıktısı üretilir ve Redis’e yazılır.

4. **Routing**
   Varsayılan olarak, framework `/:page?` patternine uyan istekleri karşılar. Bu yapı hem **dinamik sayfalar** hem de **statik içeriklerin cache’den servis edilmesi** için uygundur.

## Teknik Avantajlar

- **SSR + CSR Hibrit Yapı:** İlk yüklemede SSR, devamında React SPA deneyimi.
- **Redis ile Performans Artışı:** Yüksek trafikli uygulamalarda düşük gecikme ve hızlı yanıt süresi.
- **Basit Konfigürasyon:** `.env` üzerinden Redis gibi ek özellikler kolayca açılıp kapatılabilir.
- **Monolitik Yapılara Uygun:** Tek proje yapısı içerisinde hem frontend hem backend geliştirme imkanı.
