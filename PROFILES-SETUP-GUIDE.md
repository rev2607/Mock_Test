# Profiles Table Setup Guide

This guide will help you set up a `profiles` table in Supabase that automatically syncs with user profile data.

## 🚀 Quick Setup

### Step 1: Run the SQL Script
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `setup-profiles-table.sql`
4. Click **Run** to execute the script

### Step 2: Verify the Table
1. Go to **Table Editor** in your Supabase Dashboard
2. You should see a new `profiles` table under the `public` schema
3. The table should have these columns:
   - `id` (UUID, Primary Key)
   - `email` (Text)
   - `user_name` (Text)
   - `phone_number` (Text)
   - `city` (Text)
   - `pincode` (Text)
   - `target_exam` (Text)
   - `role` (Text)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

## 🔧 What the Script Does

### 1. Creates the Profiles Table
- Stores all user profile information
- Links to `auth.users` via foreign key
- Includes all profile fields from signup

### 2. Sets Up Row Level Security (RLS)
- Users can only see/edit their own profile
- Prevents unauthorized access to profile data
- Follows Supabase security best practices

### 3. Creates Automatic Triggers
- **On User Signup**: Automatically creates profile record
- **On Profile Update**: Syncs changes from auth to profiles table
- **Timestamp Updates**: Automatically updates `updated_at` field

### 4. Adds Performance Indexes
- Faster queries on user ID, role, and target exam
- Optimized for common lookup patterns

## 📊 How It Works

### When a User Signs Up:
1. User fills out signup form with profile details
2. Supabase Auth creates user account
3. Trigger automatically creates profile record in `profiles` table
4. All profile data is stored in both places

### When a User Updates Profile:
1. User updates profile through the app
2. Auth metadata is updated
3. Trigger automatically syncs to `profiles` table
4. Both auth and profiles table stay in sync

### When You Need Profile Data:
1. Query the `profiles` table for user information
2. Use joins with other tables for complex queries
3. Access profile data without hitting auth limits

## 🎯 Benefits

- **Centralized Profile Data**: All user info in one table
- **Automatic Sync**: No manual data management needed
- **Better Performance**: Faster queries than auth metadata
- **Rich Queries**: Can join with other tables easily
- **Data Integrity**: Triggers ensure data consistency

## 🔍 Testing

### Test User Signup:
1. Create a new user account
2. Check the `profiles` table - should see new record
3. Verify all profile fields are populated

### Test Profile Update:
1. Update profile through the app
2. Check the `profiles` table - should see updated record
3. Verify `updated_at` timestamp changed

## 🛠️ Troubleshooting

### If Triggers Don't Work:
1. Check if RLS is enabled on the table
2. Verify trigger functions exist
3. Check Supabase logs for errors

### If Data Doesn't Sync:
1. Ensure triggers are created properly
2. Check user permissions
3. Verify foreign key constraints

## 📝 Next Steps

After setting up the profiles table:
1. Update your app to use the profiles table for user data
2. Create admin views to manage user profiles
3. Add additional profile fields as needed
4. Set up data exports and analytics

## 🔗 Related Files

- `setup-profiles-table.sql` - Main setup script
- `src/lib/database.types.ts` - Updated with profiles table types
- `src/app/profile/edit/page.tsx` - Updated to sync with profiles table
