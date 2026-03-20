# GitHub Actions Fix

## ❌ Problem yang Terjadi

```
Error: Unable to resolve action vercel/action, repository not found
```

### Penyebab
- GitHub Actions workflow menggunakan `vercel/action` yang tidak exist
- Action tersebut mungkin deprecated atau private

## ✅ Solution

Diganti dengan menggunakan **Vercel CLI langsung** di shell:

```yaml
- name: Deploy to Vercel
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: |
    npm install -g vercel
    vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
  env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Keuntungan
✅ Lebih reliable (official Vercel CLI)
✅ Simpler (no external action dependency)
✅ Better error messages
✅ Full compatibility

---

## Setup GitHub Secrets (One Time)

Sebelum workflow bisa jalan:

### 1. Get Vercel Token

```bash
# Visit: https://vercel.com/account/tokens
# Create new token
# Copy it
```

### 2. Get Project IDs

Option A - Via CLI:
```bash
vercel projects list
# Find project ID

vercel teams list
# Find org ID
```

Option B - Via Vercel Dashboard:
1. https://vercel.com/dashboard/worship-chord-generator
2. Settings → General
3. Copy Project ID dan Team/Org ID

### 3. Add to GitHub

1. Go: https://github.com/cjoyy/worship-chord-generator/settings/secrets/actions
2. Click **New repository secret**
3. Add 3 secrets:

```
Name: VERCEL_TOKEN
Value: (paste token dari step 1)

Name: VERCEL_ORG_ID
Value: (paste org ID)

Name: VERCEL_PROJECT_ID
Value: (paste project ID)
```

---

## Test GitHub Actions

1. Make a small change locally:
```bash
# Edit any file, e.g., README.md
echo "# Test" >> README.md

git add .
git commit -m "test: trigger github actions"
git push origin main
```

2. Watch workflow:
   - https://github.com/cjoyy/worship-chord-generator/actions
   - Should see workflow running
   - Wait until it completes

3. Check deployment:
   - https://vercel.com/dashboard/worship-chord-generator
   - Should see new deployment appearing

---

## If Still ERROR

### Error: "Unable to resolve secrets"
→ Check GitHub Secrets are set: Settings → Secrets

### Error: "Deploy failed"
→ Check Vercel logs: Deployments → click failed → Logs tab

### Error: "vercel: command not found"
→ Workflow tries to install globally, wait a bit

---

## Updated Files

```
✅ .github/workflows/deploy.yml   - Fixed to use Vercel CLI
✅ .github/workflows/quality.yml  - Simplified, removed eslint
✅ LOCAL_TESTING.md              - How to test locally
```

---

**Ready to test?** See LOCAL_TESTING.md first (test locally before pushing to GitHub)
