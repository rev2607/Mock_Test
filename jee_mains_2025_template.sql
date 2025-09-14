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
    'q1-uuid-here',
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

-- Options for Question 1
INSERT INTO options (id, question_id, text, is_correct) VALUES 
    ('opt1-uuid-here', 'q1-uuid-here', '2', false),
    ('opt2-uuid-here', 'q1-uuid-here', '-2', true),
    ('opt3-uuid-here', 'q1-uuid-here', '4', false),
    ('opt4-uuid-here', 'q1-uuid-here', '-4', false);

-- Physics Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    'q2-uuid-here',
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
INSERT INTO options (id, question_id, text, is_correct) VALUES 
    ('opt5-uuid-here', 'q2-uuid-here', '10 m/s²', true),
    ('opt6-uuid-here', 'q2-uuid-here', '8 m/s²', false),
    ('opt7-uuid-here', 'q2-uuid-here', '6 m/s²', false),
    ('opt8-uuid-here', 'q2-uuid-here', '4 m/s²', false);

-- Chemistry Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    'q3-uuid-here',
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
INSERT INTO options (id, question_id, text, is_correct) VALUES 
    ('opt9-uuid-here', 'q3-uuid-here', 'But-1-ene', true),
    ('opt10-uuid-here', 'q3-uuid-here', 'But-2-ene', false),
    ('opt11-uuid-here', 'q3-uuid-here', '1-Butene', false),
    ('opt12-uuid-here', 'q3-uuid-here', '2-Butene', false);

-- Create a test for JEE Mains 2025
INSERT INTO tests (id, subject_id, title, duration_minutes, shuffle) VALUES (
    'test-uuid-here',
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Full Paper',
    180,  -- 3 hours
    true
);

-- Add questions to the test
INSERT INTO test_questions (id, test_id, question_id, position) VALUES 
    ('tq1-uuid-here', 'test-uuid-here', 'q1-uuid-here', 1),
    ('tq2-uuid-here', 'test-uuid-here', 'q2-uuid-here', 2),
    ('tq3-uuid-here', 'test-uuid-here', 'q3-uuid-here', 3);

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
