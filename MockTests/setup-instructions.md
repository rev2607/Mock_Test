# Database Setup Instructions

## Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your account
3. Select your project: `ssgzccuerqchwcpbytpu`

## Step 2: Run the Database Setup Script
1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `setup-database.sql` file
4. Paste it into the SQL Editor
5. Click **"Run"** to execute the script

## Step 3: Verify the Setup
After running the script, you should see:
- ✅ 3 subjects created (Computer Science, AI, ECE)
- ✅ 15 questions created (5 per subject)
- ✅ 6 tests created (2 per subject)
- ✅ All necessary tables and policies created

## Step 4: Test the Application
1. Go back to your application at `http://localhost:3000`
2. Login with your account
3. You should now see real data instead of demo data!

## What This Script Does:
- Creates all necessary database tables
- Sets up proper security policies
- Inserts sample subjects, questions, and tests
- Links questions to their respective subjects and tests
- Creates proper relationships between all entities

## Troubleshooting:
If you encounter any errors:
1. Make sure you're in the correct Supabase project
2. Check that your user has admin privileges
3. Try running the script in smaller chunks if it's too large
4. Check the Supabase logs for any specific error messages

Once this is done, your application will show real data instead of the fake demo data!
