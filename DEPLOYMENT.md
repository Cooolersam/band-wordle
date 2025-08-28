# 🚀 Deployment Guide for Band Wordle

This guide will walk you through deploying your Band Wordle game to the web for free!

## 📋 Prerequisites

- ✅ Band Wordle project built and tested locally
- ✅ GitHub account
- ✅ Supabase project set up
- ✅ Environment variables configured

## 🌐 Option 1: Deploy to Netlify (Recommended)

### Step 1: Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Band Wordle game"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/band-wordle.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"New site from Git"**
3. Choose **GitHub** and authorize Netlify
4. Select your `band-wordle` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**

### Step 3: Configure Environment Variables
1. In your Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add these variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Go to **Deploys** and trigger a **"Trigger deploy"** → **"Deploy site"**

### Step 4: Custom Domain (Optional)
1. In **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS configuration instructions

## 🚀 Option 2: Deploy to Vercel

### Step 1: Push to GitHub
Same as Netlify Step 1 above.

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click **"Deploy"**

### Step 3: Configure Environment Variables
1. In your Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add the same variables as Netlify
3. Redeploy your project

## 🗄️ Supabase Setup (If Not Done Yet)

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create new project
3. Wait for project to be ready (2-3 minutes)

### Step 2: Create Database Table
1. Go to **SQL Editor** in your Supabase dashboard
2. Run this SQL:

```sql
-- Create the scores table
CREATE TABLE scores (
  id BIGSERIAL PRIMARY KEY,
  nickname TEXT NOT NULL,
  section TEXT NOT NULL,
  guesses INTEGER NOT NULL,
  solved BOOLEAN NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint to prevent multiple submissions per user per day
CREATE UNIQUE INDEX unique_user_date ON scores (nickname, date);

-- Enable Row Level Security (RLS)
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON scores FOR ALL USING (true);
```

### Step 3: Get API Keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 🔧 Local Testing Before Deployment

### Step 1: Test Locally
```bash
# Make sure everything works
npm run dev
# Test the game, submit scores, view leaderboards
```

### Step 2: Test Build
```bash
npm run build
npm run preview
# Test the built version
```

### Step 3: Check Environment Variables
Ensure your `.env` file has:
```bash
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚨 Common Deployment Issues

### Issue: Environment Variables Not Working
**Solution**: 
- Ensure variable names start with `VITE_`
- Redeploy after adding variables
- Check variable values are correct

### Issue: Build Fails
**Solution**:
- Check Node.js version (use 16+)
- Clear `node_modules`: `rm -rf node_modules && npm install`
- Check for syntax errors in console

### Issue: Supabase Connection Fails
**Solution**:
- Verify URL and API key are correct
- Check Supabase project is active
- Ensure `scores` table exists
- Check RLS policies

### Issue: Game Works But Leaderboards Don't Load
**Solution**:
- Check browser console for errors
- Verify Supabase policies allow read operations
- Check network tab for failed API calls

## 🎯 Post-Deployment Checklist

- ✅ Game loads without errors
- ✅ Can play Wordle game
- ✅ Can submit scores
- ✅ Leaderboards display correctly
- ✅ Mobile responsive design works
- ✅ Environment variables are set
- ✅ Supabase connection is working

## 🔄 Updating Your Deployed Site

### Automatic Updates (GitHub Integration)
Both Netlify and Vercel automatically redeploy when you push to GitHub:
```bash
git add .
git commit -m "Update game features"
git push origin main
```

### Manual Updates
If needed, you can manually trigger redeploys from your hosting dashboard.

## 📱 Testing Your Deployed Site

1. **Desktop Testing**: Test all features on desktop
2. **Mobile Testing**: Test responsive design on mobile
3. **Cross-Browser**: Test on Chrome, Firefox, Safari
4. **Performance**: Check loading times and responsiveness

## 🎉 Congratulations!

Your Band Wordle game is now live on the web! Share it with your band members and start competing for the best scores!

---

**Need Help?** Check the main README.md for troubleshooting tips or create an issue in your GitHub repository. 