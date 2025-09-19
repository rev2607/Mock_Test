#!/bin/bash

# JEE Mains 2025 Setup Script
# This script helps set up the environment for processing JEE Mains 2025 questions

echo "🚀 Setting up JEE Mains 2025 Question Processing..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.6+ first."
    exit 1
fi

echo "✅ Python 3 found"

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if PDF file exists
if [ ! -f "question_answers.pdf" ]; then
    echo "❌ question_answers.pdf not found in current directory"
    echo "Please ensure the PDF file is in the project root directory"
    exit 1
fi

echo "✅ PDF file found"

# Run the extraction script
echo "🔍 Extracting questions from PDF..."
python3 extract_jee_questions.py

if [ $? -eq 0 ]; then
    echo "✅ Question extraction completed"
    echo ""
    echo "📁 Generated files:"
    echo "   - extracted_text.txt: Raw text from PDF"
    echo "   - extracted_questions.json: Structured question data"
    echo "   - jee_mains_2025_questions.sql: SQL insert statements"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Review the generated files"
    echo "   2. Edit jee_mains_2025_questions.sql with actual questions"
    echo "   3. Run the SQL script in your Supabase database"
    echo "   4. Test the questions in your application"
    echo ""
    echo "📚 For detailed instructions, see JEE_2025_PROCESSING_GUIDE.md"
else
    echo "❌ Question extraction failed"
    echo "Please check the error messages above and try manual extraction"
fi
