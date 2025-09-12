-- Mock Test Platform Database Setup
-- Run this script in your Supabase SQL Editor

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create options table
CREATE TABLE IF NOT EXISTS options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  shuffle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attempts table
CREATE TABLE IF NOT EXISTS attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE,
  score DECIMAL(5,2),
  total_marks INTEGER,
  summary JSONB,
  result_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_ids INTEGER[],
  correct BOOLEAN,
  marks_awarded DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON subjects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON options FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON test_questions FOR SELECT USING (true);

-- Create policies for user-specific data
CREATE POLICY "Users can view their own attempts" ON attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own attempts" ON attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attempts" ON attempts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own answers" ON answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid())
);
CREATE POLICY "Users can insert their own answers" ON answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid())
);
CREATE POLICY "Users can update their own answers" ON answers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM attempts WHERE attempts.id = answers.attempt_id AND attempts.user_id = auth.uid())
);

-- Insert sample subjects
INSERT INTO subjects (name, key) VALUES 
  ('Computer Science', 'cs'),
  ('Artificial Intelligence', 'ai'),
  ('Electronics & Communication', 'ece')
ON CONFLICT (key) DO NOTHING;

-- Get subject IDs for reference
DO $$
DECLARE
  cs_id UUID;
  ai_id UUID;
  ece_id UUID;
BEGIN
  SELECT id INTO cs_id FROM subjects WHERE key = 'cs';
  SELECT id INTO ai_id FROM subjects WHERE key = 'ai';
  SELECT id INTO ece_id FROM subjects WHERE key = 'ece';

  -- Insert sample questions for Computer Science
  INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
    (cs_id, 'What is the time complexity of binary search?', 'Binary search is an efficient algorithm for finding an item from a sorted list of items.', 'Algorithms', 2),
    (cs_id, 'Which data structure follows LIFO principle?', 'This data structure allows insertion and deletion of elements from only one end.', 'Data Structures', 1),
    (cs_id, 'What is the purpose of a constructor in OOP?', 'Constructors are special methods that are called when an object is created.', 'Object-Oriented Programming', 1),
    (cs_id, 'Which sorting algorithm has O(n log n) average time complexity?', 'This algorithm divides the array into two halves and recursively sorts them.', 'Algorithms', 2),
    (cs_id, 'What is encapsulation in OOP?', 'This principle involves bundling data and methods that work on that data within one unit.', 'Object-Oriented Programming', 2)
  ON CONFLICT DO NOTHING;

  -- Insert sample questions for Artificial Intelligence
  INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
    (ai_id, 'What is machine learning?', 'A subset of artificial intelligence that enables computers to learn and improve from experience.', 'Machine Learning', 1),
    (ai_id, 'Which algorithm is used for classification in supervised learning?', 'This algorithm creates a decision tree to classify data points.', 'Machine Learning', 2),
    (ai_id, 'What is the purpose of backpropagation in neural networks?', 'This technique is used to train neural networks by adjusting weights.', 'Neural Networks', 3),
    (ai_id, 'What is overfitting in machine learning?', 'A modeling error that occurs when a function is too closely fit to a limited set of data points.', 'Machine Learning', 2),
    (ai_id, 'Which type of learning uses unlabeled data?', 'This type of learning finds hidden patterns in data without explicit supervision.', 'Machine Learning', 2)
  ON CONFLICT DO NOTHING;

  -- Insert sample questions for Electronics & Communication
  INSERT INTO questions (subject_id, title, body, topic, difficulty) VALUES 
    (ece_id, 'What is the unit of frequency?', 'This unit measures the number of cycles per second in a periodic signal.', 'Basic Electronics', 1),
    (ece_id, 'Which modulation technique is used in AM radio?', 'This technique varies the amplitude of the carrier wave with the message signal.', 'Communication Systems', 2),
    (ece_id, 'What is the purpose of a transistor?', 'This semiconductor device can amplify or switch electronic signals.', 'Basic Electronics', 2),
    (ece_id, 'Which type of signal processing is used in digital communication?', 'This involves converting analog signals to digital form for transmission.', 'Signal Processing', 3),
    (ece_id, 'What is the Nyquist theorem?', 'This theorem states the minimum sampling rate needed to reconstruct a signal.', 'Signal Processing', 3)
  ON CONFLICT DO NOTHING;

  -- Get question IDs and insert options
  -- CS Questions
  INSERT INTO options (question_id, text, is_correct) 
  SELECT q.id, o.text, o.is_correct
  FROM questions q
  CROSS JOIN (VALUES 
    ('What is the time complexity of binary search?', 'O(n)', false),
    ('What is the time complexity of binary search?', 'O(log n)', true),
    ('What is the time complexity of binary search?', 'O(n²)', false),
    ('What is the time complexity of binary search?', 'O(1)', false)
  ) AS o(question_title, text, is_correct)
  WHERE q.title = o.question_title
  ON CONFLICT DO NOTHING;

  INSERT INTO options (question_id, text, is_correct) 
  SELECT q.id, o.text, o.is_correct
  FROM questions q
  CROSS JOIN (VALUES 
    ('Which data structure follows LIFO principle?', 'Queue', false),
    ('Which data structure follows LIFO principle?', 'Stack', true),
    ('Which data structure follows LIFO principle?', 'Array', false),
    ('Which data structure follows LIFO principle?', 'Linked List', false)
  ) AS o(question_title, text, is_correct)
  WHERE q.title = o.question_title
  ON CONFLICT DO NOTHING;

  -- AI Questions
  INSERT INTO options (question_id, text, is_correct) 
  SELECT q.id, o.text, o.is_correct
  FROM questions q
  CROSS JOIN (VALUES 
    ('What is machine learning?', 'A subset of AI that enables computers to learn', true),
    ('What is machine learning?', 'A type of database system', false),
    ('What is machine learning?', 'A programming language', false),
    ('What is machine learning?', 'A hardware component', false)
  ) AS o(question_title, text, is_correct)
  WHERE q.title = o.question_title
  ON CONFLICT DO NOTHING;

  -- ECE Questions
  INSERT INTO options (question_id, text, is_correct) 
  SELECT q.id, o.text, o.is_correct
  FROM questions q
  CROSS JOIN (VALUES 
    ('What is the unit of frequency?', 'Hertz (Hz)', true),
    ('What is the unit of frequency?', 'Volts (V)', false),
    ('What is the unit of frequency?', 'Amperes (A)', false),
    ('What is the unit of frequency?', 'Ohms (Ω)', false)
  ) AS o(question_title, text, is_correct)
  WHERE q.title = o.question_title
  ON CONFLICT DO NOTHING;

  -- Create sample tests
  INSERT INTO tests (subject_id, title, duration_minutes, shuffle) VALUES 
    (cs_id, 'CS Fundamentals Test', 60, true),
    (cs_id, 'Advanced Programming Concepts', 90, false),
    (ai_id, 'AI Fundamentals', 45, true),
    (ai_id, 'Machine Learning Basics', 75, false),
    (ece_id, 'Basic Electronics', 50, true),
    (ece_id, 'Communication Systems', 80, false)
  ON CONFLICT DO NOTHING;

  -- Add questions to tests
  INSERT INTO test_questions (test_id, question_id, position)
  SELECT t.id, q.id, ROW_NUMBER() OVER (ORDER BY q.created_at)
  FROM tests t
  JOIN questions q ON q.subject_id = t.subject_id
  WHERE t.title = 'CS Fundamentals Test'
  ON CONFLICT DO NOTHING;

  INSERT INTO test_questions (test_id, question_id, position)
  SELECT t.id, q.id, ROW_NUMBER() OVER (ORDER BY q.created_at)
  FROM tests t
  JOIN questions q ON q.subject_id = t.subject_id
  WHERE t.title = 'AI Fundamentals'
  ON CONFLICT DO NOTHING;

  INSERT INTO test_questions (test_id, question_id, position)
  SELECT t.id, q.id, ROW_NUMBER() OVER (ORDER BY q.created_at)
  FROM tests t
  JOIN questions q ON q.subject_id = t.subject_id
  WHERE t.title = 'Basic Electronics'
  ON CONFLICT DO NOTHING;

END $$;
