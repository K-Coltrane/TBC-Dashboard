# Deploying to Netlify

This guide will help you deploy your Next.js Church Dashboard to Netlify.

## Prerequisites

1. A Netlify account (sign up at https://app.netlify.com)
2. Your code pushed to GitHub, GitLab, or Bitbucket (recommended)
3. Your Supabase environment variables ready

## Method 1: Deploy via Netlify UI (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Netlify will auto-detect Next.js settings

### Step 3: Configure Build Settings

Netlify should auto-detect these settings:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `18` (or latest LTS)

### Step 4: Add Environment Variables

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://olvccgaogqfzcdxkqtwx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdmNjZ2FvZ3FmemNkeGtxdHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzg0NjksImV4cCI6MjA4MDg1NDQ2OX0.7tg3SFdHrz7bWxLRk6rrQPAyOrtfelRXSRRlxcwqE1Y
   ```
   ⚠️ **Security Note:** For production, consider using Netlify's environment variable management instead of hardcoding.

### Step 5: Deploy

1. Click **"Deploy site"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Your site will be live at `https://YOUR-SITE-NAME.netlify.app`

## Method 2: Deploy via Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize and Deploy

```bash
# Initialize Netlify
netlify init

# Deploy
netlify deploy --prod
```

## Method 3: Manual Deploy (Drag & Drop)

1. Build your site locally:
   ```bash
   npm run build
   ```
2. Go to https://app.netlify.com
3. Drag and drop the `.next` folder to Netlify
4. ⚠️ **Note:** This method doesn't support automatic deployments

## Post-Deployment

### Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

### Environment Variables for Production

Make sure to set environment variables in Netlify dashboard:
- Go to **Site settings** → **Environment variables**
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Continuous Deployment

Netlify automatically deploys when you push to your main branch. To deploy from other branches:
1. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Configure branch deploys as needed

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Ensure Node version is set to 18 or higher
3. Verify all environment variables are set
4. Check that `@netlify/plugin-nextjs` is installed (it should auto-install)

### Site Shows 404 Errors

- This is normal for Next.js on first load
- The Netlify Next.js plugin handles routing automatically
- Clear browser cache and try again

### Environment Variables Not Working

- Make sure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

## Support

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/

