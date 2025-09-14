-- Fix profiles data issues
-- This script addresses the email not being saved and incorrect target exam values

-- First, let's update the trigger functions to include email
-- (This should be run in Supabase SQL Editor)

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, user_name, phone_number, city, pincode, target_exam, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'user_name',
        NEW.raw_user_meta_data->>'phone_number',
        NEW.raw_user_meta_data->>'city',
        NEW.raw_user_meta_data->>'pincode',
        NEW.raw_user_meta_data->>'target_exam',
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_user_update function to include email
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the profiles table when user metadata changes
    UPDATE public.profiles
    SET 
        email = NEW.email,
        user_name = NEW.raw_user_meta_data->>'user_name',
        phone_number = NEW.raw_user_meta_data->>'phone_number',
        city = NEW.raw_user_meta_data->>'city',
        pincode = NEW.raw_user_meta_data->>'pincode',
        target_exam = NEW.raw_user_meta_data->>'target_exam',
        role = 'student',
        updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix existing profiles by updating email from auth.users
UPDATE public.profiles 
SET email = auth_users.email
FROM auth.users AS auth_users
WHERE public.profiles.id = auth_users.id 
AND public.profiles.email IS NULL;

-- Fix target exam values to match the new format
UPDATE public.profiles 
SET target_exam = 'IIT/JEE'
WHERE target_exam = 'jee-mains' OR target_exam = 'jee-advanced';

UPDATE public.profiles 
SET target_exam = 'EAMCET'
WHERE target_exam = 'eamcet';

UPDATE public.profiles 
SET target_exam = 'AIIMS'
WHERE target_exam = 'aiims';

-- Verify the fixes
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
