# Deployment Guide untuk Vercel

## Pre-Deployment Checklist

- [x] Semua file sudah dibuat
- [x] npm install selesai
- [x] npm run build berhasil (tidak ada error)
- [x] .env.local sudah dibuat dengan credentials
- [x] .env.local sudah di-.gitignore
- [x] GitHub account siap (cjoyy)

## Step 1: Setup Git & Push ke GitHub

```bash
# Di folder worship-chord-generator
git init
git add .
git commit -m "init: worship chord generator full stack"
git branch -M main
git remote add origin https://github.com/cjoyy/worship-chord-generator.git
git push -u origin main
```

Password GitHub: Gunakan Personal Access Token (lebih aman dari password)
1. GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token dengan scopes: `repo`, `gist`
3. Copy token dan gunakan sebagai password saat `git push`

## Step 2: Setup Vercel Project

### Option A: Via Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
vercel

# Follow prompts:
# ✔ Set up and deploy? Y
# ✔ Link to existing project? N
# ✔ What's your project's name? worship-chord-generator
# ✔ In which directory is your code? ./
# ✔ Override project settings? N
```

### Option B: Via Vercel Dashboard
1. Buka https://vercel.com
2. Login dengan akun GitHub (cjoyy)
3. Klik "New Project"
4. Import GitHub repo `worship-chord-generator`
5. Klik "Import"

## Step 3: Set Environment Variables di Vercel

```bash
vercel env add ARRANGELY_EMAIL
# → Masukkan: victormaranatha11@gmail.com
# → Pastikan pilih: Production, Preview, Development (semua)

vercel env add ARRANGELY_PASSWORD
# → Masukkan: victor103
# → Pastikan pilih: Production, Preview, Development (semua)

# Deploy ulang ke production
vercel --prod
```

### Atau via Dashboard Vercel:
1. Buka project di https://vercel.com/dashboard
2. Klik tab "Settings"
3. Navigasi ke "Environment Variables"
4. Tambahkan:
   - Key: `ARRANGELY_EMAIL`, Value: `victormaranatha11@gmail.com`
   - Key: `ARRANGELY_PASSWORD`, Value: `victor103`
5. Click "Save"
6. Klik "Redeploy" untuk deploy dengan env variables baru

## Step 4: Enable Auto-Deploy dari GitHub

1. Di Vercel Project Settings
2. Navigasi ke "Git" section
3. Dalam "Deploy on Push", pastikan enabled
4. Branch to Deploy: `main`

Sekarang setiap `git push` ke main akan auto-deploy ke Vercel!

## Step 5: Test Production

Setelah deployment selesai:
1. Buka URL yang diberikan Vercel (misal: `https://worship-chord-generator.vercel.app`)
2. Coba search lagu (harus connect ke Arrangely)
3. Coba pilih arrangement
4. Coba transpose
5. Coba export Excel

## Troubleshooting Deployment

### Error: "ARRANGELY_EMAIL not found"
→ Environment variable belum di-set di Vercel. Pastikan sudah di Settings → Environment Variables dan redeploy.

### Error: "Cannot find module cheerio"
→ Dependencies belum install di Vercel. Vercel seharusnya auto-run `npm install`, tapi kalo error:
1. Klik "Redeploy" di Vercel dashboard
2. Atau push simple commit: `git commit --allow-empty -m "trigger redeploy"` lalu push

### Error: "CORS error" saat fetch API
→ Di production, CORS headers sudah di-add di responses. Kalo masih error, cek:
- Browser console → Network tab → lihat response headers
- Vercel Function logs: Settings → Functions → lihat logs

### Error: "ExcelJS not working"
→ CDN link di index.html mungkin failing:
1. Buka index.html
2. Verify script tag: `<script src="https://cdn.jsdelivr.net/npm/exceljs@4.3.0/dist/exceljs.min.js"></script>`
3. Kalo CDN down, coba CDN lain atau download file lokal

## View Logs & Debug

```bash
# Lihat logs dari production
vercel logs --prod

# Lihat logs dari deployment tertentu
vercel logs <deployment-id>
```

Atau buka di Vercel Dashboard:
1. Pilih project
2. Klik tab "Deployments"
3. Pilih deployment
4. Klik "Function" untuk lihat API logs

## Update & Push Changes

Setiap kaliupdate code:
```bash
git add .
git commit -m "feat: deskripsi fitur"
git push origin main

# Vercel akan auto-deploy secara otomatis
# Tunggu 1-2 menit, cek di https://vercel.com/dashboard
```

## Rollback ke Versi Sebelumnya

1. Di Vercel Dashboard → Deployments
2. Cari deployment yang stable
3. Klik "⋯" → "Promote to Production"

## Live URL

Setelah berhasil deploy, URL akan:
- Production: `https://worship-chord-generator.vercel.app`
- Preview: `https://worship-chord-generator-<branch>.vercel.app`

Bagikan URL ini ke worship team! 🙌

---

## FAQ

**Q: Apakah credentials Arrangely safe?**
A: Ya! Credentials disimpan HANYA di Vercel Environment Variables (encrypted), tidak pernah dikirim ke client atau di-hardcode di kode.

**Q: Berapa cost untuk Vercel?**
A: Gratis untuk project kecil. Pro plan $20/bulan jika traffic tinggi.

**Q: Bisakah orang lain lihat .env.local?**
A: Tidak, file di .gitignore jadi tidak masuk git. Tapi .env itu lokal di komputer kamu - jangan share ke siapa-siapa.

**Q: Gimana kalau Arrangely struktur HTML-nya berubah?**
A: Update selectors di `api/search.js` dan `api/fetch-chord.js`, lalu push dan Vercel auto-deploy.
