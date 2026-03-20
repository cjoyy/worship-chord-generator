# ⛪ Worship Chord Generator

Aplikasi web untuk mencari, mengelola, dan export chord worship dalam format Excel.

## Features

- 🔍 **Multi-source Search**: Cari chord dari Arrangely, Chordtela, dan Ultimate Guitar
- 🎵 **Transpose**: Ubah key chord sesuai kebutuhan
- 📊 **Export Excel**: Export ke file Excel dengan format professional dark theme
- 💾 **Local Cache**: Cache hasil pencarian di browser
- 🔐 **Secure Auth**: Kredensial Arrangely disimpan di server, tidak pernah terexpose

## Tech Stack

- **Frontend**: React 18 + Vite + TailwindCSS-like styling
- **Backend**: Node.js Vercel Serverless Functions
- **Database Cache**: LocalStorage (client-side)
- **Export**: ExcelJS

## Setup Lokal

### Prerequisites
- Node.js 18+
- npm atau yarn
- Git

### 1. Clone & Install
```bash
cd worship-chord-generator
npm install
```

### 2. Setup Environment
Buat file `.env.local` (sudah ada, tinggal cek):
```
ARRANGELY_EMAIL=victormaranatha11@gmail.com
ARRANGELY_PASSWORD=victor103
```

### 3. Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173`

### 4. Backend Dev (Optional)
Untuk test API lokal, install Vercel CLI dan jalankan:
```bash
npm install -g vercel
vercel dev
```

## Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`.

## Deploy ke Vercel

### 1. Prepare Git
```bash
git init
git add .
git commit -m "init: worship chord generator"
git remote add origin https://github.com/cjoyy/worship-chord-generator.git
git push -u origin main
```

### 2. Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

Ikuti prompts:
- Set up and deploy? **Y**
- Link to existing project? **N**
- Project name: `worship-chord-generator`
- Directory: `./`
- Override settings? **N**

### 3. Set Environment Variables
```bash
vercel env add ARRANGELY_EMAIL
# → masukkan: victormaranatha11@gmail.com

vercel env add ARRANGELY_PASSWORD
# → masukkan: victor103

vercel --prod
```

Atau via Dashboard Vercel:
1. Buka vercel.com → project kamu
2. Settings → Environment Variables
3. Tambahkan `ARRANGELY_EMAIL` dan `ARRANGELY_PASSWORD`
4. Redeploy dengan tombol "Redeploy"

### 4. Connect GitHub untuk Auto-Deploy
Di Vercel Dashboard:
1. Settings → Git
2. Connect GitHub repository
3. Branch: `main`

Setiap `git push` ke main akan auto-deploy.

## Project Structure

```
worship-chord-generator/
├── api/                          ← Vercel Serverless Functions
│   ├── search.js                 ← Search chord
│   ├── fetch-chord.js            ← Fetch & parse chord
│   └── _arrangely-session.js     ← Arrangely auth helper
├── src/
│   ├── components/               ← React components
│   │   ├── SongInput.jsx
│   │   ├── SongCard.jsx
│   │   ├── ChordPreview.jsx
│   │   ├── TransposeControl.jsx
│   │   └── ExportButton.jsx
│   ├── lib/                      ← Utilities
│   │   ├── transpose.js          ← Chord transpose engine
│   │   ├── parser.js             ← Parse chord sheet
│   │   ├── excelGenerator.js     ← Excel export
│   │   └── cache.js              ← LocalStorage cache
│   ├── App.jsx                   ← Main component
│   ├── main.jsx                  ← Entry point
│   └── index.css                 ← Styling
├── .env.example                  ← Env template
├── .env.local                    ← Env lokal (gitignore)
├── vercel.json                   ← Vercel config
├── vite.config.js                ← Vite config
├── package.json
└── index.html
```

## Usage

1. **Input Lagu**
   - Masukkan nama lagu dalam textarea (satu baris per lagu)
   - Klik "Cari Semua Lagu"

2. **Pilih Arrangement**
   - Hasil pencarian akan muncul dari berbagai sumber
   - Klik "Pilih" untuk preview chord

3. **Edit & Transpose**
   - Preview chord otomatis ditampilkan
   - Ubah key menggunakan dropdown untuk transpose
   - Chord akan otomatis di-transpose

4. **Export**
   - Setelah memilih semua lagu yang dibutuhkan
   - Klik "Export ke Excel"
   - File akan di-download dengan nama `chord-sheet-[tanggal].xlsx`

## Excel Export Format

File Excel yang dihasilkan memiliki:
- **Dark Theme** dengan warna-warna profesional
- **Frozen Header** (3 baris pertama)
- Setiap lagu dalam sheet terpisah
- **Metadata**: Title, Artist, Key, Tempo
- **Warnai Sections**: Intro, Verse, Chorus, Bridge, Outro dengan warna berbeda
- **Chord styling**: Bold gold pada section chords
- Font: Monospace (Consolas) untuk chord clarity

## Troubleshooting

### "Kredensial Arrangely tidak ditemukan"
- Pastikan `.env.local` sudah ada di root folder
- Cek bahwa `ARRANGELY_EMAIL` dan `ARRANGELY_PASSWORD` terisi
- Di Vercel, pastikan environment variables sudah di-set di Settings → Environment Variables

### "CORS error di browser"
- Di development: Vite proxy sudah setup di `vite.config.js`
- Di production: API responses sudah include CORS headers

### "ExcelJS error"
- Pastikan `<script>` di `index.html` sudah include ExcelJS CDN
- Refresh browser (clear cache) jika masih error

### "Selector HTML tidak match"
- Struktur HTML di Arrangely/Chordtela mungkin berubah
- Catat URL lagu yang error dan inspect HTML-nya
- Update selector di `api/search.js` dan `api/fetch-chord.js`

## GitHub

Repository: https://github.com/cjoyy/worship-chord-generator

Push changes:
```bash
git add .
git commit -m "feat: deskripsi fitur"
git push origin main
```

## License

MIT - Use freely for worship purposes

## Support

Untuk issue atau pertanyaan, buat Issue di GitHub repository.
