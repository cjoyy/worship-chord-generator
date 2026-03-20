# Quick Reference - Common Commands

## 🚀 Deployment (First Time)

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"

# 1. Push to GitHub
git branch -M main
git remote add origin https://github.com/cjoyy/worship-chord-generator.git
git push -u origin main

# 2. Deploy to Vercel (via CLI)
npm install -g vercel
vercel login
vercel

# 3. Set environment variables
vercel env add ARRANGELY_EMAIL        # → victormaranatha11@gmail.com
vercel env add ARRANGELY_PASSWORD     # → victor103
vercel --prod
```

## 💻 Local Development

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"

# Install/update dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📝 Git Workflow

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"

# Make code changes...

# Check what changed
git status

# Add changes
git add .

# Create commit
git commit -m "feat: description of your change"

# Push to GitHub (Vercel auto-deploys)
git push origin main
```

## 🔗 Useful URLs

- **Frontend (Production)**: https://worship-chord-generator.vercel.app
- **GitHub repo**: https://github.com/cjoyy/worship-chord-generator
- **Vercel dashboard**: https://vercel.com/dashboard/worship-chord-generator
- **Vercel deployments**: https://vercel.com/dashboard/worship-chord-generator/deployments

## 🔑 Important Files

| File | Edit When | Notes |
|------|-----------|-------|
| `.env.local` | Need to change Arrangely credentials | Local only, never commit |
| `api/search.js` | Search selectors fail | Update HTML selectors if Arrangely changes |
| `api/fetch-chord.js` | Chord parsing fails | Update selectors for parsing |
| `src/App.jsx` | Want to change UI logic | Main state management |
| `src/index.css` | Want to change colors/theme | Global styling |
| `.gitignore` | Adding new local files to ignore | Don't commit private files |

## 🐛 Debugging

### Check API logs
```bash
vercel logs --prod
```

### Check local API response
```bash
curl "http://localhost:3000/api/search?q=hallelujah"
```

### View Vercel build logs
1. Visit vercel.com dashboard
2. Select project → Deployments
3. Click a deployment → Build Logs tab

### Check browser console
1. Press F12 in browser
2. Go to Console tab
3. Type: `localStorage.getItem('chord_cache_...')`

## 📊 File Sizes

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
npm run build
# Look at dist/ folder sizes
```

Expected:
- `index.html`: ~0.6 kB
- `assets/index-*.css`: ~1.4 kB gzipped
- `assets/index-*.js`: ~50 kB gzipped

## 🔄 Troubleshooting

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install

# Clear npm cache
npm cache clean --force

# Clear Vercel cache and redeploy
vercel --prod --skip-build

# View .env.local values
type .env.local

# Test if Arrangely is accessible
curl https://arrangely.io/login

# View git status
git status

# View recent commits
git log --oneline -5
```

## 🎯 Deployment Status

Check current deployment:
```bash
vercel projects list
vercel deployments list worship-chord-generator
```

## 💾 Backup

```bash
# Create a backup ZIP of entire project
# (Assuming you're in parent directory)
PowerShell -Command "Compress-Archive -Path 'TERM 6\chord' -DestinationPath 'chord-backup-$(Get-Date -Format yyyy-MM-dd).zip'"
```

## 📱 Test on Different Devices

```bash
# Get your local IP address
ipconfig

# Access from mobile (replace 192.168.x.x with your IP)
http://192.168.x.x:5173
```

---

**Pro Tip**: Save this file to Quick Access for easy reference! 📌
