# Vercel Environment Variables Setup Guide

## 🚨 **Current Issue**
Your Vercel deployment is failing because Supabase environment variables are missing:

```
Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

## ✅ **Solution: Add Environment Variables to Vercel**

### **Step 1: Get Supabase Credentials**

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to API Settings:**
   - Click **Settings** (gear icon)
   - Click **API** in the sidebar

3. **Copy Required Values:**
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### **Step 2: Add to Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your "mock-test" project

2. **Navigate to Environment Variables:**
   - Click **Settings**
   - Click **Environment Variables**

3. **Add These Variables:**

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Supabase Project URL
   - **Environment:** ✅ Production ✅ Preview

   **Variable 2:**
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anon public key
   - **Environment:** ✅ Production ✅ Preview

### **Step 3: Redeploy**

1. **Go to Deployments tab**
2. **Click "Redeploy"** on the latest failed deployment
3. **Or push a new commit** to trigger automatic deployment

## 🔍 **Verification**

After adding the environment variables, your deployment should:
- ✅ Build successfully
- ✅ Generate all static pages
- ✅ Deploy without errors

## 📋 **Environment Variables Checklist**

Make sure you have these in Vercel:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- [ ] Both set for Production environment
- [ ] Both set for Preview environment (optional but recommended)

## 🚨 **Common Issues**

1. **Wrong Variable Names:** Make sure they start with `NEXT_PUBLIC_`
2. **Missing Environment:** Set for Production (and Preview)
3. **Wrong Values:** Double-check the URL and key from Supabase
4. **Caching:** Vercel might cache, try redeploying

## 🎯 **Expected Result**

After adding the environment variables:
- Build will complete successfully
- All 16 pages will generate
- Your app will be live on Vercel!

## 📞 **Need Help?**

If you're still having issues:
1. Check the Vercel build logs for any remaining errors
2. Verify the environment variables are correctly set
3. Make sure your Supabase project is active and accessible
