# 🎂 Happy Birthday Sekar — Website Kejutan Digital

Website ulang tahun interaktif, playful & mobile-first untuk Sekar. Dibuat sesuai PRD lengkap + foto asli optimized + tema Stroberi & Bunga.

## 📁 Struktur File

```
web_HB_Sekar/
├── index.html          # Main website
├── style.css           # Design system Stroberi & Bunga (Fredoka, Quicksand, Caveat)
├── script.js           # Semua interaksi, confetti canvas, Web Audio, mic, music upload
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker (offline cache)
├── _headers            # Cloudflare Pages Headers (cache optimization)
├── wrangler.toml       # Cloudflare Pages configuration
├── assets/
│   ├── sekar-01..09.jpg     # Foto optimized (1080p, 82% quality)
│   ├── sekar-01..09.webp    # Versi WebP
│   ├── og-image.jpg         # OG preview 1200x630
│   ├── favicon.svg/png/ico  # Icons
│   └── music.mp3/ogg        # Background music
└── foto_sekar/         # Foto original backup
```

## ☁️ Deploy ke Cloudflare Pages

### Cara 1: via Cloudflare Dashboard (Paling Mudah)
1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
2. Beri nama project (misal `sekar-birthday`).
3. Drag & drop folder `web_HB_Sekar` (atau upload file di dalamnya).
4. Klik **Deploy** — website akan langsung live di `https://sekar-birthday.pages.dev`!

### Cara 2: via GitHub (Auto-Deploy)
1. Push folder ini ke repository GitHub.
2. Di Cloudflare Dashboard, hubungkan ke GitHub repository tersebut.
3. Build output directory set ke `/`.
4. Setiap ada update, Cloudflare akan auto-deploy!

### Cara 3: via CLI (Wrangler)
Jalankan di terminal setelah login Cloudflare:
```bash
npx wrangler login
npx wrangler pages deploy . --project-name=sekar-birthday
```

---

## 🎨 Kustomisasi

- **Ganti foto:** timpa `assets/sekar-01.jpg` .. `sekar-09.jpg`
- **Ganti musik:** bisa langsung upload file `.mp3` via tombol 🎵 di kanan atas website, atau timpa `assets/music.mp3`
- **Edit surat:** buka `index.html` cari `<div class="letter-body">`
