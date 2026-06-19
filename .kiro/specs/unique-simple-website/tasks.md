# Implementation Plan: unique-simple-website

## Overview

Implementasi website satu halaman modern menggunakan HTML5, Tailwind CSS via CDN, dan Vanilla JavaScript dengan Module Pattern (IIFE). Pengembangan dilakukan secara inkremental: mulai dari struktur HTML dan fondasi CSS, kemudian setiap modul JS.

---

## Tasks

- [x] 1. Buat struktur HTML dasar dan konfigurasi proyek
  - Buat file `index.html` dengan elemen semantik lengkap (`<header>`, `<main>`, `<section>`, `<footer>`)
  - Sertakan semua section berurutan: Navbar, Hero, About, Features, Portfolio, Testimonials, Contact, dan Footer
  - Tambahkan `<div id="spotlight-overlay">` dan `<button id="scroll-top-btn">`
  - Integrasikan Tailwind CSS via CDN dan Google Fonts (opsional) di `<head>`
  - Buat file `vitest.config.js` dengan environment `jsdom` dan pasang dependensi `vitest` serta `fast-check`
  - Buat file `app.js` dengan kerangka IIFE kosong untuk setiap modul
  - _Requirements: 1.1, 9.4, 10.1, 10.2_

- [x] 2. Implementasi CSS custom properties, animasi, dan fondasi visual
  - Tambahkan blok `<style>` di `index.html` untuk CSS custom properties (warna tema, spotlight vars)
  - Implementasikan CSS `#spotlight-overlay` dengan `radial-gradient`, `pointer-events: none`, dan `transition: opacity`
  - Tambahkan keyframe animasi `fade-in` dan `slide-up` untuk Hero section
  - Definisikan class utility `.scrolled` untuk Navbar
  - _Requirements: 2.3, 8.3_

- [x] 3. Implementasi modul `themeManager`
  - [x] 3.1 Tulis implementasi `themeManager` (init, toggle, getCurrent, applyTheme)
    - Baca preferensi dari `localStorage` dengan `try/catch` fallback ke `'dark'`
    - Terapkan `data-theme` ke elemen `<html>` dan update CSS custom properties
    - Hubungkan Theme_Toggle button di Navbar ke `themeManager.toggle()`
    - _Requirements: 1.5, 1.6_

- [x] 4. Implementasi modul `spotlightEffect`
  - [x] 4.1 Tulis implementasi `spotlightEffect` (init, update, show, hide, setMode, _onMouseMove)
    - Pasang event listener `mousemove` pada `document`
    - Set CSS vars `--spotlight-x` dan `--spotlight-y` dari koordinat event
    - Gunakan `requestAnimationFrame` untuk throttle update
    - Implementasikan deteksi `'ontouchstart' in window` untuk nonaktifkan di touch device
    - Overlay tidak terlihat (`opacity: 0`) sampai `mousemove` pertama
    - Panggil `setMode(theme)` agar spotlight nonaktif di light mode
    - _Requirements: 2.4, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 5. Implementasi modul `navbarController`
  - [x] 5.1 Tulis implementasi `navbarController` (init, onScroll, _heroObserver)
    - Pasang `scroll` event listener dan `IntersectionObserver` pada Hero section
    - Tambah/hapus class `scrolled` pada `<header>` saat Hero keluar dari viewport
    - Implementasikan hamburger menu toggle dengan animasi untuk layar < 768px
    - _Requirements: 1.4, 9.2, 9.3_

- [x] 6. Implementasi konten HTML Navbar dan navigasi
  - Tambahkan tautan navigasi ke setiap section (`href="#hero"`, `href="#about"`, dst.) di dalam `<nav>`
  - Tambahkan atribut `data-scroll-to` pada setiap tautan navigasi
  - Implementasikan modul `smoothScroll` (init, to): delegasi klik `[data-scroll-to]` → `scrollIntoView({ behavior: 'smooth' })`
  - _Requirements: 1.2, 1.3_

  - [x] 6.1 Tulis implementasi `smoothScroll`
    - Delegasikan event klik pada semua elemen `[data-scroll-to]`
    - Panggil `document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' })`
    - _Requirements: 1.3, 2.5_

- [x] 7. Implementasi Hero Section dan konten About Section
  - Tulis HTML Hero section: headline, tagline, minimal 1 CTA_Button dengan `data-scroll-to="#about"`
  - Terapkan kelas animasi `fade-in` dan `slide-up` pada headline dan CTA via JS setelah `DOMContentLoaded`
  - Tulis HTML About section: teks deskriptif dan minimal 3 item stat dengan `data-target` dan class `stat-counter`
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2_

- [x] 8. Implementasi modul `counterAnimation`
  - [x] 8.1 Tulis implementasi `counterAnimation` (init, start, _animate, _hasRun)
    - Gunakan `IntersectionObserver` pada semua `.stat-counter`
    - Animasi integer dari `0` ke `data-target` menggunakan `requestAnimationFrame`
    - Simpan elemen yang sudah selesai di `_hasRun: Set<Element>` untuk mencegah pengulangan
    - Fallback graceful jika `data-target` bukan angka valid (tampilkan `0`)
    - _Requirements: 3.3, 3.4_

- [x] 9. Implementasi Features Section
  - Tulis HTML Features section: minimal 6 card dengan class `feature-card`, tiap card memuat ikon, judul, dan deskripsi
  - Implementasikan grid responsif Tailwind: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - Implementasikan modul `cardHoverEffects`: pasang `mouseenter`/`mouseleave` untuk menambah class elevasi (scale + shadow)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 9.1 Tulis implementasi HTML dan `cardHoverEffects`
    - Setiap `.feature-card` harus memiliki elemen ikon, elemen judul (`h3`), dan elemen deskripsi (`p`)
    - `mouseenter` → tambah class `scale-105 shadow-xl`; `mouseleave` → hapus class tersebut
    - _Requirements: 4.2, 4.3_

- [x] 10. Implementasi Portfolio Section
  - Tulis HTML Portfolio section: minimal 6 item dengan `class="portfolio-item"` dan `data-category`
  - Tambahkan tombol filter dengan `class="filter-btn"` dan `data-filter` untuk tiap kategori plus `"all"`
  - Tiap item portfolio memiliki elemen overlay (judul + ikon link) yang tersembunyi secara default
  - Implementasikan modul `portfolioFilter` (init, apply, _animateItems)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [-] 10.1 Tulis implementasi `portfolioFilter`
    - `apply('all')` → tampilkan semua item; `apply(category)` → tampilkan hanya item dengan `data-category === category`
    - Gunakan animasi CSS transition (opacity + transform) saat show/hide item
    - Pasang `mouseenter`/`mouseleave` pada tiap item untuk tampilkan overlay
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 12. Implementasi Testimonials Section
  - Tulis HTML Testimonials section: minimal 3 slide (`testimonial-slide`) dengan avatar, nama, jabatan, dan kutipan
  - Tambahkan tombol navigasi prev/next carousel dan indikator slide
  - Implementasikan modul `testimonialCarousel` (init, navigate, goTo, _autoPlay, _pauseAndResume)
  - Auto-play setiap 5000ms; pause 10000ms setelah interaksi user
  - Sembunyikan tombol navigasi jika total slide < 2
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [-] 12.1 Tulis implementasi `testimonialCarousel`
    - `navigate('next')` → `(currentIndex + 1) % total`
    - `navigate('prev')` → `(currentIndex - 1 + total) % total`
    - `_pauseAndResume()` → `clearInterval`, `setTimeout(restart, 10000)`
    - _Requirements: 6.3, 6.5_

- [x] 13. Implementasi Contact Section dan modul form
  - Tulis HTML Contact section: form dengan field `name`, `email`, `subject`, `message` (semua wajib)
  - Tambahkan elemen error inline (awalnya tersembunyi) di bawah tiap field
  - Tambahkan info kontak alternatif (email, telepon, media sosial)
  - Implementasikan modul `contactForm` (init, validate, _validateField, submit, reset)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [-] 13.1 Tulis implementasi `contactForm` dan `toastNotification`
    - `_validateField`: field kosong/whitespace → tampilkan error; email tidak match regex → tampilkan "Format email tidak valid"
    - `submit`: panggil `validate()`; jika gagal return early; jika lolos panggil `toastNotification.show(...)` lalu `reset()`
    - `toastNotification.show(message, type, duration)`: buat elemen DOM, animate in, hapus setelah `duration` ms
    - Toast sukses tampil 3000ms
    - _Requirements: 7.2, 7.3, 7.4, 7.5_

- [x] 14. Implementasi `scrollTopButton` dan Footer
  - Tulis HTML Footer: nama/brand, tautan navigasi singkat, dan teks hak cipta
  - Implementasikan modul `scrollTopButton` (init, toggle, scrollUp)
  - `toggle()`: tampilkan `#scroll-top-btn` jika `window.scrollY > 300`, sembunyikan jika tidak
  - `scrollUp()`: `window.scrollTo({ top: 0, behavior: 'smooth' })`
  - _Requirements: 10.3, 10.4, 10.5_

  - [-] 14.1 Tulis implementasi `scrollTopButton`
    - Pasang `scroll` event listener → panggil `toggle()`
    - Pasang `click` event listener pada `#scroll-top-btn` → panggil `scrollUp()`
    - _Requirements: 10.4, 10.5_

- [x] 15. Implementasi aksesibilitas — atribut alt pada semua gambar
  - [-] 15.1 Tambahkan atribut `alt` deskriptif pada semua elemen `<img>` di seluruh dokumen
    - Pastikan tidak ada `<img>` dengan `alt=""` atau tanpa atribut `alt`
    - _Requirements: 9.5_

- [x] 17. Inisialisasi semua modul dan wiring akhir
  - Di bagian bawah `app.js` (atau `<script>` dalam `index.html`), panggil `init()` pada semua modul dalam urutan:
    `themeManager.init()` → `spotlightEffect.init()` → `navbarController.init()` → `smoothScroll.init()` → `counterAnimation.init()` → `cardHoverEffects.init()` → `portfolioFilter.init()` → `testimonialCarousel.init()` → `contactForm.init()` → `scrollTopButton.init()`
  - Pastikan semua modul terpanggil setelah `DOMContentLoaded`
  - _Requirements: 1.1, 2.3, 10.1_

---

## Notes

- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Semua fungsionalitas interaktif diimplementasikan langsung dalam Vanilla JavaScript (IIFE pattern)
- Website dapat dibuka langsung di browser tanpa proses build
- Full WCAG compliance memerlukan pengujian manual dengan assistive technologies

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "7"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1", "6.1", "8.1", "9.1", "10.1", "12.1", "13.1", "14.1", "15.1"] },
    { "id": 3, "tasks": ["17"] }
  ]
}
```
