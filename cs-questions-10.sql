-- 10 Comprehensive CS Questions for SQL Editor
-- Run this in your Supabase SQL Editor

DO $$
DECLARE
    cs_subject_id UUID;
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
    q10_id UUID;
BEGIN
    -- Get the CS subject ID
    SELECT id INTO cs_subject_id FROM subjects WHERE key = 'cs' LIMIT 1;
    
    -- Question 1: Data Structures - Arrays
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What is the time complexity of accessing an element in an array?',
        'Arrays are fundamental data structures that store elements in contiguous memory locations. Accessing any element requires knowing its index position.',
        'Data Structures',
        1
      )
    RETURNING id INTO q1_id;

    -- Add options for Question 1
    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q1_id, 'O(n)', false),
      (q1_id, 'O(1)', true),
      (q1_id, 'O(log n)', false),
      (q1_id, 'O(n²)', false);

    -- Question 2: Algorithms - Sorting
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'Which sorting algorithm is most efficient for small datasets?',
        'Different sorting algorithms have different performance characteristics. Some are better for small datasets, others for large datasets.',
        'Algorithms',
        2
      )
    RETURNING id INTO q2_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q2_id, 'Quick Sort', false),
      (q2_id, 'Insertion Sort', true),
      (q2_id, 'Merge Sort', false),
      (q2_id, 'Heap Sort', false);

    -- Question 3: Operating Systems - Memory Management
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What is virtual memory?',
        'Virtual memory is a memory management technique that allows a computer to compensate for physical memory shortages by temporarily transferring data from RAM to disk storage.',
        'Operating Systems',
        2
      )
    RETURNING id INTO q3_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q3_id, 'A type of RAM that is faster than regular RAM', false),
      (q3_id, 'A memory management technique that uses disk space as an extension of RAM', true),
      (q3_id, 'Memory that is shared between multiple processes', false),
      (q3_id, 'Memory that stores only program instructions', false);

    -- Question 4: Database Systems - SQL
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'Which SQL command is used to retrieve data from a database?',
        'SQL (Structured Query Language) provides various commands for database operations including data retrieval, insertion, updating, and deletion.',
        'Database Systems',
        1
      )
    RETURNING id INTO q4_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q4_id, 'INSERT', false),
      (q4_id, 'SELECT', true),
      (q4_id, 'UPDATE', false),
      (q4_id, 'DELETE', false);

    -- Question 5: Computer Networks - Protocols
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What does HTTP stand for?',
        'HTTP is a protocol used for transferring data over the internet. It is the foundation of data communication for the World Wide Web.',
        'Computer Networks',
        1
      )
    RETURNING id INTO q5_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q5_id, 'HyperText Transfer Protocol', true),
      (q5_id, 'High Transfer Text Protocol', false),
      (q5_id, 'HyperText Transmission Protocol', false),
      (q5_id, 'Home Transfer Text Protocol', false);

    -- Question 6: Software Engineering - Design Patterns
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'Which design pattern ensures only one instance of a class exists?',
        'Design patterns are reusable solutions to commonly occurring problems in software design. The Singleton pattern is one of the most well-known creational patterns.',
        'Software Engineering',
        3
      )
    RETURNING id INTO q6_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q6_id, 'Factory Pattern', false),
      (q6_id, 'Observer Pattern', false),
      (q6_id, 'Singleton Pattern', true),
      (q6_id, 'Builder Pattern', false);

    -- Question 7: Computer Architecture - CPU
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What is the purpose of the CPU cache?',
        'CPU cache is a small, fast memory that stores frequently accessed data and instructions to speed up processing by reducing the time needed to access data from main memory.',
        'Computer Architecture',
        2
      )
    RETURNING id INTO q7_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q7_id, 'To store permanent data', false),
      (q7_id, 'To speed up data access by storing frequently used data', true),
      (q7_id, 'To increase the total memory capacity', false),
      (q7_id, 'To store backup copies of files', false);

    -- Question 8: Programming Languages - OOP
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What is polymorphism in object-oriented programming?',
        'Polymorphism is one of the four fundamental principles of OOP. It allows objects of different types to be treated as objects of a common base type.',
        'Programming Languages',
        2
      )
    RETURNING id INTO q8_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q8_id, 'The ability to create multiple instances of a class', false),
      (q8_id, 'The ability of objects to take on many forms and respond differently to the same method call', true),
      (q8_id, 'The process of hiding internal implementation details', false),
      (q8_id, 'The ability to inherit from multiple parent classes', false);

    -- Question 9: Data Structures - Trees
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'What is the maximum number of children a node can have in a binary tree?',
        'A binary tree is a tree data structure in which each node has at most two children, referred to as the left child and the right child.',
        'Data Structures',
        1
      )
    RETURNING id INTO q9_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q9_id, '1', false),
      (q9_id, '2', true),
      (q9_id, '3', false),
      (q9_id, 'Unlimited', false);

    -- Question 10: Algorithms - Graph Theory
    INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
      (
        cs_subject_id,
        'Which algorithm is used to find the shortest path in a weighted graph?',
        'Graph algorithms are used to solve problems involving graphs. The shortest path problem is one of the most fundamental problems in graph theory.',
        'Algorithms',
        3
      )
    RETURNING id INTO q10_id;

    INSERT INTO options (question_id, text, is_correct) VALUES 
      (q10_id, 'Breadth-First Search (BFS)', false),
      (q10_id, 'Depth-First Search (DFS)', false),
      (q10_id, 'Dijkstra''s Algorithm', true),
      (q10_id, 'Bubble Sort', false);

    -- Create a comprehensive CS test with all 10 questions
    INSERT INTO tests (subject_id, title, duration_minutes, shuffle) VALUES 
      (
        cs_subject_id,
        'Comprehensive CS Fundamentals Test',
        90,
        true
      )
    RETURNING id INTO test_id;

    -- Add all 10 questions to the test
    INSERT INTO test_questions (test_id, question_id, position) VALUES 
      (test_id, q1_id, 1),
      (test_id, q2_id, 2),
      (test_id, q3_id, 3),
      (test_id, q4_id, 4),
      (test_id, q5_id, 5),
      (test_id, q6_id, 6),
      (test_id, q7_id, 7),
      (test_id, q8_id, 8),
      (test_id, q9_id, 9),
      (test_id, q10_id, 10);

END $$;