# Implementation Plan: unique-simple-website

## Overview

Implementasi website satu halaman modern menggunakan HTML5, Tailwind CSS via CDN, dan Vanilla JavaScript dengan Module Pattern (IIFE). Pengembangan dilakukan secara inkremental: mulai dari struktur HTML dan fondasi CSS, kemudian setiap modul JS, lalu pengujian property-based menggunakan Vitest + fast-check + jsdom.

---

## Tasks

- [-] 1. Buat struktur HTML dasar dan konfigurasi proyek
  - Buat file `index.html` dengan elemen semantik lengkap (`<header>`, `<main>`, `<section>`, `<footer>`)
  - Sertakan semua section berurutan: Navbar, Hero, About, Features, Portfolio, Testimonials, Contact, dan Footer
  - Tambahkan `<div id="spotlight-overlay">` dan `<button id="scroll-top-btn">`
  - Integrasikan Tailwind CSS via CDN dan Google Fonts (opsional) di `<head>`
  - Buat file `vitest.config.js` dengan environment `jsdom` dan pasang dependensi `vitest` serta `fast-check`
  - Buat file `app.js` dengan kerangka IIFE kosong untuk setiap modul
  - _Requirements: 1.1, 9.4, 10.1, 10.2_

- [~] 2. Implementasi CSS custom properties, animasi, dan fondasi visual
  - Tambahkan blok `<style>` di `index.html` untuk CSS custom properties (warna tema, spotlight vars)
  - Implementasikan CSS `#spotlight-overlay` dengan `radial-gradient`, `pointer-events: none`, dan `transition: opacity`
  - Tambahkan keyframe animasi `fade-in` dan `slide-up` untuk Hero section
  - Definisikan class utility `.scrolled` untuk Navbar
  - _Requirements: 2.3, 8.3_

- [ ] 3. Implementasi modul `themeManager`
  - [~] 3.1 Tulis implementasi `themeManager` (init, toggle, getCurrent, applyTheme)
    - Baca preferensi dari `localStorage` dengan `try/catch` fallback ke `'dark'`
    - Terapkan `data-theme` ke elemen `<html>` dan update CSS custom properties
    - Hubungkan Theme_Toggle button di Navbar ke `themeManager.toggle()`
    - _Requirements: 1.5, 1.6_

  - [~] 3.2 Tulis unit test untuk `themeManager`
    - Test: default dark mode saat pertama load (tidak ada localStorage)
    - Test: `toggle()` mengubah `data-theme` dari `'dark'` ke `'light'` dan sebaliknya
    - Test: preferensi tersimpan dan terbaca kembali dari `localStorage`
    - Test: fallback graceful jika `localStorage` throws exception
    - _Requirements: 1.5, 1.6_

- [ ] 4. Implementasi modul `spotlightEffect`
  - [~] 4.1 Tulis implementasi `spotlightEffect` (init, update, show, hide, setMode, _onMouseMove)
    - Pasang event listener `mousemove` pada `document`
    - Set CSS vars `--spotlight-x` dan `--spotlight-y` dari koordinat event
    - Gunakan `requestAnimationFrame` untuk throttle update
    - Implementasikan deteksi `'ontouchstart' in window` untuk nonaktifkan di touch device
    - Overlay tidak terlihat (`opacity: 0`) sampai `mousemove` pertama
    - Panggil `setMode(theme)` agar spotlight nonaktif di light mode
    - _Requirements: 2.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [~] 4.2 Tulis property test untuk `spotlightEffect` — Property 4
    - **Property 4: Cursor Spotlight Melacak Posisi Kursor**
    - **Validates: Requirements 2.4, 8.2**
    - Generator: koordinat `(x, y)` integer acak dalam `[0, 2000]`
    - Invariant: setelah dispatch `mousemove`, `--spotlight-x === x` dan `--spotlight-y === y`
    - `fc.assert(fc.property(fc.integer(0, 2000), fc.integer(0, 2000), ...), { numRuns: 100 })`

  - [~] 4.3 Tulis property test untuk `spotlightEffect` — Property 15
    - **Property 15: Spotlight Dinonaktifkan pada Mode Terang**
    - **Validates: Requirements 8.6**
    - Invariant: ketika `themeManager.getCurrent() === 'light'`, overlay opacity adalah `0` atau `isEnabled === false`
    - `fc.assert(fc.property(...), { numRuns: 100 })`

- [ ] 5. Implementasi modul `navbarController`
  - [~] 5.1 Tulis implementasi `navbarController` (init, onScroll, _heroObserver)
    - Pasang `scroll` event listener dan `IntersectionObserver` pada Hero section
    - Tambah/hapus class `scrolled` pada `<header>` saat Hero keluar dari viewport
    - Implementasikan hamburger menu toggle dengan animasi untuk layar < 768px
    - _Requirements: 1.4, 9.2, 9.3_

  - [~] 5.2 Tulis property test untuk `navbarController` — Property 3
    - **Property 3: Navbar Berubah Tampilan Sesuai Posisi Scroll**
    - **Validates: Requirements 1.4**
    - Generator: nilai `scrollY` acak integer
    - Invariant: jika `scrollY > heroHeight` → `<header>` punya class `scrolled`; jika `scrollY === 0` → tidak ada class `scrolled`
    - `fc.assert(fc.property(fc.integer(0, 5000), ...), { numRuns: 100 })`

  - [~] 5.3 Tulis property test untuk `navbarController` — Property 17
    - **Property 17: Hamburger Menu Toggle Bersifat Round-Trip**
    - **Validates: Requirements 9.3**
    - Invariant: dua kali klik hamburger mengembalikan kondisi menu ke kondisi awal
    - `fc.assert(fc.property(fc.boolean(), ...), { numRuns: 100 })`

- [ ] 6. Implementasi konten HTML Navbar dan navigasi
  - Tambahkan tautan navigasi ke setiap section (`href="#hero"`, `href="#about"`, dst.) di dalam `<nav>`
  - Tambahkan atribut `data-scroll-to` pada setiap tautan navigasi
  - Implementasikan modul `smoothScroll` (init, to): delegasi klik `[data-scroll-to]` → `scrollIntoView({ behavior: 'smooth' })`
  - _Requirements: 1.2, 1.3_

  - [~] 6.1 Tulis implementasi `smoothScroll`
    - Delegasikan event klik pada semua elemen `[data-scroll-to]`
    - Panggil `document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' })`
    - _Requirements: 1.3, 2.5_

  - [~] 6.2 Tulis property test untuk navigasi — Property 1
    - **Property 1: Semua Section Tercakup oleh Tautan Navigasi**
    - **Validates: Requirements 1.2**
    - Generator: daftar section IDs acak dari set `['hero','about','features','portfolio','testimonials','contact']`
    - Invariant: setiap section ID memiliki tepat satu `<a href="#sectionId">` di navbar
    - `fc.assert(fc.property(fc.subarray([...sectionIds]), ...), { numRuns: 100 })`

  - [~] 6.3 Tulis property test untuk navigasi — Property 2
    - **Property 2: Scroll Halus Berlaku untuk Semua Tautan Navigasi**
    - **Validates: Requirements 1.3**
    - Invariant: memanggil `smoothScroll.to(targetId)` pada semua target memanggil `scrollIntoView` dengan `{ behavior: 'smooth' }`

- [~] 7. Implementasi Hero Section dan konten About Section
  - Tulis HTML Hero section: headline, tagline, minimal 1 CTA_Button dengan `data-scroll-to="#about"`
  - Terapkan kelas animasi `fade-in` dan `slide-up` pada headline dan CTA via JS setelah `DOMContentLoaded`
  - Tulis HTML About section: teks deskriptif dan minimal 3 item stat dengan `data-target` dan class `stat-counter`
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2_

- [ ] 8. Implementasi modul `counterAnimation`
  - [~] 8.1 Tulis implementasi `counterAnimation` (init, start, _animate, _hasRun)
    - Gunakan `IntersectionObserver` pada semua `.stat-counter`
    - Animasi integer dari `0` ke `data-target` menggunakan `requestAnimationFrame`
    - Simpan elemen yang sudah selesai di `_hasRun: Set<Element>` untuk mencegah pengulangan
    - Fallback graceful jika `data-target` bukan angka valid (tampilkan `0`)
    - _Requirements: 3.3, 3.4_

  - [~] 8.2 Tulis property test untuk `counterAnimation` — Property 5
    - **Property 5: Animasi Counter Berjalan dari 0 ke Nilai Target**
    - **Validates: Requirements 3.3**
    - Generator: nilai target integer positif acak `fc.integer(1, 9999)`
    - Invariant: nilai akhir yang ditampilkan elemen tepat sama dengan target
    - `fc.assert(fc.property(fc.integer(1, 9999), ...), { numRuns: 100 })`

  - [~] 8.3 Tulis property test untuk `counterAnimation` — Property 6
    - **Property 6: Animasi Counter Berjalan Hanya Satu Kali (Idempotent)**
    - **Validates: Requirements 3.4**
    - Invariant: memicu IntersectionObserver callback dua kali pada elemen yang sama tidak mengulang animasi
    - `fc.assert(fc.property(...), { numRuns: 100 })`

- [ ] 9. Implementasi Features Section
  - Tulis HTML Features section: minimal 6 card dengan class `feature-card`, tiap card memuat ikon, judul, dan deskripsi
  - Implementasikan grid responsif Tailwind: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - Implementasikan modul `cardHoverEffects`: pasang `mouseenter`/`mouseleave` untuk menambah class elevasi (scale + shadow)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [~] 9.1 Tulis implementasi HTML dan `cardHoverEffects`
    - Setiap `.feature-card` harus memiliki elemen ikon, elemen judul (`h3`), dan elemen deskripsi (`p`)
    - `mouseenter` → tambah class `scale-105 shadow-xl`; `mouseleave` → hapus class tersebut
    - _Requirements: 4.2, 4.3_

  - [~] 9.2 Tulis property test untuk Features — Property 7
    - **Property 7: Setiap Feature Card Mengandung Tiga Komponen Wajib**
    - **Validates: Requirements 4.2**
    - Generator: daftar data `FeatureCard` acak (icon, title, description non-empty)
    - Invariant: setiap card yang di-render memiliki elemen ikon, judul, dan deskripsi yang tidak kosong
    - `fc.assert(fc.property(fc.array(featureCardArb, { minLength: 1 }), ...), { numRuns: 100 })`

  - [~] 9.3 Tulis property test untuk Features — Property 8
    - **Property 8: Hover pada Card Menerapkan Efek Elevasi**
    - **Validates: Requirements 4.3**
    - Invariant: setelah dispatch `mouseenter` pada `.feature-card`, elemen memiliki class/style yang mengindikasikan elevasi
    - `fc.assert(fc.property(...), { numRuns: 100 })`

- [ ] 10. Implementasi Portfolio Section
  - Tulis HTML Portfolio section: minimal 6 item dengan `class="portfolio-item"` dan `data-category`
  - Tambahkan tombol filter dengan `class="filter-btn"` dan `data-filter` untuk tiap kategori plus `"all"`
  - Tiap item portfolio memiliki elemen overlay (judul + ikon link) yang tersembunyi secara default
  - Implementasikan modul `portfolioFilter` (init, apply, _animateItems)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [~] 10.1 Tulis implementasi `portfolioFilter`
    - `apply('all')` → tampilkan semua item; `apply(category)` → tampilkan hanya item dengan `data-category === category`
    - Gunakan animasi CSS transition (opacity + transform) saat show/hide item
    - Pasang `mouseenter`/`mouseleave` pada tiap item untuk tampilkan overlay
    - _Requirements: 5.3, 5.4, 5.5_

  - [~] 10.2 Tulis property test untuk Portfolio — Property 9
    - **Property 9: Filter Portfolio Menampilkan Item yang Tepat**
    - **Validates: Requirements 5.3, 5.4**
    - Generator: kategori acak dari set valid (misal `fc.constantFrom('web','mobile','design','all')`)
    - Invariant: jika `c === 'all'` semua item visible; jika bukan, semua visible item memiliki `data-category === c`
    - `fc.assert(fc.property(fc.constantFrom('web','mobile','design','all'), ...), { numRuns: 100 })`

  - [~] 10.3 Tulis property test untuk Portfolio — Property 10
    - **Property 10: Hover pada Item Portfolio Menampilkan Overlay**
    - **Validates: Requirements 5.5**
    - Invariant: dispatch `mouseenter` → overlay elemen memiliki `opacity > 0` atau class `overlay-visible`
    - `fc.assert(fc.property(...), { numRuns: 100 })`

- [~] 11. Checkpoint — Pastikan semua tes unit dan property berjalan
  - Pastikan semua tes pass, tanyakan kepada user jika ada pertanyaan atau kendala sebelum melanjutkan.

- [ ] 12. Implementasi Testimonials Section
  - Tulis HTML Testimonials section: minimal 3 slide (`testimonial-slide`) dengan avatar, nama, jabatan, dan kutipan
  - Tambahkan tombol navigasi prev/next carousel dan indikator slide
  - Implementasikan modul `testimonialCarousel` (init, navigate, goTo, _autoPlay, _pauseAndResume)
  - Auto-play setiap 5000ms; pause 10000ms setelah interaksi user
  - Sembunyikan tombol navigasi jika total slide < 2
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [~] 12.1 Tulis implementasi `testimonialCarousel`
    - `navigate('next')` → `(currentIndex + 1) % total`
    - `navigate('prev')` → `(currentIndex - 1 + total) % total`
    - `_pauseAndResume()` → `clearInterval`, `setTimeout(restart, 10000)`
    - _Requirements: 6.3, 6.5_

  - [~] 12.2 Tulis property test untuk Carousel — Property 11
    - **Property 11: Navigasi Carousel Mempertahankan Index yang Benar**
    - **Validates: Requirements 6.3**
    - Generator: `fc.integer(2, 20)` untuk total, `fc.integer(0, 19)` untuk currentIndex (dibatasi < total)
    - Invariant: next → `(idx + 1) % total`; prev → `(idx - 1 + total) % total`; selalu dalam `[0, total - 1]`
    - `fc.assert(fc.property(...), { numRuns: 100 })`

  - [~] 12.3 Tulis property test untuk Carousel — Property 12
    - **Property 12: Interaksi Carousel Menjeda Auto-Play**
    - **Validates: Requirements 6.5**
    - Invariant: klik tombol navigasi → `intervalId` aktif di-clear; setelah 10000ms auto-play berjalan kembali
    - `fc.assert(fc.property(...), { numRuns: 100 })`

- [ ] 13. Implementasi Contact Section dan modul form
  - Tulis HTML Contact section: form dengan field `name`, `email`, `subject`, `message` (semua wajib)
  - Tambahkan elemen error inline (awalnya tersembunyi) di bawah tiap field
  - Tambahkan info kontak alternatif (email, telepon, media sosial)
  - Implementasikan modul `contactForm` (init, validate, _validateField, submit, reset)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [~] 13.1 Tulis implementasi `contactForm` dan `toastNotification`
    - `_validateField`: field kosong/whitespace → tampilkan error; email tidak match regex → tampilkan "Format email tidak valid"
    - `submit`: panggil `validate()`; jika gagal return early; jika lolos panggil `toastNotification.show(...)` lalu `reset()`
    - `toastNotification.show(message, type, duration)`: buat elemen DOM, animate in, hapus setelah `duration` ms
    - Toast sukses tampil 3000ms
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

  - [~] 13.2 Tulis property test untuk Form — Property 13
    - **Property 13: Validasi Form Memblokir Pengiriman dengan Field Kosong atau Email Tidak Valid**
    - **Validates: Requirements 7.2, 7.3**
    - Generator: kombinasi `fc.record` dengan field yang bisa kosong, whitespace-only, atau email invalid
    - Invariant: `validate()` mengembalikan `false` dan error inline tampil; submit tidak lanjut ke "berhasil"
    - `fc.assert(fc.property(invalidFormDataArb, ...), { numRuns: 100 })`

  - [~] 13.3 Tulis property test untuk Form — Property 14
    - **Property 14: Pengiriman Form Berhasil Mereset Semua Field**
    - **Validates: Requirements 7.5**
    - Generator: data form valid acak `fc.record({ name: fc.string({minLength:1}), email: validEmailArb, subject: fc.string({minLength:1}), message: fc.string({minLength:1}) })`
    - Invariant: setelah `submit` berhasil, nilai tiap input adalah string kosong `""`
    - `fc.assert(fc.property(validFormDataArb, ...), { numRuns: 100 })`

- [ ] 14. Implementasi `scrollTopButton` dan Footer
  - Tulis HTML Footer: nama/brand, tautan navigasi singkat, dan teks hak cipta
  - Implementasikan modul `scrollTopButton` (init, toggle, scrollUp)
  - `toggle()`: tampilkan `#scroll-top-btn` jika `window.scrollY > 300`, sembunyikan jika tidak
  - `scrollUp()`: `window.scrollTo({ top: 0, behavior: 'smooth' })`
  - _Requirements: 10.3, 10.4, 10.5_

  - [~] 14.1 Tulis implementasi `scrollTopButton`
    - Pasang `scroll` event listener → panggil `toggle()`
    - Pasang `click` event listener pada `#scroll-top-btn` → panggil `scrollUp()`
    - _Requirements: 10.4, 10.5_

  - [~] 14.2 Tulis property test untuk scrollTopButton — Property 19
    - **Property 19: Tombol Scroll to Top Muncul dan Menghilang Berdasarkan Posisi Scroll**
    - **Validates: Requirements 10.5**
    - Generator: nilai `scrollY` acak `fc.integer(0, 3000)`
    - Invariant: jika `scrollY > 300` → tombol visible; jika `scrollY <= 300` → tombol tersembunyi
    - `fc.assert(fc.property(fc.integer(0, 3000), ...), { numRuns: 100 })`

- [ ] 15. Implementasi aksesibilitas dan atribut semantik
  - [~] 15.1 Tambahkan atribut `alt` deskriptif pada semua elemen `<img>` di seluruh dokumen
    - Pastikan tidak ada `<img>` dengan `alt=""` atau tanpa atribut `alt`
    - _Requirements: 9.5_

  - [~] 15.2 Tulis property test untuk aksesibilitas — Property 18
    - **Property 18: Setiap Gambar Memiliki Atribut Alt yang Tidak Kosong**
    - **Validates: Requirements 9.5**
    - Invariant: semua elemen `document.querySelectorAll('img')` memiliki `alt` dengan nilai non-empty dan bukan whitespace
    - `fc.assert(fc.property(...), { numRuns: 100 })`

  - [~] 15.3 Verifikasi elemen semantik HTML5 dan responsivitas
    - Pastikan `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` digunakan dengan benar
    - Verifikasi grid responsif (1/2/3 kolom) berfungsi di breakpoint Tailwind yang tepat
    - Verifikasi hamburger menu tampil pada layar < 768px
    - _Requirements: 9.1, 9.2, 9.4_

- [ ] 16. Implementasi responsivitas lebar viewport dan validasi overflow
  - Terapkan kelas Tailwind responsif pada semua section untuk mendukung viewport 320px–2560px
  - Pastikan tidak ada elemen dengan `width` atau `overflow-x: scroll` yang melebihi viewport
  - _Requirements: 9.1_

  - [~] 16.1 Tulis property test untuk responsivitas — Property 16
    - **Property 16: Tidak Ada Overflow Horizontal pada Rentang Viewport**
    - **Validates: Requirements 9.1**
    - Generator: lebar viewport acak `fc.integer(320, 2560)`
    - Invariant: setelah set `document.body.style.width = w + 'px'`, tidak ada elemen dengan `offsetWidth > w`
    - `fc.assert(fc.property(fc.integer(320, 2560), ...), { numRuns: 100 })`

- [~] 17. Inisialisasi semua modul dan wiring akhir
  - Di bagian bawah `app.js` (atau `<script>` dalam `index.html`), panggil `init()` pada semua modul dalam urutan:
    `themeManager.init()` → `spotlightEffect.init()` → `navbarController.init()` → `smoothScroll.init()` → `counterAnimation.init()` → `cardHoverEffects.init()` → `portfolioFilter.init()` → `testimonialCarousel.init()` → `contactForm.init()` → `scrollTopButton.init()`
  - Pastikan semua modul terpanggil setelah `DOMContentLoaded`
  - _Requirements: 1.1, 2.3, 10.1_

- [~] 18. Checkpoint akhir — Pastikan semua tes pass dan fitur terintegrasi
  - Pastikan semua tes pass, tanyakan kepada user jika ada pertanyaan atau kendala sebelum deployment.

---

## Notes

- Task yang ditandai `*` adalah opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Property test menggunakan `fast-check` dengan minimal 100 iterasi (`numRuns: 100`)
- Semua property test harus diberi komentar tag: `// Feature: unique-simple-website, Property N: <teks>`
- Unit test dan property test bersifat komplementer, bukan pengganti satu sama lain
- Vitest dijalankan dengan `vitest --run` (single execution, bukan watch mode) untuk CI/CD
- Full WCAG compliance memerlukan pengujian manual dengan assistive technologies

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "7"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1", "6.1", "8.1", "9.1", "10.1", "12.1", "13.1", "14.1", "15.1", "15.3"] },
    { "id": 3, "tasks": ["3.2", "4.2", "4.3", "5.2", "5.3", "6.2", "6.3", "8.2", "8.3", "9.2", "9.3", "10.2", "10.3", "12.2", "12.3", "13.2", "13.3", "14.2", "15.2", "16.1"] },
    { "id": 4, "tasks": ["17"] }
  ]
}
```
