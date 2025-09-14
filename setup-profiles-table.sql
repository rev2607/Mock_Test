-- Create profiles table to store user profile details
-- This table will be automatically updated when users signup or update their profile

-- Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    user_name TEXT,
    phone_number TEXT,
    city TEXT,
    pincode TEXT,
    target_exam TEXT,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, user_name, phone_number, city, pincode, target_exam, role)
    VALUES (
        NEW.id,
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

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the profiles table when user metadata changes
    UPDATE public.profiles
    SET 
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

-- Create trigger to automatically update profile when user metadata changes
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_target_exam_idx ON public.profiles(target_exam);

-- Insert sample data (optional)
-- INSERT INTO public.profiles (id, email, user_name, phone_number, city, pincode, target_exam, role)
-- VALUES 
--     ('11111111-1111-1111-1111-111111111111', 'student@studenthub.in', 'Test Student', '8888888888', 'Bangalore', '560001', 'NEET', 'student'),
--     ('22222222-2222-2222-2222-222222222222', 'student2@studenthub.in', 'Another Student', '7777777777', 'Mumbai', '400001', 'IIT/JEE', 'student');

COMMENT ON TABLE public.profiles IS 'User profile information synchronized with auth.users';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users(id)';
COMMENT ON COLUMN public.profiles.user_name IS 'Full name of the user';
COMMENT ON COLUMN public.profiles.phone_number IS 'Phone number of the user';
COMMENT ON COLUMN public.profiles.city IS 'City where the user lives';
COMMENT ON COLUMN public.profiles.pincode IS 'Pincode of the user';
COMMENT ON COLUMN public.profiles.target_exam IS 'Target exam the user is preparing for';
COMMENT ON COLUMN public.profiles.role IS 'User role (student, admin, etc.)';
COMMENT ON COLUMN public.profiles.created_at IS 'When the profile was created';
COMMENT ON COLUMN public.profiles.updated_at IS 'When the profile was last updated';
