'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Clock, CheckCircle, Circle, ArrowLeft, ArrowRight, Flag } from 'lucide-react'

type Question = Database['public']['Tables']['questions']['Row'] & {
  options: Database['public']['Tables']['options']['Row'][]
}

type Test = Database['public']['Tables']['tests']['Row'] & {
  subject?: Database['public']['Tables']['subjects']['Row']
}

export default function RunTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const [test, setTest] = useState<Test | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: number[] }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        // Fetch test info
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select(`
            *,
            subject:subjects(*)
          `)
          .eq('id', testId)
          .single()

        if (testError) {
          console.error('Error fetching test:', testError)
          // Demo data
          setTest({
            id: testId,
            subject_id: '1',
            title: 'CS Fundamentals Test',
            duration_minutes: 60,
            shuffle: true,
            created_at: new Date().toISOString(),
            subject: { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() }
          })
          setTimeLeft(60 * 60) // 60 minutes in seconds
        } else {
          setTest(testData)
          setTimeLeft(testData.duration_minutes * 60)
        }

        // Fetch questions with options
        const { data: questionsData, error: questionsError } = await supabase
          .from('test_questions')
          .select(`
            question:questions(
              *,
              options(*)
            )
          `)
          .eq('test_id', testId)
          .order('position')

        if (questionsError) {
          console.error('Error fetching questions:', questionsError)
          // Demo data
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
            }
          ]
          setQuestions(demoQuestions)
        } else {
          const questionsList = questionsData?.map(item => item.question).filter(Boolean) as Question[]
          setQuestions(questionsList)
        }
      } catch (error) {
        console.error('Error:', error)
        // Demo data
        setTest({
          id: testId,
          subject_id: '1',
          title: 'CS Fundamentals Test',
          duration_minutes: 60,
          shuffle: true,
          created_at: new Date().toISOString(),
          subject: { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() }
        })
        setTimeLeft(60 * 60)
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
          }
        ]
        setQuestions(demoQuestions)
      } finally {
        setLoading(false)
      }
    }

    fetchTestData()
  }, [testId, supabase])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitTest()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, optionId: number, isMultiple: boolean = false) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || []
      if (isMultiple) {
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter(id => id !== optionId)
          : [...currentAnswers, optionId]
        return { ...prev, [questionId]: newAnswers }
      } else {
        return { ...prev, [questionId]: [optionId] }
      }
    })
  }

  const handleSubmitTest = async () => {
    if (submitting) return
    
    setSubmitting(true)
    try {
      // Calculate score
      let correctAnswers = 0
      const totalQuestions = questions.length
      
      questions.forEach(question => {
        const userAnswers = answers[question.id] || []
        const correctOptions = question.options.filter(opt => opt.is_correct).map(opt => parseInt(opt.id))
        
        if (userAnswers.length === correctOptions.length && 
            userAnswers.every(answer => correctOptions.includes(answer))) {
          correctAnswers++
        }
      })

      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

      // Create attempt record
      const { data: attempt, error: attemptError } = await supabase
        .from('attempts')
        .insert({
          user_id: 'demo-user', // In real app, get from auth
          test_id: testId,
          started_at: new Date().toISOString(),
          submitted_at: new Date().toISOString(),
          score: score,
          total_marks: totalQuestions,
          summary: {
            correct: correctAnswers,
            total: totalQuestions,
            percentage: score
          },
          result_json: {
            answers: answers,
            questions: questions.map(q => ({
              id: q.id,
              topic: q.topic,
              difficulty: q.difficulty,
              correct: answers[q.id] ? 
                q.options.filter(opt => opt.is_correct).map(opt => parseInt(opt.id)).every(correctId => 
                  answers[q.id].includes(correctId)
                ) : false
            }))
          }
        })
        .select()
        .single()

      if (attemptError) {
        console.error('Error creating attempt:', attemptError)
        // For demo, redirect anyway
        router.push(`/results/demo-${Date.now()}`)
      } else {
        router.push(`/results/${attempt.id}`)
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      // For demo, redirect anyway
      router.push(`/results/demo-${Date.now()}`)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredQuestions = Object.keys(answers).length
  const progress = questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!test || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test not found</h1>
        <p className="text-gray-600">The test you're looking for doesn't exist or has no questions.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
            <p className="text-gray-600">{test.subject?.name}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-lg font-semibold text-gray-900 mb-1">
              <Clock className="h-5 w-5 mr-2" />
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestionIndex + 1}
            </h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {currentQuestion?.topic}
            </span>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            {currentQuestion?.body}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion?.options.map((option) => {
            const isSelected = answers[currentQuestion.id]?.includes(parseInt(option.id)) || false
            return (
              <label
                key={option.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={isSelected}
                  onChange={() => handleAnswerChange(currentQuestion.id, parseInt(option.id))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-gray-700">{option.text}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[questions[index].id]?.length > 0
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag className="h-4 w-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
