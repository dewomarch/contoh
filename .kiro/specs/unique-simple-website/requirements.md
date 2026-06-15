# Requirements Document

## Introduction

Website ini adalah sebuah satu halaman (single-page) modern yang dibangun menggunakan HTML5, Tailwind CSS, dan Vanilla JavaScript. Website dirancang untuk tampil menarik secara visual namun tetap sederhana, dengan elemen pembeda unik berupa efek interaktif berbasis kursor dan animasi halus yang tidak mengganggu keterbacaan. Website mencakup semua section umum pada website modern: Hero, About, Features/Services, Portfolio/Work, Testimonials, dan Contact.

Elemen unik yang membedakan website ini adalah **Cursor Spotlight Effect** — area di sekitar kursor pengguna memancarkan cahaya halus yang menerangi konten, memberikan pengalaman eksplorasi konten yang terasa premium dan personal, tanpa JavaScript framework tambahan.

---

## Glossary

- **Website**: Aplikasi web satu halaman (single-page) yang dibangun dengan HTML5, Tailwind CSS, dan Vanilla JavaScript.
- **User**: Pengunjung yang mengakses dan berinteraksi dengan Website melalui browser.
- **Hero_Section**: Bagian pertama website yang berisi headline utama, tagline, dan tombol ajakan bertindak (CTA).
- **Navbar**: Komponen navigasi tetap di bagian atas halaman yang memuat tautan ke setiap section.
- **Cursor_Spotlight**: Efek visual berupa lingkaran cahaya yang mengikuti posisi kursor pengguna di atas latar belakang gelap.
- **Section**: Blok konten bertema yang membagi halaman menjadi bagian-bagian logis.
- **CTA_Button**: Tombol ajakan bertindak (Call to Action) yang mengarahkan User ke section atau aksi tertentu.
- **Theme_Toggle**: Tombol untuk beralih antara mode terang (light) dan mode gelap (dark).
- **Smooth_Scroll**: Perilaku gulir halaman yang beranimasi saat User mengklik tautan navigasi.
- **Card**: Elemen UI berbentuk kotak berisi ikon, judul, dan deskripsi singkat untuk menampilkan fitur atau layanan.
- **Toast_Notification**: Pesan singkat yang muncul sementara di layar untuk memberikan umpan balik kepada User.

---

## Requirements

### Requirement 1: Struktur Halaman dan Navigasi

**User Story:** Sebagai User, saya ingin dapat menavigasi ke semua bagian website dengan mudah, sehingga saya dapat menemukan informasi yang saya cari tanpa kebingungan.

#### Acceptance Criteria

1. THE Website SHALL menyertakan section-section berikut secara berurutan: Navbar, Hero, About, Features, Portfolio, Testimonials, dan Contact.
2. THE Navbar SHALL menampilkan tautan navigasi ke setiap Section di dalam halaman.
3. WHEN User mengklik tautan navigasi, THE Website SHALL melakukan Smooth_Scroll ke Section yang dituju.
4. WHILE User menggulir halaman ke bawah melewati Hero_Section, THE Navbar SHALL berubah tampilan menjadi solid dengan latar belakang berwarna (tidak transparan lagi).
5. THE Navbar SHALL menyertakan Theme_Toggle untuk beralih antara mode terang dan gelap.
6. WHEN halaman dimuat, THE Website SHALL menetapkan mode gelap sebagai tampilan default.

---

### Requirement 2: Hero Section

**User Story:** Sebagai User, saya ingin disambut dengan tampilan pembuka yang menarik dan jelas, sehingga saya segera memahami nilai yang ditawarkan website.

#### Acceptance Criteria

1. THE Hero_Section SHALL menampilkan headline utama, tagline pendukung, dan minimal satu CTA_Button.
2. THE Hero_Section SHALL menggunakan latar belakang gelap sebagai kanvas untuk Cursor_Spotlight.
3. WHEN halaman pertama kali dimuat, THE Hero_Section SHALL menampilkan animasi masuk (fade-in dan slide-up) pada headline dan CTA_Button.
4. WHEN User menggerakkan kursor di atas Hero_Section, THE Cursor_Spotlight SHALL berpindah mengikuti posisi kursor secara real-time dengan efek gradien radial.
5. WHEN User mengklik CTA_Button utama di Hero_Section, THE Website SHALL melakukan Smooth_Scroll ke Section About.

---

### Requirement 3: About Section

**User Story:** Sebagai User, saya ingin mengetahui gambaran singkat tentang siapa atau apa yang ada di balik website ini, sehingga saya dapat membangun kepercayaan.

#### Acceptance Criteria

1. THE About Section SHALL menampilkan teks deskriptif singkat dan statistik atau pencapaian utama.
2. THE About Section SHALL menampilkan minimal 3 (tiga) item statistik (misalnya: jumlah proyek selesai, klien puas, tahun pengalaman).
3. WHEN Section About masuk ke area tampilan (viewport) User, THE About Section SHALL memicu animasi penghitung angka (number counter) pada setiap item statistik dari 0 hingga nilai akhirnya.
4. THE About Section SHALL menampilkan animasi penghitung hanya satu kali per kunjungan halaman.

---

### Requirement 4: Features Section

**User Story:** Sebagai User, saya ingin melihat fitur atau layanan utama yang ditawarkan secara terstruktur, sehingga saya dapat dengan cepat menilai relevansinya bagi saya.

#### Acceptance Criteria

1. THE Features Section SHALL menampilkan minimal 6 (enam) Card fitur dalam tata letak grid responsif.
2. THE Card SHALL memuat ikon SVG atau emoji, judul fitur, dan deskripsi singkat maksimal 2 kalimat.
3. WHEN User mengarahkan kursor (hover) ke atas sebuah Card, THE Card SHALL menampilkan efek elevasi (transform scale dan box shadow) dengan transisi halus.
4. THE Features Section SHALL menggunakan tata letak grid dengan 1 kolom pada layar kecil (< 768px), 2 kolom pada layar sedang (768px–1023px), dan 3 kolom pada layar besar (≥ 1024px).

---

### Requirement 5: Portfolio Section

**User Story:** Sebagai User, saya ingin melihat contoh karya atau proyek yang pernah dibuat, sehingga saya dapat menilai kualitas dan gaya kerja.

#### Acceptance Criteria

1. THE Portfolio Section SHALL menampilkan minimal 6 (enam) item proyek dalam tata letak grid responsif.
2. THE Portfolio Section SHALL menyediakan tombol filter kategori untuk menyaring item proyek berdasarkan kategori.
3. WHEN User mengklik tombol filter, THE Portfolio Section SHALL menampilkan hanya item proyek yang sesuai dengan kategori yang dipilih menggunakan animasi transisi.
4. WHEN User mengklik tombol filter "All" atau "Semua", THE Portfolio Section SHALL menampilkan kembali semua item proyek.
5. WHEN User mengarahkan kursor ke item proyek, THE Portfolio Section SHALL menampilkan overlay dengan judul proyek dan ikon tautan.

---

### Requirement 6: Testimonials Section

**User Story:** Sebagai User, saya ingin membaca ulasan dari pengguna atau klien sebelumnya, sehingga saya dapat memperoleh keyakinan lebih sebelum mengambil keputusan.

#### Acceptance Criteria

1. THE Testimonials Section SHALL menampilkan minimal 3 (tiga) testimoni dalam format kartu yang memuat foto avatar, nama, jabatan, dan kutipan teks.
2. THE Testimonials Section SHALL mengimplementasikan tampilan carousel atau slider horizontal.
3. WHEN User mengklik tombol navigasi carousel (sebelumnya/berikutnya), THE Testimonials Section SHALL beralih ke testimoni yang berdekatan dengan animasi geser (slide).
4. THE Testimonials Section SHALL secara otomatis beralih ke testimoni berikutnya setiap 5 (lima) detik.
5. WHEN User berinteraksi dengan carousel (mengklik tombol navigasi), THE Testimonials Section SHALL menghentikan sementara rotasi otomatis selama 10 (sepuluh) detik sebelum melanjutkan kembali.

---

### Requirement 7: Contact Section

**User Story:** Sebagai User, saya ingin dapat mengirimkan pesan atau pertanyaan dengan mudah, sehingga saya dapat berkomunikasi tanpa harus meninggalkan halaman.

#### Acceptance Criteria

1. THE Contact Section SHALL menampilkan formulir kontak dengan field: nama lengkap, alamat email, subjek, dan pesan.
2. WHEN User mencoba mengirimkan formulir dengan field wajib yang kosong, THE Contact Section SHALL menampilkan pesan validasi inline di bawah field yang bermasalah.
3. WHEN User mengisi field email dengan format yang tidak valid, THE Contact Section SHALL menampilkan pesan error "Format email tidak valid" di bawah field email.
4. WHEN User berhasil mengirimkan formulir (semua validasi lolos), THE Website SHALL menampilkan Toast_Notification dengan pesan konfirmasi keberhasilan selama 3 (tiga) detik.
5. WHEN formulir berhasil dikirimkan, THE Contact Section SHALL mereset semua field formulir ke kondisi kosong.
6. THE Contact Section SHALL juga menampilkan informasi kontak alternatif seperti email, nomor telepon, dan tautan media sosial.

---

### Requirement 8: Cursor Spotlight Effect (Elemen Unik)

**User Story:** Sebagai User, saya ingin merasakan pengalaman interaktif yang unik saat menjelajahi website, sehingga website terasa premium dan berkesan.

#### Acceptance Criteria

1. THE Cursor_Spotlight SHALL diimplementasikan menggunakan Vanilla JavaScript dan CSS custom properties tanpa library eksternal tambahan.
2. WHEN User menggerakkan kursor di dalam area halaman, THE Cursor_Spotlight SHALL memperbarui posisinya secara real-time menggunakan event `mousemove`.
3. THE Cursor_Spotlight SHALL dirender sebagai lapisan overlay semi-transparan dengan efek gradien radial lingkaran cahaya berdiameter 400px–600px.
4. WHEN halaman pertama kali dimuat, THE Cursor_Spotlight SHALL tidak terlihat hingga User pertama kali menggerakkan kursor.
5. WHERE mode gelap aktif, THE Cursor_Spotlight SHALL menggunakan warna cahaya terang (putih atau biru muda transparan).
6. WHERE mode terang aktif, THE Cursor_Spotlight SHALL menonaktifkan atau menyamarkan efek Cursor_Spotlight karena tidak relevan pada latar terang.

---

### Requirement 9: Responsivitas dan Aksesibilitas

**User Story:** Sebagai User, saya ingin website dapat diakses dan terlihat baik di berbagai perangkat dan ukuran layar, sehingga saya dapat mengaksesnya dari mana saja.

#### Acceptance Criteria

1. THE Website SHALL merender dengan benar dan fungsional pada lebar layar minimal 320px hingga 2560px.
2. THE Navbar SHALL menyertakan menu hamburger pada layar dengan lebar kurang dari 768px.
3. WHEN User mengklik ikon hamburger, THE Navbar SHALL menampilkan atau menyembunyikan menu navigasi mobile dengan animasi.
4. THE Website SHALL menggunakan elemen HTML5 semantik yang tepat (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
5. THE Website SHALL memberikan atribut `alt` yang deskriptif pada setiap elemen gambar.
6. THE Website SHALL memastikan rasio kontras warna teks terhadap latar belakang memenuhi standar WCAG 2.1 level AA (minimum 4.5:1 untuk teks normal).

---

### Requirement 10: Performa dan Footer

**User Story:** Sebagai User, saya ingin website memuat dengan cepat dan memiliki informasi penutup yang lengkap, sehingga pengalaman saya tidak terganggu oleh loading lambat.

#### Acceptance Criteria

1. THE Website SHALL memuat semua aset utama (HTML, CSS, JS) dalam satu file atau sejumlah file minimal tanpa ketergantungan server.
2. THE Website SHALL menggunakan Tailwind CSS melalui CDN sehingga tidak memerlukan proses build.
3. THE Website SHALL menyertakan elemen `<footer>` yang memuat nama/brand, tautan navigasi singkat, dan teks hak cipta.
4. WHEN User mengklik tombol "Scroll to Top" di footer atau pojok layar, THE Website SHALL menggulir halaman kembali ke bagian paling atas dengan Smooth_Scroll.
5. WHEN User menggulir halaman ke bawah lebih dari 300px, THE Website SHALL menampilkan tombol "Scroll to Top" mengambang (floating).
