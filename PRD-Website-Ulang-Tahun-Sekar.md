# PRD: Website Happy Birthday untuk Sekar

## 1. Latar Belakang & Tujuan
Membuat website ulang tahun personal untuk Sekar (bestie dari pembuat), berisi ucapan, kenangan foto, dan pengalaman interaktif yang terasa seperti kejutan digital. Tujuan utama: membuat Sekar merasa spesial, terhibur, dan terharu saat membuka website ini.

## 2. Target Pengguna
- Penerima utama: Sekar (satu orang, dibuka lewat link/browser, kemungkinan besar dari HP)
- Tidak perlu sistem login, multi-user, atau database — cukup single-page experience

## 3. Prinsip Desain
- **Interaktif**: setiap section punya elemen yang bisa diklik/disentuh/di-hover, bukan sekadar scroll pasif
- **Penuh kejutan**: ada elemen yang muncul tiba-tiba, hidden easter egg, atau reveal bertahap
- **Lucu & playful**: animasi dengan karakter (confetti, emoji melayang, karakter kartun sederhana), warna cerah, font yang friendly
- **Mobile-first**: mayoritas orang buka dari HP, semua interaksi harus enak di-tap

## 4. Struktur & Fitur per Section

### 4.1 Landing / Opening Screen
- Layar pembuka dengan tombol besar semacam "Klik untuk buka kejutan 🎉" (jangan langsung tampilkan semua konten)
- Animasi masuk: confetti jatuh, balon naik, atau amplop yang terbuka
- Musik/sound effect opsional saat tombol diklik (dengan toggle mute)

### 4.2 Ucapan Utama
- Judul besar "Happy Birthday, Sekar!" dengan animasi teks (typewriter effect / huruf muncul satu-satu / bounce)
- Sub-ucapan singkat yang hangat

### 4.3 Galeri 9 Foto — Interactive Photo Gallery
- 9 foto ditampilkan dalam bentuk yang playful, misalnya:
  - Polaroid yang bisa di-drag/di-flip untuk lihat caption di baliknya
  - Grid foto yang terbuka satu-satu saat di-klik (seperti membuka kado)
  - Setiap foto punya caption/kenangan singkat yang muncul saat foto disentuh
- Transisi antar foto pakai animasi halus (fade, flip, scale)

### 4.4 Elemen Kejutan (Surprise Interactions)
- Minimal 2-3 easter egg tersembunyi, contoh:
  - Tombol rahasia yang memicu hujan confetti/emoji
  - Klik di tempat tak terduga (misal logo/gambar tertentu) memunculkan pesan tersembunyi
  - Mini game ringan (contoh: pop-the-balloon, tebak kenangan, atau kuis singkat tentang persahabatan)

### 4.5 Pesan/Surat Personal
- Section berisi surat panjang dari pembuat ke Sekar
- Bisa dibuat reveal bertahap (scroll-triggered animation) atau dibuka seperti amplop digital

### 4.6 Wishing/Interactive Closing
- Elemen interaktif penutup, misalnya: tiup lilin virtual (klik/tap untuk "meniup"), lalu muncul ucapan terakhir + confetti besar
- Opsional: tombol "Putar ulang" untuk mengulang pengalaman dari awal

## 5. Kebutuhan Teknis
- **Platform**: Website statis (HTML/CSS/JS atau React), bisa diakses lewat link, tidak perlu backend/server
- **Assets**: 9 foto yang akan disediakan pembuat, harus diberi placeholder dulu jika belum diupload
- **Animasi**: gunakan library ringan (CSS animation, atau framework animasi seperti Framer Motion/GSAP jika berbasis React) agar performanya tetap ringan di HP
- **Responsif**: wajib nyaman dibuka di layar HP (utamakan portrait mode)
- **Loading**: hindari loading berat di awal; animasi tetap smooth walau koneksi tidak stabil

## 6. Nada & Gaya Visual
- Warna: cerah, hangat, playful (pastel/pop color, sesuaikan dengan preferensi Sekar bila diketahui)
- Font: friendly & rounded, hindari font formal/kaku
- Ilustrasi: emoji, confetti, balon, bentuk-bentuk lucu; hindari elemen yang terkesan generik/template kaku

## 7. Yang Perlu Disediakan Pembuat (Belum Termasuk di PRD Ini)
- 9 file foto final
- Nama panggilan/nickname Sekar (jika ada, untuk personalisasi)
- Isi pesan/surat personal
- Preferensi warna/tema jika ada (misal warna favorit Sekar)
- Tanggal ulang tahun (untuk countdown opsional sebelum hari-H, jika diinginkan)

## 8. Out of Scope
- Tidak perlu autentikasi/login
- Tidak perlu database atau penyimpanan data pengunjung
- Tidak perlu multi-bahasa (default Bahasa Indonesia, kecuali diminta lain)

## 9. Kriteria Sukses
- Website terasa personal, bukan seperti template generik
- Semua 9 foto tertampil dengan baik dan interaktif
- Minimal 1 momen "kejutan" yang jelas membuat pengguna terkesan
- Bisa dibuka lancar di HP tanpa lag animasi
