# ⚡ CI/CD Setup untuk GitHub Actions

## Apa yang Sudah Ditambah?

### Workflow 1: Automatic Deploy to Vercel
**File**: `.github/workflows/deploy.yml`
- ✅ Runs on every push to `main` branch
- ✅ Install dependencies
- ✅ Build & check for errors
- ✅ Auto-deploy to Vercel if build succeeds
- ✅ Comments on PRs with build status

### Workflow 2: Code Quality Checks
**File**: `.github/workflows/quality.yml`
- ✅ Run security audit
- ✅ Check for vulnerabilities
- ✅ Verify build
- ✅ Prevent committing `.env.local`

---

## 🚀 Setup Steps (One Time Only)

### Step 1: Commit CI/CD Changes

```bash
cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
git add .
git commit -m "fix: improve api error handling and add ci/cd workflows"
git push origin main
```

### Step 2: Get Vercel Tokens

1. Go to: https://vercel.com/account/tokens
2. Create new token:
   - Name: `GitHub Actions`
   - Scope: Full Account
   - Copy the token

### Step 3: Get Project IDs from Vercel

```bash
# After you've deployed to Vercel for the first time
# Check your project at Vercel dashboard:
# https://vercel.com/dashboard/worship-chord-generator

# Or get via CLI (if you've installed vercel):
vercel project list
```

From the dashboard, find:
- **ORG ID**: Go to Settings → General → Project ID
- **PROJECT ID**: Also in Settings → General → Project ID
- Actually, you need to run a Vercel project to get these. Let's get them via CLI after first deploy.

### Step 4: Add Secrets to GitHub

1. Go to: https://github.com/cjoyy/worship-chord-generator/settings/secrets/actions
2. Click **New repository secret**

Add these 3 secrets:

**Secret 1: VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Value: (paste the token from Step 2)
- Click **Add secret**

**Secret 2: Get from Vercel CLI**

First, deploy to Vercel one time:
```bash
vercel --prod
```

Then get project info:
```bash
# Get team/org ID
vercel teams list

# Get project ID
vercel projects list worship-chord-generator
# or check .vercel/project.json
```

**Secret 3 & 4: VERCEL_ORG_ID and VERCEL_PROJECT_ID**

After getting these from Vercel, add to GitHub:
- Name: `VERCEL_ORG_ID`, Value: (your org ID)
- Name: `VERCEL_PROJECT_ID`, Value: (your project ID)

---

## 📋 What Happens After Setup

### On Every `git push` to main:

1. **GitHub Actions Runs**
   - Install dependencies
   - Build the app
   - Run security checks
   - Deploy to Vercel (if build succeeds)
   
2. **Takes ~2-3 minutes total**

3. **You can watch progress at**:
   - GitHub: https://github.com/cjoyy/worship-chord-generator/actions
   - Vercel: https://vercel.com/dashboard/worship-chord-generator/deployments

### Example Workflow:
```bash
# 1. Make code changes
# 2. Test locally: npm run dev
# 3. Commit: git add . && git commit -m "feat: ..."
# 4. Push: git push origin main

# GitHub Actions automatically:
# - Builds project
# - Runs tests
# - Deploys to Vercel production
# - You see status in GitHub Actions tab
```

---

## ✅ Troubleshooting

### "Deploy to Vercel" step fails

Check that you added all 3 secrets correctly:
1. https://github.com/cjoyy/worship-chord-generator/settings/secrets/actions
2. Verify secret names match exactly (case-sensitive):
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`  
   - `VERCEL_PROJECT_ID`

### "Build fails" in GitHub Actions

Check the error in Actions log:
1. Go to: https://github.com/cjoyy/worship-chord-generator/actions
2. Click the failed workflow
3. Click the job name to see detailed logs
4. Fix locally with `npm run build`
5. Push fix: `git commit -m "fix: ..." && git push`

### ".env.local accidentally committed"

GitHub Actions will **block** the commit if you try:
```bash
git add .env.local
git commit -m "..."
git push
```

Error will show: "❌ ERROR: .env.local should not be committed!"

**Solution**: 
```bash
# Remove from git (doesn't delete local file)
git rm --cached .env.local

# Commit the removal
git commit -m "remove: .env.local from git"

# Push
git push origin main

# Verify .gitignore has it (it does by default)
```

---

## 🎯 Next Steps

1. **First Deployment**: Push first time to trigger workflow
   ```bash
   git add .
   git commit -m "fix: improve error handling and add ci/cd"
   git push origin main
   ```

2. **Watch GitHub Actions**:
   - https://github.com/cjoyy/worship-chord-generator/actions
   - Should see a workflow running
   - Might fail because secrets not set yet

3. **Setup Secrets** (after seeing project IDs):
   - Get VERCEL tokens
   - Add to GitHub Secrets (Settings → Secrets)

4. **Re-run Failed Workflow**:
   - Go to Actions tab
   - Click failed workflow
   - Click "Re-run jobs"

5. **Check Deployment**:
   - Go to https://vercel.com/dashboard
   - Verify new deployment appeared
   - Test the live site

---

## 📚 Files Changed/Added

```
.github/
├── workflows/
│   ├── deploy.yml          ← NEW: Auto-deploy to Vercel
│   └── quality.yml         ← NEW: Security & quality checks
src/
├── components/
│   └── ErrorBoundary.jsx   ← NEW: Catch React errors
├── App.jsx                 ← UPDATED: Better error handling
├── main.jsx               ← UPDATED: Use ErrorBoundary
api/
├── search.js              ← UPDATED: Better headers & error handling
└── fetch-chord.js         ← UPDATED: Better headers & error handling
```

---

## 🔄 Typical Development Workflow

```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build locally to check
npm run build

# 4. Commit and push
git add .
git commit -m "feat: your feature"
git push origin main

# 5. GitHub Actions automatically:
#    - Builds
#    - Tests  
#    - Deploys to Vercel
#    (takes ~2-3 min)

# 6. Check Vercel deployed
#    https://vercel.com/dashboard

# 7. Done! Your changes are live
```

---

**No more manual Vercel deploys needed! GitHub Actions handles it.** 🚀
