# Setup GitHub Actions & Vercel Deployment

Your GitHub Actions workflow is now fixed! Follow these steps to enable auto-deployment:

## Step 1: Get Vercel Credentials

### 1a. Get VERCEL_TOKEN
1. Go to https://vercel.com/account/tokens
2. Click "Create" next to "Tokens"
3. Name it: `github-actions-worship-chord`
4. **Copy the token** - you'll use it in Step 2

### 1b. Get VERCEL_ORG_ID and VERCEL_PROJECT_ID
1. Go to https://vercel.com/dashboard
2. Click on your **worship-chord-generator** project
3. Click **Settings** → **General**
4. Find these values:
   - **Project ID**: Copy this (looks like: `prj_abc123xyz`)
   - **Team/Org ID**: Scroll down to "General" section, find "Team ID" (looks like: `team_abc123`)
5. **Copy both** - you'll use them in Step 2

## Step 2: Add GitHub Secrets

1. Go to https://github.com/cjoyy/worship-chord-generator/settings/secrets/actions
2. Click **"New repository secret"** and add these 3 secrets:

| Secret Name | Secret Value | Source |
|---|---|---|
| `VERCEL_TOKEN` | (from Step 1a) | Your Vercel account tokens page |
| `VERCEL_ORG_ID` | (from Step 1b) | Your Vercel project settings |
| `VERCEL_PROJECT_ID` | (from Step 1b) | Your Vercel project settings |

**Important:** Each secret must be added separately by clicking "New repository secret".

## Step 3: Set Vercel Environment Variables (OPTIONAL - for Arrangely API)

If you want to use Arrangely's API in the future:

1. Go to https://vercel.com/dashboard/worship-chord-generator/settings/environment-variables
2. Add 2 variables:
   - **Name**: `ARRANGELY_EMAIL`  
     **Value**: `victormaranatha11@gmail.com`  
     **Environment**: Check `Production`, `Preview`, `Development`
   
   - **Name**: `ARRANGELY_PASSWORD`  
     **Value**: `victor103`  
     **Environment**: Check `Production`, `Preview`, `Development`

3. Click **Save** for each variable

## Step 4: Test the Workflow

1. Push a small change to GitHub:
   ```bash
   cd "c:\Users\Joy\Desktop\FASILKOM\TERM 6\chord"
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: trigger github actions"
   git push origin main
   ```

2. Go to https://github.com/cjoyy/worship-chord-generator/actions
3. Watch the workflow run
4. It should complete successfully ✅

## Step 5: Verify Deployment

1. After the workflow succeeds, go to https://worship-chord-generator.vercel.app
2. Test the app:
   - Search for a song (e.g., "Amazing Grace")
   - Transpose chords
   - Export to Excel
3. Check the browser console (F12) for any errors

## Troubleshooting

### Still getting "No existing credentials found" error?
- Verify all 3 GitHub Secrets are added correctly
- Check you're on the `main` branch (workflow only runs on main)
- Try pushing another commit to trigger the workflow again

### 401 Unauthorized from API?
- Check if Arrangely environment variables are set on Vercel
- The API uses public sources (Chordtela, Ultimate Guitar) as fallback
- External sites may block requests due to anti-bot protection

### Build fails?
- Make sure `npm run build` works locally first
- Check the Actions tab logs for specific error messages

## What the Workflow Does

Each push to `main` automatically:
1. ✅ Checks out your code
2. ✅ Installs dependencies
3. ✅ Builds the project (`npm run build`)
4. ✅ Runs linter (warnings allowed)
5. ✅ Deploys to Vercel using your credentials
6. ✅ Your app is live at https://worship-chord-generator.vercel.app

---

**Once configured, you can just `git push` and your app auto-deploys! 🚀**
