# 🚀 RUN LOKAL UNTUK TESTING

## Apa yang mau kita test?

1. ✅ Frontend nggak blackscreen
2. ✅ API bisa hit Arrangely
3. ✅ Chord parsing berfungsi
4. ✅ Transpose berfungsi
5. ✅ Excel export berfungsi

---

## Option A: Frontend Only (Paling Cepat)

Ini yang paling simple. API akan hit Vercel production.

### Step 1: Jalankan

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
npm run dev
```

**Output akan kelihatan**:
```
VITE v5.4.21  ready in 445 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 2: Buka Browser

```
http://localhost:5173
```

### Step 3: Test Features

```
1. Search "Hallelujah"
   - Should see results dari Vercel API
   
2. Click hasil
   - Should preview chords
   
3. Change key
   - Chords should transpose
   
4. Export Excel
   - Should download file
```

### Step 4: Check DevTools

```
F12 → Console tab
- Should nggak ada red errors
- Jika ada error, akan terlihat jelas
```

---

## Option B: Full Stack Lokal (Advanced)

Run frontend + API functions lokal. Lebih dekat dengan production.

### Prerequisites

```bash
npm install -g vercel
```

### Step 1: Jalankan Vercel Dev Environment

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
vercel dev
```

**Biarkan running**, muncul output:

```
> Ready! Available at http://localhost:3000
```

### Step 2: In Terminal Baru, Run Frontend

```bash
# From same folder
npm run dev
```

### Step 3: Test

```
Open http://localhost:5173 atau http://localhost:3000
```

Akan hit lokal API functions instead of production.

---

## Common Issues & Fixes

### Issue 1: "Cannot find module" saat `npm run dev`

```bash
# Hapus node_modules dan reinstall
rm -r node_modules
npm install
npm run dev
```

### Issue 2: Port 5173 sudah dipakai

```bash
# Gunakan port berbeda
npm run dev -- --port 3333
# Open http://localhost:3333
```

### Issue 3: Environment variables tidak loaded

**Untuk lokal**, sudah ada `.env.local` dengan:
```
ARRANGELY_EMAIL=victormaranatha11@gmail.com
ARRANGELY_PASSWORD=victor103
```

**Jika `vercel dev` error**, check:
```bash
type .env.local
# Should show 2 lines dengan credentials
```

### Issue 4: API returns HTML error

Jika saat search lihat error "Unexpected token", berarti:
- Arrangely credentials salah
- Atau Arrangely.io down
- Test di browser: https://arrangely.io/login

---

## Debugging Tips

### Check API Response

Di browser Console:
```javascript
fetch('/api/search?q=hallelujah')
  .then(r => r.json())
  .then(d => console.log(d))
```

Expected output:
```javascript
{
  query: "hallelujah",
  results: [ ... ]
}
```

### Check Error Details

```javascript
// Di browser console
// Kalo ada error saat search:
fetch('/api/search?q=invalid')
  .then(r => {
    console.log('Status:', r.status)
    console.log('OK:', r.ok)
    return r.text() // try text first
  })
  .then(d => console.log(d))
```

### Watch Network Requests

```
F12 → Network tab
- Search untuk apapun
- Lihat requests yang dibuat
- Click request → Response tab
- Lihat apa yang direturn (JSON atau HTML?)
```

---

## Full Testing Checklist (Lokal)

```bash
# Start
npm run dev
# Open http://localhost:5173
```

**Functional Tests**:

- [ ] Page loads tanpa blackscreen
- [ ] Can type di textarea
- [ ] "Cari Semua Lagu" button clickable
- [ ] Search results appear
  - [ ] Results show title, artist, source badge
  - [ ] "Pilih" button clickable
- [ ] Preview shows:
  - [ ] Title
  - [ ] Artist
  - [ ] Chord preview (color coded)
  - [ ] Key dropdown
  - [ ] Export button
- [ ] Transpose works:
  - [ ] Change key
  - [ ] Chords change
- [ ] Export works:
  - [ ] Click Export → file downloads
  - [ ] File opens in Excel (or viewer)
  - [ ] Format looks good (dark theme)
- [ ] Error handling:
  - [ ] Try invalid search
  - [ ] Should show error message (not JSON error)

**Console Checks**:

- [ ] F12 Console → No red errors
- [ ] Network tab → All requests succeed (200, 304)
- [ ] Timestamps reasonable (not hanging)

---

## Production Test (After Vercel Redeploy)

```
1. Open https://worship-chord-generator.vercel.app
2. Repeat same tests
3. If works locally but not production:
   - Check Vercel env vars
   - Check Vercel logs
   - Check browser CORS errors
```

---

## Quick Diff: Local vs Production

| Aspect | Local | Production |
|--------|-------|------------|
| Frontend | http://localhost:5173 | https://worship-chord-generator.vercel.app |
| API | http://localhost:3000/api/* | https://worship-chord-generator.vercel.app/api/* |
| Logs | Browser console | Vercel dashboard |
| Restart | Ctrl+C, npm run dev | Redeploy on Vercel |
| Credentials | .env.local | Vercel Env Variables |

---

## CI/CD Testing (When GitHub Actions Works)

Once we fix the GitHub Actions workflow:

```
1. git push origin main
2. https://github.com/cjoyy/worship-chord-generator/actions
3. Watch workflow run
4. If succeeds → auto-deployed to Vercel
5. Check https://worship-chord-generator.vercel.app
```

---

## NEXT: Fix GitHub Actions

The workflow needs one more fix. After local testing works, we'll update the GitHub Actions to use Vercel CLI properly.
