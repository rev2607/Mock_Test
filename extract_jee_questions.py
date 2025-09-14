#!/usr/bin/env python3
"""
JEE Mains 2025 Question Extractor
This script helps extract questions from the PDF and format them for database insertion.
"""

import PyPDF2
import re
import json
from typing import List, Dict, Any
import uuid

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file."""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def clean_text(text: str) -> str:
    """Clean and format extracted text."""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Preserve line breaks for formatting
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()

def extract_questions_from_text(text: str) -> List[Dict[str, Any]]:
    """Extract questions from the text content."""
    questions = []
    
    # Common JEE question patterns
    question_patterns = [
        r'Q\.?\s*(\d+)[\.\)]\s*(.*?)(?=Q\.?\s*\d+|\Z)',
        r'Question\s*(\d+)[\.\)]\s*(.*?)(?=Question\s*\d+|\Z)',
        r'(\d+)[\.\)]\s*(.*?)(?=\d+[\.\)]|\Z)'
    ]
    
    for pattern in question_patterns:
        matches = re.finditer(pattern, text, re.DOTALL | re.IGNORECASE)
        for match in matches:
            question_num = match.group(1)
            question_content = match.group(2).strip()
            
            if len(question_content) > 50:  # Filter out very short matches
                questions.append({
                    'number': question_num,
                    'content': question_content,
                    'subject': 'Unknown',  # Will need manual classification
                    'topic': 'Unknown',
                    'difficulty': 2  # Default medium difficulty
                })
    
    return questions

def format_math_equations(text: str) -> str:
    """Format mathematical equations for better display."""
    # Convert common math symbols
    replacements = {
        '×': '×',
        '÷': '÷',
        '√': '√',
        'π': 'π',
        'α': 'α',
        'β': 'β',
        'γ': 'γ',
        'δ': 'δ',
        'ε': 'ε',
        'θ': 'θ',
        'λ': 'λ',
        'μ': 'μ',
        'σ': 'σ',
        'φ': 'φ',
        'ω': 'ω',
        '∞': '∞',
        '≤': '≤',
        '≥': '≥',
        '≠': '≠',
        '≈': '≈',
        '±': '±',
        '∑': '∑',
        '∏': '∏',
        '∫': '∫',
        '∂': '∂',
        '∆': '∆',
        '→': '→',
        '←': '←',
        '↑': '↑',
        '↓': '↓',
        '↔': '↔',
        '∈': '∈',
        '∉': '∉',
        '⊂': '⊂',
        '⊃': '⊃',
        '∪': '∪',
        '∩': '∩',
        '∅': '∅',
        '∀': '∀',
        '∃': '∃',
        '∴': '∴',
        '∵': '∵',
        '∠': '∠',
        '⊥': '⊥',
        '∥': '∥',
        '°': '°',
        '′': '′',
        '″': '″',
        '‴': '‴',
        '⁰': '⁰',
        '¹': '¹',
        '²': '²',
        '³': '³',
        '⁴': '⁴',
        '⁵': '⁵',
        '⁶': '⁶',
        '⁷': '⁷',
        '⁸': '⁸',
        '⁹': '⁹',
        '⁻': '⁻',
        '⁺': '⁺',
        '⁽': '⁽',
        '⁾': '⁾',
        '₀': '₀',
        '₁': '₁',
        '₂': '₂',
        '₃': '₃',
        '₄': '₄',
        '₅': '₅',
        '₆': '₆',
        '₇': '₇',
        '₈': '₈',
        '₉': '₉',
        '₋': '₋',
        '₊': '₊',
        '₍': '₍',
        '₎': '₎'
    }
    
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    return text

def generate_sql_insert(questions: List[Dict[str, Any]], subject_id: str) -> str:
    """Generate SQL INSERT statements for questions."""
    sql_statements = []
    
    for i, question in enumerate(questions):
        # Clean and format the question content
        content = format_math_equations(clean_text(question['content']))
        
        # Extract options if present (this is a basic extraction)
        options = extract_options_from_question(content)
        
        # Insert question using gen_random_uuid()
        sql_statements.append(f"""
-- Question {question['number']}
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    gen_random_uuid(),
    '{subject_id}',
    'JEE Mains 2025 - Question {question['number']}',
    {repr(content)},
    '{question['topic']}',
    {question['difficulty']}
);""")
        
        # Insert options using DO block to get question ID
        if options:
            sql_statements.append(f"""
-- Options for Question {question['number']}
DO $$
DECLARE
    q_id UUID;
BEGIN
    -- Get the question ID we just inserted
    SELECT id INTO q_id FROM questions WHERE title = 'JEE Mains 2025 - Question {question['number']}' LIMIT 1;
    
    -- Insert options""")
            
            for j, option in enumerate(options):
                sql_statements.append(f"""
    INSERT INTO options (id, question_id, text, is_correct) VALUES (
        gen_random_uuid(), q_id, {repr(option['text'])}, {str(option['is_correct']).lower()}
    );""")
            
            sql_statements.append("""
END $$;""")
    
    return '\n'.join(sql_statements)

def extract_options_from_question(content: str) -> List[Dict[str, Any]]:
    """Extract answer options from question content."""
    options = []
    
    # Common option patterns
    option_patterns = [
        r'\([A-D]\)\s*([^\(]+?)(?=\([A-D]\)|\Z)',
        r'[A-D][\.\)]\s*([^A-D]+?)(?=[A-D][\.\)]|\Z)',
        r'Option\s*[A-D][\.\)]\s*([^O]+?)(?=Option\s*[A-D]|\Z)'
    ]
    
    for pattern in option_patterns:
        matches = re.finditer(pattern, content, re.DOTALL | re.IGNORECASE)
        for i, match in enumerate(matches):
            option_text = match.group(1).strip()
            if option_text and len(option_text) > 5:
                options.append({
                    'text': option_text,
                    'is_correct': False  # Will need manual verification
                })
    
    return options

def main():
    """Main function to process the PDF."""
    pdf_path = "question_answers.pdf"
    
    print("Extracting text from PDF...")
    text = extract_text_from_pdf(pdf_path)
    
    if not text:
        print("Could not extract text from PDF. Please check the file path and format.")
        return
    
    print("Processing questions...")
    questions = extract_questions_from_text(text)
    
    print(f"Found {len(questions)} potential questions")
    
    # Save raw extracted text for manual review
    with open("extracted_text.txt", "w", encoding="utf-8") as f:
        f.write(text)
    
    # Save questions as JSON for review
    with open("extracted_questions.json", "w", encoding="utf-8") as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    # Generate SQL (you'll need to provide the subject_id)
    subject_id = "YOUR_SUBJECT_ID_HERE"  # Replace with actual subject ID
    sql_content = generate_sql_insert(questions, subject_id)
    
    with open("jee_mains_2025_questions.sql", "w", encoding="utf-8") as f:
        f.write(sql_content)
    
    print("\nFiles created:")
    print("- extracted_text.txt: Raw extracted text")
    print("- extracted_questions.json: Structured question data")
    print("- jee_mains_2025_questions.sql: SQL insert statements")
    print("\nPlease review and edit these files before inserting into the database.")

if __name__ == "__main__":
    main()
