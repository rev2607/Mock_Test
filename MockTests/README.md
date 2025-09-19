# Mock Test Platform

A comprehensive web application for conducting mock tests with detailed analytics and performance tracking. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

### Student Features
- **Subject Selection**: Choose from Computer Science, Artificial Intelligence, and Electronics & Communication
- **Test Taking**: Interactive test interface with timer, progress tracking, and question navigation
- **Results Analysis**: Detailed performance breakdown with weak areas identification
- **Attempt History**: View all past test attempts with performance trends
- **Real-time Analytics**: Visual charts showing performance by topic and difficulty

### Admin Features
- **Question Management**: Create, edit, and manage test questions with multiple choice options
- **Test Configuration**: Set up tests with custom duration, question order, and subject assignment
- **Results Dashboard**: Comprehensive view of all student attempts with filtering and export capabilities
- **Performance Analytics**: Track student performance across different subjects and topics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: Custom components with Lucide React icons
- **Charts**: Recharts for data visualization
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StudentHub_Mock_Test
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up the database schema in Supabase:
```sql
-- Create subjects table
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 3),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create options table
CREATE TABLE options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tests table
CREATE TABLE tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  shuffle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test_questions table
CREATE TABLE test_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attempts table
CREATE TABLE attempts (
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
CREATE TABLE answers (
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

-- Create policies (adjust based on your requirements)
CREATE POLICY "Enable read access for all users" ON subjects FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON options FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON test_questions FOR SELECT USING (true);

-- Insert sample data
INSERT INTO subjects (name, key) VALUES 
  ('Computer Science', 'cs'),
  ('Artificial Intelligence', 'ai'),
  ('Electronics & Communication', 'ece');
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   │   ├── questions/     # Question management
│   │   ├── tests/         # Test management
│   │   └── attempts/      # Results dashboard
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── test/              # Test taking pages
│   │   └── [testId]/      # Dynamic test routes
│   ├── results/           # Results pages
│   ├── account/           # User account pages
│   └── tests/             # Test listing pages
├── components/            # Reusable UI components
│   ├── SubjectList.tsx    # Subject selection component
│   ├── TestList.tsx       # Test listing component
│   ├── ScoreSummary.tsx   # Score display component
│   ├── WeakAreasChart.tsx # Performance analytics
│   ├── QuestionReview.tsx # Question review component
│   └── Navbar.tsx         # Navigation component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
└── lib/                   # Utility functions
    ├── supabase.ts        # Supabase client
    ├── supabase-client.ts # Browser client
    └── database.types.ts  # TypeScript types
```

## Key Features Explained

### Test Taking Experience
- **Timer**: Real-time countdown with automatic submission
- **Progress Tracking**: Visual progress bar and question navigation
- **Question Navigation**: Easy movement between questions with answer status indicators
- **Auto-save**: Answers are saved as you progress through the test

### Results & Analytics
- **Score Breakdown**: Overall score with correct/incorrect question counts
- **Topic Analysis**: Performance breakdown by subject topics
- **Visual Charts**: Interactive charts showing weak areas and strengths
- **Question Review**: Detailed review of each question with correct answers

### Admin Dashboard
- **Question Management**: Full CRUD operations for questions and options
- **Test Configuration**: Create tests with custom settings
- **Results Export**: CSV export functionality for data analysis
- **Performance Metrics**: Comprehensive analytics dashboard

## Authentication

The application uses Supabase Auth with role-based access control:
- **Students**: Can take tests, view results, and access their attempt history
- **Admins**: Full access to question management, test configuration, and results dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@mocktestplatform.com or create an issue in the repository.
