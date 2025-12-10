# Vercel Deployment Guide

This guide will help you deploy the Online Dashboard to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Supabase credentials

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure your code is in a Git repository
   - Push to your remote repository

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Choose the "Online Daashboard" folder as the root directory (or adjust the root directory in Vercel settings)

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://olvccgaogqfzcdxkqtwx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdmNjZ2FvZ3FmemNkeGtxdHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzg0NjksImV4cCI6MjA4MDg1NDQ2OX0.7tg3SFdHrz7bWxLRk6rrQPAyOrtfelRXSRRlxcwqE1Y
     ```
   - Make sure to add these for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Navigate to the project directory**
   ```bash
   cd "Online Daashboard"
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked about environment variables, add:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **For production deployment**
   ```bash
   vercel --prod
   ```

## Project Configuration

The project is already configured for Vercel:
- ✅ Next.js 16 configured
- ✅ Images set to unoptimized (works well with Vercel)
- ✅ TypeScript build errors ignored (for faster builds)
- ✅ Environment variables configured in code

## Important Notes

- **Environment Variables**: Make sure to add your Supabase credentials as environment variables in Vercel. Never commit sensitive keys to your repository.
- **Build Command**: Vercel will automatically detect Next.js and use `next build`
- **Output Directory**: Vercel will automatically detect `.next` as the output directory
- **Node Version**: Vercel uses Node.js 18.x by default, which is compatible with Next.js 16

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all environment variables are set correctly
- Verify that `package.json` has all required dependencies

### Environment Variables Not Working
- Make sure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding new environment variables
- Check that variables are set for the correct environment (Production/Preview/Development)

### Images Not Loading
- The project uses `unoptimized: true` in `next.config.mjs`, which is compatible with Vercel
- Ensure image paths are correct

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Continuous Deployment

Once connected to a Git repository, Vercel will automatically:
- Deploy previews for every pull request
- Deploy to production on pushes to your main branch
- Rebuild on every commit

