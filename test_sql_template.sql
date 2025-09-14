-- Test SQL Template for JEE Mains 2025
-- This is a simplified version to test the UUID generation

-- First, ensure we have the JEE Mains subject
INSERT INTO subjects (id, name, key) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025',
    'jee-mains-2025'
) ON CONFLICT (key) DO NOTHING;

-- Test question with proper UUID generation
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Test Question',
    'This is a test question to verify UUID generation works correctly.
    
    (A) Option A
    (B) Option B
    (C) Option C
    (D) Option D',
    'Test',
    1
);

-- Test options insertion
DO $$
DECLARE
    q_id UUID;
BEGIN
    -- Get the question ID we just inserted
    SELECT id INTO q_id FROM questions WHERE title = 'JEE Mains 2025 - Test Question' LIMIT 1;
    
    -- Insert options
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, 'Option A', false),
        (gen_random_uuid(), q_id, 'Option B', true),
        (gen_random_uuid(), q_id, 'Option C', false),
        (gen_random_uuid(), q_id, 'Option D', false);
END $$;

-- Verify the data was inserted correctly
SELECT 
    q.title,
    q.body,
    o.text as option_text,
    o.is_correct
FROM questions q
JOIN options o ON q.id = o.question_id
WHERE q.title = 'JEE Mains 2025 - Test Question'
ORDER BY o.text;
