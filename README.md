# 🛫 Sorgulamax Flight Search

Modern Vue.js tabanlı uçuş arama uygulaması. Kullanıcıların uçuş biletlerini kolayca arayabileceği, responsive tasarıma sahip bir web uygulaması.

## ✨ Özellikler

- 🔍 **Gelişmiş Uçuş Arama**: Gidiş-dönüş uçuş arama
- 🏙️ **Havaalanı Autocomplete**: Gerçek zamanlı havaalanı önerileri
- 📱 **Responsive Tasarım**: Mobil ve desktop uyumlu
- ⚡ **Hızlı Performans**: Debouncing ve request cancellation
- 🎨 **Modern UI**: Temiz ve kullanıcı dostu arayüz
- 🔄 **Loading States**: Skeleton screens ve loading animasyonları
- 🛡️ **Error Handling**: Kapsamlı hata yönetimi

## 🛠️ Teknolojiler

- **Frontend**: Vue 3 (Composition API)
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: CSS3 (Scoped Styles)

## 📋 Gereksinimler

- **Node.js** (v16 veya üzeri) - Vite build tool için gerekli
- **npm** (v7 veya üzeri) - Package management için
- **Modern Browser** - ES6+ desteği olan tarayıcı

### Neden Node.js Gerekli?

Bu proje **Vite** build tool kullanıyor ve şu işlemler için Node.js gerekiyor:
- 🔧 **Development Server**: Hot reload ve proxy
- 📦 **Package Management**: npm dependencies
- 🏗️ **Build Process**: Vue SFC derleme ve bundling
- 🔄 **ES Modules**: Modern JavaScript transpilation

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd sorgulamax-flight-search
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 📜 Kullanılabilir Komutlar

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Production build oluştur
npm run build

# Build önizlemesi
npm run preview

# Alternatif başlatma komutu
npm start
```

## 🏗️ Proje Yapısı

```
src/
├── components/           # Vue bileşenleri
│   ├── search/           # Arama ile ilgili bileşenler
│   │   ├── SearchForm.vue        # Arama formu
│   │   └── AutocompleteInput.vue # Havaalanı autocomplete
│   ├── results/          # Sonuç gösterimi bileşenleri
│   │   ├── FlightResults.vue     # Uçuş sonuçları listesi
│   │   └── FlightResultItem.vue  # Uçuş sonuç öğesi
│   └── ui/               # Genel UI bileşenleri
│       ├── LoadingSkeleton.vue   # Yükleme animasyonu
│       ├── EmptyState.vue        # Boş durum bileşeni
│       └── ErrorState.vue        # Hata durumu bileşeni
├── services/            # API servisleri
│   ├── autocompleteService.js   # Havaalanı arama servisi
│   └── flightService.js         # Uçuş arama servisi
├── stores/              # Pinia store'ları
│   └── searchStore.js           # Arama state yönetimi
├── App.vue              # Ana uygulama bileşeni
├── main.js              # Uygulama giriş noktası
└── style.css            # Global stiller
```

## 🔧 Konfigürasyon

### API Endpoints

Uygulama iki farklı ortam için konfigüre edilmiştir:

- **Development**: `/api` (proxy üzerinden)
- **Production**: `https://sorgulamax.com/api`

### Environment Variables

Geliştirme ortamında API proxy'si için `vite.config.js` dosyasını kontrol edin.

## 🎯 Kullanım

### Uçuş Arama

1. **Nereden** alanına kalkış noktasını girin
2. **Nereye** alanına varış noktasını girin
3. **Gidiş Tarihi** seçin
4. **Dönüş Tarihi** (opsiyonel) seçin
5. **Uçuş Ara** butonuna tıklayın

### Autocomplete Özelliği

- Havaalanı adı yazmaya başladığınızda otomatik öneriler görünür
- Klavye ile navigasyon (↑↓ ok tuşları, Enter, Escape)
- Mouse ile seçim yapabilirsiniz

## 🏛️ Mimari

### State Management (Pinia)

```javascript
// searchStore.js
export const useSearchStore = defineStore('search', () => {
  const searchForm = ref({...})
  const searchResults = ref([])
  const searchLoading = ref(false)
  
  const searchFlights = async () => { ... }
  
  return { searchForm, searchResults, searchFlights }
})
```

### Service Layer

```javascript
// flightService.js
class FlightService {
  async searchFlights(searchParams) {
    // API çağrısı ve veri dönüşümü
  }
}
```

### Component Communication

- **Props Down**: Parent → Child veri aktarımı
- **Events Up**: Child → Parent event gönderimi
- **Store**: Global state paylaşımı

## 🛡️ Race Condition Koruması

Uygulama aşağıdaki tekniklerle race condition'ları önler:

### 1. Search ID Pattern
```javascript
const currentSearchId = ++lastSearchId.value
if (currentSearchId === lastSearchId.value) {
  searchResults.value = results
}
```

### 2. Request Cancellation
```javascript
if (this.abortController) {
  this.abortController.abort()
}
this.abortController = new AbortController()
```

### 3. Debouncing
```javascript
if (this.debounceTimer) {
  clearTimeout(this.debounceTimer)
}
this.debounceTimer = setTimeout(async () => { ... }, 300)
```

## 🎨 Styling

- **Scoped CSS**: Bileşen bazlı stil izolasyonu
- **CSS Grid & Flexbox**: Modern layout teknikleri
- **Responsive Design**: Mobile-first yaklaşım
- **CSS Variables**: Tutarlı renk paleti

## 🐛 Hata Ayıklama

### Geliştirme Araçları

1. **Vue DevTools**: Browser extension
2. **Console Logs**: Hata mesajları için
3. **Network Tab**: API çağrılarını izleme

### Yaygın Sorunlar

**API Bağlantı Hatası**
- Proxy konfigürasyonunu kontrol edin
- Network bağlantısını doğrulayın

**Autocomplete Çalışmıyor**
- Minimum 2 karakter girin
- API endpoint'ini kontrol edin

## 📱 Responsive Design

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🚀 Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulur.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Proje**: Sorgulamax Flight Search
- **Versiyon**: 1.0.0
- **Node.js**: v16+
- **Vue.js**: v3.4+

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
