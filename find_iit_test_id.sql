-- Find the test ID for IIT JEE Mock Test 1
SELECT 
    t.id,
    t.title,
    s.name as subject_name,
    s.key as subject_key
FROM tests t
JOIN subjects s ON t.subject_id = s.id
WHERE t.title = 'IIT JEE Mock Test 1';
