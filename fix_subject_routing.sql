-- Fix Subject Routing Issues
-- This script addresses the UUID vs Key routing problem

-- Step 1: Add missing subjects with proper keys
INSERT INTO subjects (id, name, key) VALUES 
    (gen_random_uuid(), 'IIT JEE', 'iit'),
    (gen_random_uuid(), 'AIIMS', 'aiims'),
    (gen_random_uuid(), 'EAMCET', 'eamcet'),
    (gen_random_uuid(), 'JEE Mains 2025', 'jee-mains-2025'),
    (gen_random_uuid(), 'Mathematics', 'mathematics'),
    (gen_random_uuid(), 'Physics', 'physics'),
    (gen_random_uuid(), 'Chemistry', 'chemistry')
ON CONFLICT (key) DO NOTHING;

-- Step 2: Create sample tests for each subject
DO $$
DECLARE
    iit_id UUID;
    aiims_id UUID;
    eamcet_id UUID;
    jee_2025_id UUID;
    math_id UUID;
    physics_id UUID;
    chemistry_id UUID;
BEGIN
    -- Get subject IDs
    SELECT id INTO iit_id FROM subjects WHERE key = 'iit';
    SELECT id INTO aiims_id FROM subjects WHERE key = 'aiims';
    SELECT id INTO eamcet_id FROM subjects WHERE key = 'eamcet';
    SELECT id INTO jee_2025_id FROM subjects WHERE key = 'jee-mains-2025';
    SELECT id INTO math_id FROM subjects WHERE key = 'mathematics';
    SELECT id INTO physics_id FROM subjects WHERE key = 'physics';
    SELECT id INTO chemistry_id FROM subjects WHERE key = 'chemistry';
    
    -- Create sample tests
    INSERT INTO tests (id, subject_id, title, duration_minutes, shuffle) VALUES 
        (gen_random_uuid(), iit_id, 'IIT JEE Mock Test 1', 180, true),
        (gen_random_uuid(), aiims_id, 'AIIMS Mock Test 1', 180, true),
        (gen_random_uuid(), eamcet_id, 'EAMCET Mock Test 1', 180, true),
        (gen_random_uuid(), jee_2025_id, 'JEE Mains 2025 - Full Paper', 180, true),
        (gen_random_uuid(), math_id, 'Mathematics Practice Test', 90, true),
        (gen_random_uuid(), physics_id, 'Physics Practice Test', 90, true),
        (gen_random_uuid(), chemistry_id, 'Chemistry Practice Test', 90, true)
    ON CONFLICT DO NOTHING;
END $$;

-- Step 3: Verify the setup
SELECT 
    s.name as subject_name,
    s.key as subject_key,
    COUNT(t.id) as test_count
FROM subjects s
LEFT JOIN tests t ON s.id = t.subject_id
GROUP BY s.id, s.name, s.key
ORDER BY s.name;
