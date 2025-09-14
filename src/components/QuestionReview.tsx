'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { CheckCircle, XCircle, Circle } from 'lucide-react'

type Question = Database['public']['Tables']['questions']['Row'] & {
  options: Database['public']['Tables']['options']['Row'][]
}

interface QuestionReviewProps {
  attemptId: string
  resultData: any
  testTitle: string
}

export function QuestionReview({ attemptId, resultData, testTitle }: QuestionReviewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Fetch actual questions from the database based on the attempt
        const { data: attemptData, error: attemptError } = await supabase
          .from('attempts')
          .select(`
            *,
            test:tests(
              *,
              test_questions(
                question:questions(
                  *,
                  options(*)
                )
              )
            )
          `)
          .eq('id', attemptId)
          .single()

        if (attemptError) {
          console.error('Error fetching attempt:', attemptError)
          setQuestions([])
          return
        }

        if (attemptData?.test?.test_questions) {
          const questionsList = attemptData.test.test_questions
            .map((tq: any) => tq.question)
            .filter(Boolean) as Question[]
          setQuestions(questionsList)
        } else {
          // Fallback to demo data if no questions found
          const demoQuestions: Question[] = [
            {
              id: '1',
              subject_id: '1',
              title: 'What is the time complexity of binary search?',
              body: 'Binary search is an efficient algorithm for finding an item from a sorted list of items.',
              topic: 'Algorithms',
              difficulty: 2,
              created_at: new Date().toISOString(),
              options: [
                { id: '1', question_id: '1', text: 'O(n)', is_correct: false, created_at: new Date().toISOString() },
                { id: '2', question_id: '1', text: 'O(log n)', is_correct: true, created_at: new Date().toISOString() },
                { id: '3', question_id: '1', text: 'O(n²)', is_correct: false, created_at: new Date().toISOString() },
                { id: '4', question_id: '1', text: 'O(1)', is_correct: false, created_at: new Date().toISOString() }
              ]
            },
            {
              id: '2',
              subject_id: '1',
              title: 'Which data structure follows LIFO principle?',
              body: 'LIFO stands for Last In, First Out.',
              topic: 'Data Structures',
              difficulty: 1,
              created_at: new Date().toISOString(),
              options: [
                { id: '5', question_id: '2', text: 'Queue', is_correct: false, created_at: new Date().toISOString() },
                { id: '6', question_id: '2', text: 'Stack', is_correct: true, created_at: new Date().toISOString() },
                { id: '7', question_id: '2', text: 'Array', is_correct: false, created_at: new Date().toISOString() },
                { id: '8', question_id: '2', text: 'Linked List', is_correct: false, created_at: new Date().toISOString() }
              ]
            },
            {
              id: '3',
              subject_id: '1',
              title: 'What is the space complexity of merge sort?',
              body: 'Merge sort is a divide and conquer algorithm.',
              topic: 'Algorithms',
              difficulty: 3,
              created_at: new Date().toISOString(),
              options: [
                { id: '9', question_id: '3', text: 'O(1)', is_correct: false, created_at: new Date().toISOString() },
                { id: '10', question_id: '3', text: 'O(log n)', is_correct: false, created_at: new Date().toISOString() },
                { id: '11', question_id: '3', text: 'O(n)', is_correct: true, created_at: new Date().toISOString() },
                { id: '12', question_id: '3', text: 'O(n²)', is_correct: false, created_at: new Date().toISOString() }
              ]
            }
          ]
          setQuestions(demoQuestions)
        }
      } catch (error) {
        console.error('Error fetching questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [attemptId, resultData, supabase])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Review</h3>
        <div className="text-center text-gray-500 py-8">
          No questions available for review
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const userAnswers = resultData?.answers?.[currentQuestion.id] || []
  const isCorrect = resultData?.questions?.find((q: any) => q.id === currentQuestion.id)?.correct || false

  // Debug logging
  console.log('QuestionReview Debug:', {
    currentQuestionId: currentQuestion?.id,
    userAnswers,
    resultDataAnswers: resultData?.answers,
    isCorrect
  })

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-green-100 text-green-800'
    if (difficulty <= 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 1) return 'Easy'
    if (difficulty <= 2) return 'Medium'
    return 'Hard'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex space-x-1">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : resultData?.questions?.[index]?.correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-gray-900">
            Question {currentQuestionIndex + 1}
          </h4>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {getDifficultyText(currentQuestion.difficulty)}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {currentQuestion.topic}
            </span>
          </div>
        </div>
        
        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {currentQuestion.body}
        </p>

        <div className="space-y-3">
          {currentQuestion.options.map((option, optionIndex) => {
            const isSelected = userAnswers.includes(optionIndex)
            const isCorrectOption = option.is_correct
            
            return (
              <div
                key={option.id}
                className={`p-4 border rounded-lg ${
                  isCorrectOption
                    ? 'border-green-500 bg-green-50'
                    : isSelected && !isCorrectOption
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {isCorrectOption ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isSelected && !isCorrectOption ? (
                      <XCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-gray-700 ${
                    isCorrectOption ? 'font-semibold' : ''
                  }`}>
                    {option.text}
                  </span>
                  <div className="ml-auto flex items-center space-x-2">
                    {isCorrectOption && (
                      <span className="text-sm font-medium text-green-600">
                        Correct Answer
                      </span>
                    )}
                    {isSelected && !isCorrectOption && (
                      <span className="text-sm font-medium text-red-600">
                        Your Answer
                      </span>
                    )}
                    {isSelected && isCorrectOption && (
                      <span className="text-sm font-medium text-green-600">
                        Your Answer ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Correct</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-600 font-medium">Incorrect</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
