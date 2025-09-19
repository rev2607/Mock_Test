-- JEE Mains 2025 Question Paper Database Insertion Script
-- This script inserts JEE Mains 2025 questions into the database
-- Run this in your Supabase SQL Editor

-- First, ensure we have the JEE Mains subject
INSERT INTO subjects (id, name, key) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025',
    'jee-mains-2025'
) ON CONFLICT (key) DO NOTHING;

-- Get the subject ID for reference
-- You can use this ID: 550e8400-e29b-41d4-a716-446655440000

-- Sample question structure (replace with actual questions from PDF)
-- Mathematics Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Mathematics - Question 1',
    'If the equation x² + 2x + 3 = 0 has roots α and β, then the value of α² + β² is:
    
    (A) 2
    (B) -2  
    (C) 4
    (D) -4',
    'Algebra',
    2
);

-- Options for Question 1 (using a variable to store the question ID)
DO $$
DECLARE
    q1_id UUID;
BEGIN
    -- Get the question ID we just inserted
    SELECT id INTO q1_id FROM questions WHERE title = 'JEE Mains 2025 - Mathematics - Question 1' LIMIT 1;
    
    -- Insert options
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q1_id, '2', false),
        (gen_random_uuid(), q1_id, '-2', true),
        (gen_random_uuid(), q1_id, '4', false),
        (gen_random_uuid(), q1_id, '-4', false);
END $$;

-- Physics Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Physics - Question 1',
    'A particle moves in a straight line with velocity v = 3t² - 2t + 1 m/s. The acceleration at t = 2s is:
    
    (A) 10 m/s²
    (B) 8 m/s²
    (C) 6 m/s²
    (D) 4 m/s²',
    'Kinematics',
    2
);

-- Options for Physics Question
DO $$
DECLARE
    q2_id UUID;
BEGIN
    -- Get the question ID we just inserted
    SELECT id INTO q2_id FROM questions WHERE title = 'JEE Mains 2025 - Physics - Question 1' LIMIT 1;
    
    -- Insert options
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q2_id, '10 m/s²', true),
        (gen_random_uuid(), q2_id, '8 m/s²', false),
        (gen_random_uuid(), q2_id, '6 m/s²', false),
        (gen_random_uuid(), q2_id, '4 m/s²', false);
END $$;

-- Chemistry Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Chemistry - Question 1',
    'The IUPAC name of CH₃-CH₂-CH=CH₂ is:
    
    (A) But-1-ene
    (B) But-2-ene
    (C) 1-Butene
    (D) 2-Butene',
    'Organic Chemistry',
    1
);

-- Options for Chemistry Question
DO $$
DECLARE
    q3_id UUID;
BEGIN
    -- Get the question ID we just inserted
    SELECT id INTO q3_id FROM questions WHERE title = 'JEE Mains 2025 - Chemistry - Question 1' LIMIT 1;
    
    -- Insert options
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q3_id, 'But-1-ene', true),
        (gen_random_uuid(), q3_id, 'But-2-ene', false),
        (gen_random_uuid(), q3_id, '1-Butene', false),
        (gen_random_uuid(), q3_id, '2-Butene', false);
END $$;

-- Create a test for JEE Mains 2025
INSERT INTO tests (id, subject_id, title, duration_minutes, shuffle) VALUES (
    gen_random_uuid(),
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Full Paper',
    180,  -- 3 hours
    true
);

-- Add questions to the test
DO $$
DECLARE
    test_id UUID;
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
BEGIN
    -- Get the test ID we just inserted
    SELECT id INTO test_id FROM tests WHERE title = 'JEE Mains 2025 - Full Paper' LIMIT 1;
    
    -- Get question IDs
    SELECT id INTO q1_id FROM questions WHERE title = 'JEE Mains 2025 - Mathematics - Question 1' LIMIT 1;
    SELECT id INTO q2_id FROM questions WHERE title = 'JEE Mains 2025 - Physics - Question 1' LIMIT 1;
    SELECT id INTO q3_id FROM questions WHERE title = 'JEE Mains 2025 - Chemistry - Question 1' LIMIT 1;
    
    -- Insert test questions
    INSERT INTO test_questions (id, test_id, question_id, position) VALUES 
        (gen_random_uuid(), test_id, q1_id, 1),
        (gen_random_uuid(), test_id, q2_id, 2),
        (gen_random_uuid(), test_id, q3_id, 3);
END $$;

-- Instructions for manual data entry:
/*
MANUAL DATA ENTRY INSTRUCTIONS:

1. MATHEMATICAL NOTATIONS:
   - Use Unicode characters for mathematical symbols
   - For fractions: use ⁄ (U+2044) or / 
   - For powers: use superscript characters (², ³, etc.)
   - For subscripts: use subscript characters (₁, ₂, etc.)
   - For Greek letters: use actual Greek characters (α, β, π, etc.)

2. DIAGRAMS:
   - Describe diagrams in text format
   - Use ASCII art for simple diagrams
   - Include coordinate information for graphs
   - Example: "A circle with center at (0,0) and radius 5 units"

3. QUESTION FORMAT:
   - Include the complete question text
   - Preserve all mathematical expressions exactly
   - Include any diagrams or figures as text descriptions
   - Maintain the original numbering

4. ANSWER OPTIONS:
   - Include all options (A), (B), (C), (D)
   - Mark the correct answer with is_correct = true
   - Preserve mathematical formatting in options

5. TOPICS:
   - Mathematics: Algebra, Calculus, Trigonometry, Coordinate Geometry, etc.
   - Physics: Mechanics, Thermodynamics, Optics, Electricity, etc.
   - Chemistry: Organic, Inorganic, Physical Chemistry

6. DIFFICULTY LEVELS:
   - 1: Easy
   - 2: Medium  
   - 3: Hard

7. UUID GENERATION:
   - Use online UUID generators or database functions
   - Ensure all UUIDs are unique
   - Use consistent naming convention

EXAMPLE FORMAT:
Question: "If f(x) = x² + 2x + 1, then f'(x) = ?"
Options:
- (A) 2x + 2
- (B) 2x + 1  
- (C) x + 2
- (D) 2x

Correct Answer: (A) 2x + 2
*/
