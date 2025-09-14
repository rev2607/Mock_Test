# Signup Fix Testing Guide

## Issues Fixed

### 1. Email Not Being Saved
**Problem**: The `handle_new_user()` trigger function was not including the email field when creating profiles.

**Solution**: Updated the trigger function to include `NEW.email` in the INSERT statement.

### 2. Incorrect Target Exam Values
**Problem**: The signup form had different exam option values than what was expected in the database.

**Solution**: 
- Updated exam options to use consistent naming (e.g., "IIT/JEE" instead of "jee-mains")
- Added more exam options for better coverage
- Created SQL script to fix existing incorrect values

## Files Modified

1. **setup-profiles-table.sql** - Fixed trigger functions to include email
2. **src/app/auth/signup/page.tsx** - Updated exam options to match database expectations
3. **fix_profiles_data.sql** - Script to fix existing data issues

## Testing Steps

### 1. Run the Database Fix Script
Execute `fix_profiles_data.sql` in your Supabase SQL Editor to:
- Update trigger functions
- Fix existing profiles with missing emails
- Correct target exam values

### 2. Test New User Signup
1. Go to `/auth/signup`
2. Fill out the form with:
   - Valid email address
   - Full name
   - Phone number
   - City and pincode
   - Select a target exam from the dropdown
   - Password
3. Submit the form
4. Check the profiles table to verify:
   - Email is saved correctly
   - Target exam value matches the selection
   - All other fields are populated

### 3. Verify Existing Data
Run this query to check if existing profiles were fixed:
```sql
SELECT 
    id,
    email,
    user_name,
    phone_number,
    city,
    pincode,
    target_exam,
    role,
    created_at,
    updated_at
FROM public.profiles
ORDER BY created_at DESC;
```

## Expected Results

- ✅ Email field should be populated for all users
- ✅ Target exam values should be consistent (e.g., "IIT/JEE", "EAMCET", "AIIMS")
- ✅ New signups should work correctly with all fields saved
- ✅ No more empty email fields in the profiles table

## Exam Options Available

The signup form now includes these exam options:
- IIT/JEE
- JEE Mains
- JEE Advanced
- EAMCET
- AIIMS
- NEET
- BITSAT
- VITEEE
