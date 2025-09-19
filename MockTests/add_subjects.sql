-- Add missing subjects for JEE Mains
-- Run this in your Supabase SQL Editor

-- Insert JEE Mains subjects with proper keys
INSERT INTO subjects (id, name, key) VALUES 
    (gen_random_uuid(), 'IIT JEE', 'iit'),
    (gen_random_uuid(), 'AIIMS', 'aiims'),
    (gen_random_uuid(), 'EAMCET', 'eamcet'),
    (gen_random_uuid(), 'JEE Mains 2025', 'jee-mains-2025')
ON CONFLICT (key) DO NOTHING;

-- Verify subjects were added
SELECT id, name, key FROM subjects ORDER BY name;
