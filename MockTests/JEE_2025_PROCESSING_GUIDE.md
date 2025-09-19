# JEE Mains 2025 Question Processing Guide

This guide will help you extract questions from the JEE Mains 2025 PDF and insert them into your database while preserving mathematical notation and diagrams.

## Prerequisites

1. **Python Environment**: Make sure you have Python 3.6+ installed
2. **Dependencies**: Install required packages
3. **Database Access**: Access to your Supabase database

## Step 1: Install Dependencies

```bash
pip install -r requirements.txt
```

## Step 2: Extract Questions from PDF

### Option A: Automated Extraction (Recommended)

Run the Python script to extract questions:

```bash
python extract_jee_questions.py
```

This will create three files:
- `extracted_text.txt`: Raw text from PDF
- `extracted_questions.json`: Structured question data
- `jee_mains_2025_questions.sql`: SQL insert statements

### Option B: Manual Extraction

If automated extraction doesn't work well:

1. Open the PDF in a text editor or PDF viewer
2. Copy questions one by one
3. Follow the formatting guidelines below

## Step 3: Format Questions for Database

### Mathematical Notation Guidelines

Use these Unicode characters for mathematical symbols:

| Symbol | Unicode | Character | Usage |
|--------|---------|-----------|-------|
| Square root | U+221A | √ | √(x² + y²) |
| Pi | U+03C0 | π | 2πr |
| Alpha | U+03B1 | α | α + β = 90° |
| Beta | U+03B2 | β | sin(α + β) |
| Gamma | U+03B3 | γ | γ-rays |
| Delta | U+0394 | Δ | Δx = x₂ - x₁ |
| Theta | U+03B8 | θ | cos θ |
| Lambda | U+03BB | λ | λ = c/f |
| Mu | U+03BC | μ | μ = F/N |
| Sigma | U+03C3 | σ | σ = E/A |
| Phi | U+03C6 | φ | φ = B·A |
| Omega | U+03C9 | ω | ω = 2πf |
| Infinity | U+221E | ∞ | lim x→∞ |
| Less than or equal | U+2264 | ≤ | x ≤ 5 |
| Greater than or equal | U+2265 | ≥ | x ≥ 3 |
| Not equal | U+2260 | ≠ | x ≠ 0 |
| Approximately equal | U+2248 | ≈ | π ≈ 3.14 |
| Plus minus | U+00B1 | ± | x = 2 ± 1 |
| Summation | U+2211 | ∑ | ∑(i=1 to n) |
| Product | U+220F | ∏ | ∏(i=1 to n) |
| Integral | U+222B | ∫ | ∫f(x)dx |
| Partial derivative | U+2202 | ∂ | ∂f/∂x |
| Delta (change) | U+0394 | Δ | ΔT = T₂ - T₁ |
| Angle | U+2220 | ∠ | ∠ABC = 90° |
| Perpendicular | U+22A5 | ⊥ | AB ⊥ CD |
| Parallel | U+2225 | ∥ | AB ∥ CD |
| Degree | U+00B0 | ° | 45° |
| Prime | U+2032 | ′ | f′(x) |
| Double prime | U+2033 | ″ | f″(x) |

### Superscripts and Subscripts

| Number | Superscript | Subscript |
|--------|-------------|-----------|
| 0 | ⁰ | ₀ |
| 1 | ¹ | ₁ |
| 2 | ² | ₂ |
| 3 | ³ | ₃ |
| 4 | ⁴ | ₄ |
| 5 | ⁵ | ₅ |
| 6 | ⁶ | ₆ |
| 7 | ⁷ | ₇ |
| 8 | ⁸ | ₈ |
| 9 | ⁹ | ₉ |

### Example Question Format

```sql
INSERT INTO questions (id, subject_id, title, body, topic, difficulty) VALUES (
    'q1-uuid-here',
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Mathematics - Question 1',
    'If the equation x² + 2x + 3 = 0 has roots α and β, then the value of α² + β² is:
    
    (A) 2
    (B) -2  
    (C) 4
    (D) -4',
    'Algebra',
    2
);
```

## Step 4: Handle Diagrams

For diagrams, describe them in text format:

### Example Diagram Descriptions

1. **Coordinate Geometry**:
   ```
   "A parabola y² = 4ax with vertex at origin, focus at (a,0), and directrix x = -a"
   ```

2. **Physics Diagrams**:
   ```
   "A block of mass m on an inclined plane at angle θ with the horizontal, 
   with friction force f acting up the plane and normal force N perpendicular to the plane"
   ```

3. **Chemistry Structures**:
   ```
   "Benzene ring (C₆H₆) with alternating single and double bonds, 
   showing resonance structure"
   ```

## Step 5: Database Insertion

### Get Subject ID

First, ensure you have the JEE Mains subject in your database:

```sql
INSERT INTO subjects (id, name, key) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025',
    'jee-mains-2025'
) ON CONFLICT (key) DO NOTHING;
```

### Insert Questions

Use the template in `jee_mains_2025_template.sql` and replace the sample questions with actual ones from the PDF.

### Generate UUIDs

For each question and option, generate a unique UUID:

```sql
-- Use this function in Supabase
SELECT gen_random_uuid();
```

## Step 6: Quality Assurance

### Checklist

- [ ] All mathematical symbols are properly formatted
- [ ] Diagrams are described accurately
- [ ] All answer options are included
- [ ] Correct answers are marked
- [ ] Topics are assigned correctly
- [ ] Difficulty levels are appropriate
- [ ] All UUIDs are unique

### Testing

After insertion, test a few questions:

```sql
-- Test question retrieval
SELECT q.title, q.body, o.text, o.is_correct 
FROM questions q 
JOIN options o ON q.id = o.question_id 
WHERE q.subject_id = '550e8400-e29b-41d4-a716-446655440000' 
LIMIT 5;
```

## Step 7: Create Test

Create a test that includes all the questions:

```sql
INSERT INTO tests (id, subject_id, title, duration_minutes, shuffle) VALUES (
    'test-uuid-here',
    '550e8400-e29b-41d4-a716-446655440000',
    'JEE Mains 2025 - Full Paper',
    180,  -- 3 hours
    true
);
```

## Troubleshooting

### Common Issues

1. **PDF Text Extraction Issues**:
   - Try different PDF viewers
   - Use OCR tools for scanned PDFs
   - Manually type complex mathematical expressions

2. **Mathematical Symbol Issues**:
   - Use Unicode character map
   - Copy symbols from this guide
   - Test display in your application

3. **Database Insertion Errors**:
   - Check UUID format
   - Verify foreign key constraints
   - Check text encoding (UTF-8)

### Support

If you encounter issues:
1. Check the extracted text files
2. Verify database schema matches
3. Test with a small subset of questions first
4. Check Supabase logs for errors

## File Structure

```
/Users/revanthguthula/Desktop/StudentHub_Mock_Test/
├── question_answers.pdf              # Original PDF
├── extract_jee_questions.py          # Extraction script
├── requirements.txt                  # Python dependencies
├── jee_mains_2025_template.sql       # SQL template
├── JEE_2025_PROCESSING_GUIDE.md      # This guide
├── extracted_text.txt                # Generated: Raw text
├── extracted_questions.json          # Generated: Structured data
└── jee_mains_2025_questions.sql      # Generated: SQL statements
```

## Next Steps

1. Run the extraction script
2. Review and edit the generated files
3. Insert questions into database
4. Test the questions in your application
5. Create additional tests as needed

Remember to preserve the exact mathematical notation and diagrams from the original PDF to maintain the integrity of the JEE Mains 2025 question paper.
