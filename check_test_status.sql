-- Check Test Status
-- This script shows the current state of tests and questions

-- Check subjects
SELECT 'Subjects:' as info;
SELECT id, name, key FROM subjects ORDER BY name;

-- Check tests
SELECT 'Tests:' as info;
SELECT 
    t.id,
    t.title,
    s.name as subject_name,
    s.key as subject_key,
    t.duration_minutes
FROM tests t
JOIN subjects s ON t.subject_id = s.id
ORDER BY t.title;

-- Check questions for IIT JEE
SELECT 'IIT JEE Questions:' as info;
SELECT 
    q.id,
    q.title,
    q.topic,
    q.difficulty,
    COUNT(o.id) as option_count
FROM questions q
JOIN subjects s ON q.subject_id = s.id
LEFT JOIN options o ON q.id = o.question_id
WHERE s.key = 'iit'
GROUP BY q.id, q.title, q.topic, q.difficulty
ORDER BY q.title;

-- Check test_questions for IIT JEE Mock Test 1
SELECT 'Test Questions for IIT JEE Mock Test 1:' as info;
SELECT 
    tq.position,
    q.title as question_title,
    q.topic
FROM test_questions tq
JOIN tests t ON tq.test_id = t.id
JOIN questions q ON tq.question_id = q.id
WHERE t.title = 'IIT JEE Mock Test 1'
ORDER BY tq.position;

-- Check question count for each test
SELECT 'Question Count per Test:' as info;
SELECT 
    t.title as test_title,
    s.name as subject_name,
    COUNT(tq.question_id) as question_count
FROM tests t
JOIN subjects s ON t.subject_id = s.id
LEFT JOIN test_questions tq ON t.id = tq.test_id
GROUP BY t.id, t.title, s.name
ORDER BY t.title;
