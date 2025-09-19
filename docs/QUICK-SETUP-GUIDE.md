# 🚀 Quick Database Setup Guide

## Option 1: Simple Setup (Recommended for first time)

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in and select your project: `ssgzccuerqchwcpbytpu`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Run Simple Setup
1. Copy the contents of `setup-database-simple.sql`
2. Paste into SQL Editor
3. Click **"Run"**

This will create the basic structure. Then you can add sample data.

---

## Option 2: Complete Setup (All at once)

### Step 1: Go to Supabase Dashboard
1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in and select your project: `ssgzccuerqchwcpbytpu`

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Run Complete Setup
1. Copy the contents of `setup-database.sql`
2. Paste into SQL Editor
3. Click **"Run"**

This will create everything including sample data.

---

## ✅ What You'll Get After Setup:

- **Subjects**: Will be added as needed
- **Questions**: Will be added as needed
- **Tests**: Will be added as needed
- **Real Data**: No more fake demo data!

## 🔍 Verify Setup:

After running the script, check these tables in Supabase:
1. **Table Editor** → **subjects** (should have 3 rows)
2. **Table Editor** → **questions** (should have 15 rows)
3. **Table Editor** → **tests** (should have 6 rows)

## 🎯 Test Your App:

1. Go to `http://localhost:3000`
2. The yellow "Demo Data Mode" banner should disappear
3. You should see real subjects and tests
4. Take a test and see real results!

## 🆘 Need Help?

If you get any errors:
1. Make sure you're in the correct Supabase project
2. Try the simple setup first
3. Check the Supabase logs for specific errors
4. Run the script in smaller chunks if needed
