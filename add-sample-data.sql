-- Add Sample Questions and Tests
-- Run this in your Supabase SQL Editor

-- First, let's add some sample questions for Computer Science
INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'What is the time complexity of binary search?',
    'Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you have narrowed down the possible locations to just one.',
    'Algorithms',
    2
  ),
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'Which data structure follows LIFO principle?',
    'LIFO stands for Last In, First Out. This means the last element added to the structure will be the first one to be removed.',
    'Data Structures',
    1
  ),
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'What is the purpose of a constructor in OOP?',
    'Constructors are special methods that are called when an object is created. They are used to initialize the object with default values or values provided by the user.',
    'Object-Oriented Programming',
    1
  ),
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'Which sorting algorithm has O(n log n) average time complexity?',
    'This algorithm divides the array into two halves and recursively sorts them. It then merges the sorted halves.',
    'Algorithms',
    2
  ),
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'What is encapsulation in OOP?',
    'Encapsulation is one of the four fundamental OOP concepts. It involves bundling data and methods that work on that data within one unit.',
    'Object-Oriented Programming',
    2
  )
ON CONFLICT DO NOTHING;

-- Add options for the first question (Binary Search)
INSERT INTO options (question_id, text, is_correct) VALUES 
  (
    (SELECT id FROM questions WHERE title = 'What is the time complexity of binary search?'),
    'O(n)',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the time complexity of binary search?'),
    'O(log n)',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the time complexity of binary search?'),
    'O(n²)',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the time complexity of binary search?'),
    'O(1)',
    false
  )
ON CONFLICT DO NOTHING;

-- Add options for the second question (LIFO)
INSERT INTO options (question_id, text, is_correct) VALUES 
  (
    (SELECT id FROM questions WHERE title = 'Which data structure follows LIFO principle?'),
    'Queue',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which data structure follows LIFO principle?'),
    'Stack',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which data structure follows LIFO principle?'),
    'Array',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which data structure follows LIFO principle?'),
    'Linked List',
    false
  )
ON CONFLICT DO NOTHING;

-- Add options for the third question (Constructor)
INSERT INTO options (question_id, text, is_correct) VALUES 
  (
    (SELECT id FROM questions WHERE title = 'What is the purpose of a constructor in OOP?'),
    'To destroy objects',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the purpose of a constructor in OOP?'),
    'To initialize objects',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the purpose of a constructor in OOP?'),
    'To hide data',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is the purpose of a constructor in OOP?'),
    'To create classes',
    false
  )
ON CONFLICT DO NOTHING;

-- Add options for the fourth question (Sorting)
INSERT INTO options (question_id, text, is_correct) VALUES 
  (
    (SELECT id FROM questions WHERE title = 'Which sorting algorithm has O(n log n) average time complexity?'),
    'Bubble Sort',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which sorting algorithm has O(n log n) average time complexity?'),
    'Merge Sort',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which sorting algorithm has O(n log n) average time complexity?'),
    'Selection Sort',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which sorting algorithm has O(n log n) average time complexity?'),
    'Insertion Sort',
    false
  )
ON CONFLICT DO NOTHING;

-- Add options for the fifth question (Encapsulation)
INSERT INTO options (question_id, text, is_correct) VALUES 
  (
    (SELECT id FROM questions WHERE title = 'What is encapsulation in OOP?'),
    'Bundling data and methods together',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is encapsulation in OOP?'),
    'Creating multiple objects',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is encapsulation in OOP?'),
    'Inheriting from parent classes',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is encapsulation in OOP?'),
    'Overriding methods',
    false
  )
ON CONFLICT DO NOTHING;

-- Now create a sample test
INSERT INTO tests (subject_id, title, duration_minutes, shuffle) VALUES 
  (
    (SELECT id FROM subjects WHERE key = 'cs'),
    'CS Fundamentals Test',
    60,
    true
  )
ON CONFLICT DO NOTHING;

-- Add questions to the test
INSERT INTO test_questions (test_id, question_id, position) VALUES 
  (
    (SELECT id FROM tests WHERE title = 'CS Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'What is the time complexity of binary search?'),
    1
  ),
  (
    (SELECT id FROM tests WHERE title = 'CS Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'Which data structure follows LIFO principle?'),
    2
  ),
  (
    (SELECT id FROM tests WHERE title = 'CS Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'What is the purpose of a constructor in OOP?'),
    3
  ),
  (
    (SELECT id FROM tests WHERE title = 'CS Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'Which sorting algorithm has O(n log n) average time complexity?'),
    4
  ),
  (
    (SELECT id FROM tests WHERE title = 'CS Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'What is encapsulation in OOP?'),
    5
  )
ON CONFLICT DO NOTHING;

-- Add some AI questions
INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
  (
    (SELECT id FROM subjects WHERE key = 'ai'),
    'What is machine learning?',
    'Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.',
    'Machine Learning',
    1
  ),
  (
    (SELECT id FROM subjects WHERE key = 'ai'),
    'Which algorithm is used for classification in supervised learning?',
    'This algorithm creates a decision tree to classify data points based on their features.',
    'Machine Learning',
    2
  )
ON CONFLICT DO NOTHING;

-- Add options for AI questions
INSERT INTO options (question_id, text, is_correct) VALUES 
  -- Machine Learning question
  (
    (SELECT id FROM questions WHERE title = 'What is machine learning?'),
    'A subset of AI that enables computers to learn from experience',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is machine learning?'),
    'A type of database system',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is machine learning?'),
    'A programming language',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'What is machine learning?'),
    'A hardware component',
    false
  ),
  -- Classification algorithm question
  (
    (SELECT id FROM questions WHERE title = 'Which algorithm is used for classification in supervised learning?'),
    'Decision Tree',
    true
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which algorithm is used for classification in supervised learning?'),
    'Linear Regression',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which algorithm is used for classification in supervised learning?'),
    'K-means',
    false
  ),
  (
    (SELECT id FROM questions WHERE title = 'Which algorithm is used for classification in supervised learning?'),
    'Random Forest',
    false
  )
ON CONFLICT DO NOTHING;

-- Create an AI test
INSERT INTO tests (subject_id, title, duration_minutes, shuffle) VALUES 
  (
    (SELECT id FROM subjects WHERE key = 'ai'),
    'AI Fundamentals Test',
    45,
    true
  )
ON CONFLICT DO NOTHING;

-- Add AI questions to the test
INSERT INTO test_questions (test_id, question_id, position) VALUES 
  (
    (SELECT id FROM tests WHERE title = 'AI Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'What is machine learning?'),
    1
  ),
  (
    (SELECT id FROM tests WHERE title = 'AI Fundamentals Test'),
    (SELECT id FROM questions WHERE title = 'Which algorithm is used for classification in supervised learning?'),
    2
  )
ON CONFLICT DO NOTHING;
