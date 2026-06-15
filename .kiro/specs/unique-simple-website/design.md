# Design Document — unique-simple-website

## Overview

Website ini adalah aplikasi web satu halaman (single-page) modern yang dibangun sepenuhnya menggunakan **HTML5**, **Tailwind CSS via CDN**, dan **Vanilla JavaScript** — tanpa build tools, tanpa framework, tanpa dependensi server.

Elemen pembeda utama adalah **Cursor Spotlight Effect**: lapisan overlay yang menampilkan gradien radial cahaya mengikuti posisi kursor pengguna di atas latar belakang gelap, menciptakan pengalaman eksplorasi yang terasa premium dan personal.

Struktur halaman mencakup 7 section utama: Navbar, Hero, About, Features, Portfolio, Testimonials, dan Contact, serta sebuah Footer. Semua fungsionalitas interaktif (spotlight, scroll behavior, counter animasi, carousel, filter portfolio, validasi form, theme toggle) diimplementasikan langsung dalam JavaScript murni.

### Tujuan Desain

- **Zero Build**: Semua aset dapat dibuka langsung di browser tanpa proses kompilasi.
- **Self-contained**: Satu atau beberapa file HTML/CSS/JS statis saja.
- **Progressive Enhancement**: Website berfungsi dan terbaca bahkan tanpa JavaScript; JS menambah lapisan interaktivitas.
- **Dark-first**: Mode gelap adalah default; tema terang tersedia via toggle.

---

## Architecture

Website ini menggunakan arsitektur **Single File / Multi-file Static** dengan pendekatan Module Pattern berbasis IIFE (Immediately Invoked Function Expression) di dalam tag `<script>` untuk menghindari polusi namespace global.

```
index.html
├── <head>
│   ├── Tailwind CSS CDN (via <script src="...">)
│   ├── Google Fonts CDN (opsional)
│   └── <style> — CSS Custom Properties & animasi kustom
├── <body>
│   ├── <div id="spotlight-overlay"> — Cursor Spotlight layer
│   ├── <header> — Navbar
│   ├── <main>
│   │   ├── <section id="hero">
│   │   ├── <section id="about">
│   │   ├── <section id="features">
│   │   ├── <section id="portfolio">
│   │   ├── <section id="testimonials">
│   │   └── <section id="contact">
│   ├── <footer>
│   └── <button id="scroll-top-btn"> — Floating button
└── <script> — Vanilla JS modules (IIFE)
    ├── themeManager
    ├── spotlightEffect
    ├── navbarController
    ├── smoothScroll
    ├── counterAnimation
    ├── cardHoverEffects
    ├── portfolioFilter
    ├── testimonialCarousel
    ├── contactForm
    └── scrollTopButton
```

### Alur Data & Event

```
Browser Events
    │
    ├── mousemove  → spotlightEffect.update(x, y)
    ├── scroll     → navbarController.onScroll()
    │               scrollTopButton.toggle()
    ├── click      → smoothScroll.to(targetId)
    │               themeManager.toggle()
    │               portfolioFilter.apply(category)
    │               testimonialCarousel.navigate(dir)
    │               contactForm.submit()
    └── IntersectionObserver → counterAnimation.start()
```

---

## Components and Interfaces

### 1. `themeManager`

Mengelola mode terang/gelap via atribut `data-theme` pada `<html>`.

```javascript
themeManager = {
  init()          // Baca localStorage, terapkan tema default (dark)
  toggle()        // Tukar dark ↔ light, simpan ke localStorage
  getCurrent()    // Mengembalikan 'dark' | 'light'
  applyTheme(t)   // Terapkan kelas Tailwind & update CSS vars
}
```

### 2. `spotlightEffect`

Mengontrol lapisan overlay `#spotlight-overlay`.

```javascript
spotlightEffect = {
  init()                     // Pasang event listener mousemove
  update(x, y)               // Set CSS vars --spotlight-x, --spotlight-y
  show()                     // Tampilkan overlay (opacity transition)
  hide()                     // Sembunyikan overlay
  setMode(theme)             // Aktif di dark, nonaktif di light
  _onMouseMove(event)        // Handler internal
}
```

CSS yang digunakan:

```css
#spotlight-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0;
  background: radial-gradient(
    600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%),
    rgba(255, 255, 255, 0.07),
    transparent 80%
  );
  transition: opacity 0.3s ease;
}
```

### 3. `navbarController`

Mengelola Navbar sticky dan transformasi saat scroll.

```javascript
navbarController = {
  init()         // Pasang scroll listener & IntersectionObserver pada Hero
  onScroll()     // Tambah/hapus class 'scrolled' pada <header>
  _heroObserver  // IntersectionObserver instance
}
```

### 4. `smoothScroll`

Menangani scroll halus saat klik tautan navigasi / CTA.

```javascript
smoothScroll = {
  init()              // Delegasikan klik pada [data-scroll-to]
  to(targetId)        // scrollIntoView({ behavior: 'smooth' })
}
```

### 5. `counterAnimation`

Animasi angka dari 0 → target menggunakan `requestAnimationFrame`.

```javascript
counterAnimation = {
  init()              // Pasang IntersectionObserver pada .stat-counter
  start(el)           // Mulai animasi counter pada elemen tertentu
  _animate(el, start, end, duration)
  _hasRun: Set<Element>  // Mencegah animasi berjalan lebih dari sekali
}
```

### 6. `portfolioFilter`

Filter item portfolio berdasarkan kategori.

```javascript
portfolioFilter = {
  init()                    // Pasang klik pada .filter-btn
  apply(category)           // Tampilkan/sembunyikan .portfolio-item
  _currentCategory: string  // Kategori aktif saat ini
  _animateItems(items, show)  // Animasi masuk/keluar
}
```

### 7. `testimonialCarousel`

Carousel horizontal dengan auto-play dan pause on interaction.

```javascript
testimonialCarousel = {
  init()                // Render, mulai auto-play
  navigate(dir)         // dir: 'prev' | 'next'
  goTo(index)           // Langsung ke slide tertentu
  _autoPlay()           // setInterval 5000ms
  _pauseAndResume()     // clearInterval, setTimeout 10000ms restart
  _currentIndex: number
  _total: number
  _intervalId: number
}
```

### 8. `contactForm`

Validasi dan pengiriman formulir kontak (simulasi).

```javascript
contactForm = {
  init()                  // Pasang submit listener
  validate()              // Validasi semua field, kembalikan boolean
  _validateField(field)   // Validasi satu field, tampilkan/sembunyikan error
  submit(event)           // Cegah default, validate(), tampilkan toast
  reset()                 // Reset semua field
}
```

### 9. `toastNotification`

Menampilkan pesan singkat floating di layar.

```javascript
toastNotification = {
  show(message, type, duration)  // Buat elemen, animate in, hapus setelah duration (ms)
  // type: 'success' | 'error' | 'info'
}
```

### 10. `scrollTopButton`

Tombol floating "kembali ke atas".

```javascript
scrollTopButton = {
  init()      // Pasang scroll listener & klik pada #scroll-top-btn
  toggle()    // Tampilkan/sembunyikan setelah 300px scroll
  scrollUp()  // window.scrollTo({ top: 0, behavior: 'smooth' })
}
```

---

## Data Models

Semua data bersifat statis (tidak ada backend). Data didefinisikan sebagai konstanta JavaScript atau langsung di HTML.

### ThemeState

```typescript
type Theme = 'dark' | 'light';

interface ThemeState {
  current: Theme;      // Tema yang sedang aktif
  stored: Theme | null; // Nilai dari localStorage (bisa null jika belum pernah disimpan)
}
```

### StatItem (About Section)

```typescript
interface StatItem {
  label: string;   // Contoh: "Proyek Selesai"
  value: number;   // Contoh: 120
  suffix: string;  // Contoh: "+" atau "%"
}
```

### FeatureCard

```typescript
interface FeatureCard {
  icon: string;        // SVG string atau emoji
  title: string;       // Judul fitur (maks. 4 kata)
  description: string; // Deskripsi singkat (maks. 2 kalimat)
}
```

### PortfolioItem

```typescript
interface PortfolioItem {
  id: string;
  title: string;
  category: string;   // Contoh: "web", "mobile", "design"
  imageUrl: string;   // Path relatif atau placeholder URL
  linkUrl: string;    // URL proyek (bisa '#' untuk demo)
}
```

### TestimonialItem

```typescript
interface TestimonialItem {
  id: string;
  name: string;        // Nama klien
  role: string;        // Jabatan / perusahaan
  avatarUrl: string;   // URL foto avatar
  quote: string;       // Teks testimoni
}
```

### FormData

```typescript
interface ContactFormData {
  name: string;     // Nama lengkap (wajib)
  email: string;    // Alamat email valid (wajib)
  subject: string;  // Subjek pesan (wajib)
  message: string;  // Isi pesan (wajib)
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<keyof ContactFormData, string | null>;
}
```

### CarouselState

```typescript
interface CarouselState {
  currentIndex: number;   // Index slide yang tampil (0-based)
  total: number;          // Total jumlah slide
  isAutoPlaying: boolean; // Status auto-play
  intervalId: number | null;
}
```

### SpotlightState

```typescript
interface SpotlightState {
  x: number;         // Posisi X kursor (px)
  y: number;         // Posisi Y kursor (px)
  isVisible: boolean; // Apakah overlay terlihat
  isEnabled: boolean; // Aktif hanya pada mode gelap
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Semua Section Tercakup oleh Tautan Navigasi

*For any* section ID yang ada di dalam dokumen, harus terdapat tepat satu tautan di Navbar yang atribut `href`-nya menunjuk ke ID section tersebut (`href="#<sectionId>"`).

**Validates: Requirements 1.2**

---

### Property 2: Scroll Halus Berlaku untuk Semua Tautan Navigasi

*For any* tautan navigasi yang di-klik, perilaku scroll ke section target harus terjadi dengan `behavior: 'smooth'` — tidak ada hard jump ke posisi tujuan.

**Validates: Requirements 1.3**

---

### Property 3: Navbar Berubah Tampilan Sesuai Posisi Scroll

*For any* posisi scroll `y`, jika `y` lebih besar dari tinggi Hero Section maka `<header>` harus memiliki kelas `scrolled`; jika `y` sama dengan 0 maka kelas `scrolled` tidak boleh ada.

**Validates: Requirements 1.4**

---

### Property 4: Cursor Spotlight Melacak Posisi Kursor

*For any* koordinat kursor `(x, y)` di dalam dokumen, setelah event `mousemove` pada koordinat tersebut, nilai CSS custom property `--spotlight-x` harus sama dengan `x` dan `--spotlight-y` harus sama dengan `y`.

**Validates: Requirements 2.4, 8.2**

---

### Property 5: Animasi Counter Berjalan dari 0 ke Nilai Target

*For any* elemen stat counter dengan nilai target `n`, ketika IntersectionObserver memicunya, nilai yang ditampilkan harus mulai dari 0 dan berakhir tepat di `n`.

**Validates: Requirements 3.3**

---

### Property 6: Animasi Counter Berjalan Hanya Satu Kali (Idempotent)

*For any* elemen stat counter yang animasinya sudah selesai berjalan, memicu ulang IntersectionObserver callback pada elemen yang sama tidak boleh mereset atau mengulangi animasi counter.

**Validates: Requirements 3.4**

---

### Property 7: Setiap Feature Card Mengandung Tiga Komponen Wajib

*For any* elemen feature card yang di-render di halaman, card tersebut harus mengandung: (1) satu elemen ikon (SVG atau emoji), (2) satu elemen judul, dan (3) satu elemen deskripsi — semuanya tidak boleh kosong.

**Validates: Requirements 4.2**

---

### Property 8: Hover pada Card Menerapkan Efek Elevasi

*For any* elemen feature card, setelah event `mouseenter` dikirimkan, elemen tersebut harus memiliki kelas atau style yang menghasilkan efek elevasi (transform scale dan/atau box-shadow yang meningkat).

**Validates: Requirements 4.3**

---

### Property 9: Filter Portfolio Menampilkan Item yang Tepat

*For any* kategori filter `c` yang dipilih:
- Jika `c` adalah `"all"`, maka semua item portfolio harus terlihat (tidak ada yang tersembunyi).
- Jika `c` bukan `"all"`, maka semua item yang terlihat harus memiliki `data-category === c`, dan semua item dengan kategori berbeda harus tersembunyi.

**Validates: Requirements 5.3, 5.4**

---

### Property 10: Hover pada Item Portfolio Menampilkan Overlay

*For any* elemen portfolio item, setelah event `mouseenter` dikirimkan, elemen overlay di dalamnya (berisi judul dan ikon tautan) harus menjadi terlihat (opacity > 0 atau class overlay-visible aktif).

**Validates: Requirements 5.5**

---

### Property 11: Navigasi Carousel Mempertahankan Index yang Benar

*For any* kondisi carousel dengan `currentIndex` dan `total` slide, menekan tombol **next** harus menghasilkan `(currentIndex + 1) % total`, dan menekan tombol **prev** harus menghasilkan `(currentIndex - 1 + total) % total`. Tidak ada index yang boleh keluar dari rentang `[0, total - 1]`.

**Validates: Requirements 6.3**

---

### Property 12: Interaksi Carousel Menjeda Auto-Play

*For any* kondisi carousel yang sedang dalam mode auto-play, ketika pengguna mengklik tombol navigasi, `intervalId` yang aktif harus di-clear, dan setelah 10.000 ms auto-play harus berjalan kembali dengan interval baru.

**Validates: Requirements 6.5**

---

### Property 13: Validasi Form Memblokir Pengiriman dengan Field Kosong atau Email Tidak Valid

*For any* kombinasi nilai form di mana: (a) setidaknya satu field wajib (nama, email, subjek, pesan) kosong atau hanya berisi whitespace, atau (b) field email terisi dengan format yang tidak valid (tidak mengandung `@` dan domain) — maka:
- Fungsi `submit` tidak boleh melanjutkan ke tahap "berhasil terkirim".
- Pesan error inline harus muncul tepat di bawah setiap field yang bermasalah.

**Validates: Requirements 7.2, 7.3**

---

### Property 14: Pengiriman Form Berhasil Mereset Semua Field

*For any* data form yang valid (semua field terisi dengan benar), setelah pengiriman berhasil, nilai setiap elemen input (`name`, `email`, `subject`, `message`) harus kembali menjadi string kosong `""`.

**Validates: Requirements 7.5**

---

### Property 15: Spotlight Dinonaktifkan pada Mode Terang

*For any* kondisi di mana tema aktif adalah `"light"`, elemen overlay Cursor Spotlight harus tidak terlihat — baik opacity-nya 0 atau properti `isEnabled` pada `spotlightEffect` bernilai `false`.

**Validates: Requirements 8.6**

---

### Property 16: Tidak Ada Overflow Horizontal pada Rentang Viewport

*For any* lebar viewport `w` dalam rentang `[320px, 2560px]`, tidak ada satu pun elemen di halaman yang memiliki lebar melebihi `w` (tidak ada overflow horizontal).

**Validates: Requirements 9.1**

---

### Property 17: Hamburger Menu Toggle Bersifat Round-Trip

*For any* kondisi awal menu mobile (terbuka atau tertutup), mengklik tombol hamburger dua kali berturut-turut harus mengembalikan menu ke kondisi semula. Dengan kata lain, satu klik membalik kondisi, dan dua klik mengembalikan kondisi awal.

**Validates: Requirements 9.3**

---

### Property 18: Setiap Gambar Memiliki Atribut Alt yang Tidak Kosong

*For any* elemen `<img>` yang ada di dalam dokumen, elemen tersebut harus memiliki atribut `alt` dengan nilai string yang tidak kosong dan tidak hanya berisi whitespace.

**Validates: Requirements 9.5**

---

### Property 19: Tombol Scroll to Top Muncul dan Menghilang Berdasarkan Posisi Scroll

*For any* nilai scroll `y`:
- Jika `y > 300`, tombol `#scroll-top-btn` harus terlihat (tidak memiliki class `hidden` atau style `display: none`).
- Jika `y <= 300`, tombol tersebut harus tidak terlihat.

**Validates: Requirements 10.5**

---

## Error Handling

### Validasi Formulir Kontak

- **Field kosong**: Setiap field wajib diperiksa pada saat `submit`. Pesan error inline ditampilkan tepat di bawah field yang bermasalah. Form tidak dikirim hingga semua field valid.
- **Format email tidak valid**: Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` digunakan sebagai validasi dasar. Pesan spesifik: `"Format email tidak valid"` ditampilkan di bawah field email.
- **Kesalahan jaringan (simulasi)**: Karena form ini adalah simulasi (tidak ada backend nyata), semua pengiriman yang lolos validasi dianggap berhasil. Toast sukses selalu ditampilkan.

### Cursor Spotlight

- **Perangkat sentuh (touch)**: Event `mousemove` tidak terpicu pada layar sentuh. Spotlight tidak perlu aktif di mobile — implementasi menggunakan deteksi `'ontouchstart' in window` untuk menonaktifkan spotlight pada perangkat sentuh, menghindari perilaku tidak terduga.
- **Performa**: `requestAnimationFrame` digunakan untuk throttle update posisi spotlight guna menghindari jank pada layar dengan refresh rate tinggi.

### Tema

- **localStorage tidak tersedia**: Jika `localStorage` melempar exception (misal: mode private browser tertentu), tema default `'dark'` tetap diterapkan tanpa menyimpan preferensi. `try/catch` digunakan di sekitar semua operasi localStorage.

### Carousel

- **Total slide kurang dari 2**: Jika hanya ada 1 slide, tombol navigasi disembunyikan dan auto-play tidak diaktifkan.
- **Index di luar batas**: Semua kalkulasi index menggunakan modulo `% total` untuk memastikan index selalu dalam rentang `[0, total - 1]`.

### Counter Animasi

- **Nilai target bukan angka**: Jika `data-target` bukan angka valid, counter menampilkan nilai `0` tanpa animasi (fallback graceful).
- **Elemen tidak ditemukan**: Semua query DOM dibungkus dengan null check sebelum manipulasi.

---

## Testing Strategy

### Pendekatan Pengujian Ganda (Dual Testing)

Feature ini menggunakan pendekatan kombinasi:
1. **Unit Tests (Example-based)** — untuk behavior spesifik, edge case, dan integrasi komponen.
2. **Property-Based Tests (PBT)** — untuk memvalidasi properti universal yang harus berlaku di semua input.

### Library yang Digunakan

- **Framework pengujian**: [Vitest](https://vitest.dev/) (kompatibel dengan browser environment via `happy-dom` atau `jsdom`)
- **Property-Based Testing**: [fast-check](https://fast-check.io/) — library PBT untuk JavaScript/TypeScript
- **DOM simulation**: `jsdom` atau `happy-dom` via Vitest config

### Konfigurasi Property Tests

```javascript
// vitest.config.js
export default {
  test: {
    environment: 'jsdom',
  }
}
```

```javascript
// Setiap property test dikonfigurasi dengan minimum 100 iterasi
fc.assert(fc.property(...), { numRuns: 100 });
```

### Tag Format untuk Property Tests

Setiap property test harus diberi komentar tag berikut:
```
// Feature: unique-simple-website, Property <N>: <property_text>
```

### Unit Tests (Example-based)

| Komponen | Skenario yang Diuji |
|---|---|
| `themeManager` | Default dark mode pada load; toggle mengubah data-theme; persistensi ke localStorage |
| `spotlightEffect` | Tidak terlihat saat load; muncul setelah mousemove pertama; dinonaktifkan di light mode |
| `navbarController` | Semua section hadir dan berurutan; hamburger ada di mobile |
| `counterAnimation` | Gradient ukuran 400–600px; elemen CSS vars teraplikasi |
| `testimonialCarousel` | Minimal 3 slide ada; auto-play interval 5000ms; pause setelah interaksi |
| `contactForm` | Semua 4 field hadir; toast muncul setelah valid submit; footer berisi brand + copyright |
| `scrollTopButton` | Klik CTA hero scroll ke About; klik scroll-top mengembalikan ke top |

### Property-Based Tests

Setiap properti berikut diimplementasikan sebagai satu property-based test dengan minimum 100 iterasi:

| Property | Generator | Invariant |
|---|---|---|
| P1: Nav links cover all sections | Daftar section IDs acak | Setiap ID harus memiliki link nav yang sesuai |
| P4: Spotlight tracks cursor | Koordinat (x, y) acak dalam bounds dokumen | CSS vars harus sama dengan input |
| P5: Counter 0→target | Nilai target integer positif acak | Nilai akhir counter = target |
| P6: Counter idempotent | Elemen counter yang sudah selesai | Trigger ulang tidak restart animasi |
| P7: Card has 3 components | Instance FeatureCard acak | Icon + title + description hadir |
| P8: Card hover elevation | Card element acak | Mouseenter → elevation class/style teraplikasi |
| P9: Portfolio filter | Kategori acak dari set yang valid | Items yang ditampilkan match kategori |
| P11: Carousel index bounds | (currentIndex, total) acak | next/prev menghasilkan index dalam [0, total-1] |
| P13: Form validation | Kombinasi field kosong/invalid acak | Submit gagal, error inline tampil |
| P14: Form reset after submit | Data form valid acak | Semua field kosong setelah submit |
| P16: No horizontal overflow | Viewport width acak dalam [320, 2560] | Tidak ada element overflow |
| P17: Hamburger round-trip | Kondisi menu acak (open/closed) | Dua klik mengembalikan kondisi semula |
| P18: Alt attributes | Semua img element di dokumen | Setiap img punya non-empty alt |
| P19: Scroll-top button visibility | Nilai scrollY acak | Tombol visible ↔ scrollY > 300 |

### Testing Strategy untuk Kriteria Non-PBT

Untuk kriteria yang tidak cocok untuk PBT (SMOKE, EXAMPLE, integrasi visual):
- **Responsivitas**: Pengujian manual di Chrome DevTools pada breakpoint 320px, 768px, 1024px, 1440px
- **WCAG Contrast**: Pemeriksaan menggunakan alat seperti [axe DevTools](https://www.deque.com/axe/) atau [Lighthouse Accessibility Audit](https://developer.chrome.com/docs/lighthouse/)
- **Animasi CSS**: Pengujian manual untuk memverifikasi transisi halus dan tidak mengganggu readability
- **Cursor Spotlight visual**: Pengujian manual di browser desktop untuk memverifikasi gradien radial dan ukuran 400–600px

> **Catatan WCAG**: Full WCAG compliance validation memerlukan pengujian manual dengan assistive technologies dan expert accessibility review. Automated tools dapat mendeteksi sebagian besar isu kontras dan struktur semantik, namun tidak menggantikan pengujian manual.
