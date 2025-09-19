-- Add Sample Questions to IIT JEE Test
-- This script adds sample questions to make the test functional

-- First, let's add some sample questions for IIT JEE
-- Mathematics Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES 
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Mathematics - Question 1', 
     'If the equation x² + 2x + 3 = 0 has roots α and β, then the value of α² + β² is:
     
     (A) 2
     (B) -2  
     (C) 4
     (D) -4', 'Algebra', 2),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Mathematics - Question 2',
     'The value of ∫₀^π/2 sin³x cos²x dx is:
     
     (A) 2/15
     (B) 4/15
     (C) 8/15
     (D) 16/15', 'Calculus', 3),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Mathematics - Question 3',
     'If the line y = mx + c is tangent to the circle x² + y² = 16, then:
     
     (A) c = 4√(1 + m²)
     (B) c = -4√(1 + m²)
     (C) c = ±4√(1 + m²)
     (D) c = 4√(1 - m²)', 'Coordinate Geometry', 2);

-- Physics Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES 
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Physics - Question 1',
     'A particle moves in a straight line with velocity v = 3t² - 2t + 1 m/s. The acceleration at t = 2s is:
     
     (A) 10 m/s²
     (B) 8 m/s²
     (C) 6 m/s²
     (D) 4 m/s²', 'Kinematics', 2),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Physics - Question 2',
     'A block of mass 2 kg is placed on a rough horizontal surface. If the coefficient of friction is 0.3, the minimum force required to move the block is:
     
     (A) 5.88 N
     (B) 6.0 N
     (C) 5.4 N
     (D) 6.6 N', 'Mechanics', 2),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Physics - Question 3',
     'The wavelength of light in vacuum is 600 nm. In a medium of refractive index 1.5, its wavelength will be:
     
     (A) 400 nm
     (B) 600 nm
     (C) 900 nm
     (D) 1200 nm', 'Optics', 1);

-- Chemistry Questions
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES 
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Chemistry - Question 1',
     'The IUPAC name of CH₃-CH₂-CH=CH₂ is:
     
     (A) But-1-ene
     (B) But-2-ene
     (C) 1-Butene
     (D) 2-Butene', 'Organic Chemistry', 1),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Chemistry - Question 2',
     'The pH of a 0.1 M solution of NH₄Cl (Kb for NH₃ = 1.8 × 10⁻⁵) is:
     
     (A) 5.13
     (B) 6.13
     (C) 7.13
     (D) 8.13', 'Physical Chemistry', 3),
     
    (gen_random_uuid(), (SELECT id FROM subjects WHERE key = 'iit'), 'IIT JEE Chemistry - Question 3',
     'Which of the following is not a transition element?
     
     (A) Cu
     (B) Zn
     (C) Fe
     (D) Cr', 'Inorganic Chemistry', 1);

-- Now add options for each question
-- Mathematics Question 1 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 1';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '2', false),
        (gen_random_uuid(), q_id, '-2', true),
        (gen_random_uuid(), q_id, '4', false),
        (gen_random_uuid(), q_id, '-4', false);
END $$;

-- Mathematics Question 2 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 2';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '2/15', false),
        (gen_random_uuid(), q_id, '4/15', false),
        (gen_random_uuid(), q_id, '8/15', true),
        (gen_random_uuid(), q_id, '16/15', false);
END $$;

-- Mathematics Question 3 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 3';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, 'c = 4√(1 + m²)', false),
        (gen_random_uuid(), q_id, 'c = -4√(1 + m²)', false),
        (gen_random_uuid(), q_id, 'c = ±4√(1 + m²)', true),
        (gen_random_uuid(), q_id, 'c = 4√(1 - m²)', false);
END $$;

-- Physics Question 1 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Physics - Question 1';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '10 m/s²', true),
        (gen_random_uuid(), q_id, '8 m/s²', false),
        (gen_random_uuid(), q_id, '6 m/s²', false),
        (gen_random_uuid(), q_id, '4 m/s²', false);
END $$;

-- Physics Question 2 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Physics - Question 2';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '5.88 N', true),
        (gen_random_uuid(), q_id, '6.0 N', false),
        (gen_random_uuid(), q_id, '5.4 N', false),
        (gen_random_uuid(), q_id, '6.6 N', false);
END $$;

-- Physics Question 3 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Physics - Question 3';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '400 nm', true),
        (gen_random_uuid(), q_id, '600 nm', false),
        (gen_random_uuid(), q_id, '900 nm', false),
        (gen_random_uuid(), q_id, '1200 nm', false);
END $$;

-- Chemistry Question 1 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 1';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, 'But-1-ene', true),
        (gen_random_uuid(), q_id, 'But-2-ene', false),
        (gen_random_uuid(), q_id, '1-Butene', false),
        (gen_random_uuid(), q_id, '2-Butene', false);
END $$;

-- Chemistry Question 2 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 2';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, '5.13', true),
        (gen_random_uuid(), q_id, '6.13', false),
        (gen_random_uuid(), q_id, '7.13', false),
        (gen_random_uuid(), q_id, '8.13', false);
END $$;

-- Chemistry Question 3 options
DO $$
DECLARE
    q_id UUID;
BEGIN
    SELECT id INTO q_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 3';
    
    INSERT INTO options (id, question_id, text, is_correct) VALUES 
        (gen_random_uuid(), q_id, 'Cu', false),
        (gen_random_uuid(), q_id, 'Zn', true),
        (gen_random_uuid(), q_id, 'Fe', false),
        (gen_random_uuid(), q_id, 'Cr', false);
END $$;

-- Now add these questions to the IIT JEE test
DO $$
DECLARE
    test_id UUID;
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
    q4_id UUID;
    q5_id UUID;
    q6_id UUID;
    q7_id UUID;
    q8_id UUID;
    q9_id UUID;
BEGIN
    -- Get the test ID
    SELECT id INTO test_id FROM tests WHERE title = 'IIT JEE Mock Test 1';
    
    -- Get question IDs
    SELECT id INTO q1_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 1';
    SELECT id INTO q2_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 2';
    SELECT id INTO q3_id FROM questions WHERE title = 'IIT JEE Mathematics - Question 3';
    SELECT id INTO q4_id FROM questions WHERE title = 'IIT JEE Physics - Question 1';
    SELECT id INTO q5_id FROM questions WHERE title = 'IIT JEE Physics - Question 2';
    SELECT id INTO q6_id FROM questions WHERE title = 'IIT JEE Physics - Question 3';
    SELECT id INTO q7_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 1';
    SELECT id INTO q8_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 2';
    SELECT id INTO q9_id FROM questions WHERE title = 'IIT JEE Chemistry - Question 3';
    
    -- Add questions to test
    INSERT INTO test_questions (id, test_id, question_id, position) VALUES 
        (gen_random_uuid(), test_id, q1_id, 1),
        (gen_random_uuid(), test_id, q2_id, 2),
        (gen_random_uuid(), test_id, q3_id, 3),
        (gen_random_uuid(), test_id, q4_id, 4),
        (gen_random_uuid(), test_id, q5_id, 5),
        (gen_random_uuid(), test_id, q6_id, 6),
        (gen_random_uuid(), test_id, q7_id, 7),
        (gen_random_uuid(), test_id, q8_id, 8),
        (gen_random_uuid(), test_id, q9_id, 9);
END $$;

-- Verify the setup
SELECT 
    t.title as test_title,
    COUNT(tq.question_id) as question_count
FROM tests t
LEFT JOIN test_questions tq ON t.id = tq.test_id
WHERE t.title = 'IIT JEE Mock Test 1'
GROUP BY t.id, t.title;
