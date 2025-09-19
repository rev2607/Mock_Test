-- Simple Database Setup - Run this first
-- This creates the basic table structure

-- 1. Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create options table
CREATE TABLE IF NOT EXISTS options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  shuffle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create test_questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create attempts table
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

-- 7. Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  selected_option_ids INTEGER[],
  correct BOOLEAN,
  marks_awarded DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- 9. Create basic policies
CREATE POLICY "Enable read access for all users" ON subjects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON options FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON test_questions FOR SELECT USING (true);

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

-- 10. Insert basic subjects
-- Subjects will be added as needed
