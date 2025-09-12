'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { ScoreSummary } from '@/components/ScoreSummary'
import { WeakAreasChart } from '@/components/WeakAreasChart'
import { QuestionReview } from '@/components/QuestionReview'
import { Trophy, Target, Clock, CheckCircle, XCircle } from 'lucide-react'

type Attempt = Database['public']['Tables']['attempts']['Row'] & {
  test?: Database['public']['Tables']['tests']['Row'] & {
    subject?: Database['public']['Tables']['subjects']['Row']
  }
}

export default function ResultsPage() {
  const params = useParams()
  const attemptId = params.attemptId as string
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const { data, error } = await supabase
          .from('attempts')
          .select(`
            *,
            test:tests(
              *,
              subject:subjects(*)
            )
          `)
          .eq('id', attemptId)
          .single()

        if (error) {
          console.error('Error fetching attempt:', error)
          // Demo data
          setAttempt({
            id: attemptId,
            user_id: 'demo-user',
            test_id: '1',
            started_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
            submitted_at: new Date().toISOString(),
            score: 75,
            total_marks: 25,
            summary: {
              correct: 19,
              total: 25,
              percentage: 75
            },
            result_json: {
              answers: {
                '1': [2],
                '2': [6],
                '3': [9],
                '4': [12],
                '5': [15]
              },
              questions: [
                { id: '1', topic: 'Algorithms', difficulty: 2, correct: true },
                { id: '2', topic: 'Data Structures', difficulty: 1, correct: true },
                { id: '3', topic: 'Algorithms', difficulty: 3, correct: false },
                { id: '4', topic: 'Data Structures', difficulty: 2, correct: true },
                { id: '5', topic: 'Algorithms', difficulty: 1, correct: false }
              ]
            },
            created_at: new Date().toISOString(),
            test: {
              id: '1',
              subject_id: '1',
              title: 'CS Fundamentals Test',
              duration_minutes: 60,
              shuffle: true,
              created_at: new Date().toISOString(),
              subject: {
                id: '1',
                name: 'Computer Science',
                key: 'cs',
                created_at: new Date().toISOString()
              }
            }
          })
        } else {
          setAttempt(data)
        }
      } catch (error) {
        console.error('Error:', error)
        // Demo data
        setAttempt({
          id: attemptId,
          user_id: 'demo-user',
          test_id: '1',
          started_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          submitted_at: new Date().toISOString(),
          score: 75,
          total_marks: 25,
          summary: {
            correct: 19,
            total: 25,
            percentage: 75
          },
          result_json: {
            answers: {
              '1': [2],
              '2': [6],
              '3': [9],
              '4': [12],
              '5': [15]
            },
            questions: [
              { id: '1', topic: 'Algorithms', difficulty: 2, correct: true },
              { id: '2', topic: 'Data Structures', difficulty: 1, correct: true },
              { id: '3', topic: 'Algorithms', difficulty: 3, correct: false },
              { id: '4', topic: 'Data Structures', difficulty: 2, correct: true },
              { id: '5', topic: 'Algorithms', difficulty: 1, correct: false }
            ]
          },
          created_at: new Date().toISOString(),
          test: {
            id: '1',
            subject_id: '1',
            title: 'CS Fundamentals Test',
            duration_minutes: 60,
            shuffle: true,
            created_at: new Date().toISOString(),
            subject: {
              id: '1',
              name: 'Computer Science',
              key: 'cs',
              created_at: new Date().toISOString()
            }
          }
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAttempt()
  }, [attemptId, supabase])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Results not found</h1>
        <p className="text-gray-600">The test results you're looking for don't exist.</p>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-8 w-8 text-green-600" />
    if (score >= 60) return <Target className="h-8 w-8 text-yellow-600" />
    return <XCircle className="h-8 w-8 text-red-600" />
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Test Results
        </h1>
        <p className="text-gray-600">
          {attempt.test?.title} • {attempt.test?.subject?.name}
        </p>
      </div>

      {/* Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            {getScoreIcon(attempt.score || 0)}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
          <div className={`text-4xl font-bold ${getScoreColor(attempt.score || 0)}`}>
            {Math.round(attempt.score || 0)}%
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {attempt.summary?.correct || 0} out of {attempt.summary?.total || 0} correct
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Correct Answers</h3>
          <div className="text-4xl font-bold text-green-600">
            {attempt.summary?.correct || 0}
          </div>
          <p className="text-gray-600 text-sm mt-2">
            {attempt.summary?.total ? Math.round(((attempt.summary.correct / attempt.summary.total) * 100)) : 0}% accuracy
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Taken</h3>
          <div className="text-4xl font-bold text-blue-600">
            {attempt.started_at && attempt.submitted_at ? 
              Math.round((new Date(attempt.submitted_at).getTime() - new Date(attempt.started_at).getTime()) / (1000 * 60)) : 0
            }m
          </div>
          <p className="text-gray-600 text-sm mt-2">
            out of {attempt.test?.duration_minutes || 0} minutes
          </p>
        </div>
      </div>

      {/* Weak Areas Chart */}
      <div className="mb-8">
        <WeakAreasChart resultData={attempt.result_json} />
      </div>

      {/* Question Review */}
      <div className="mb-8">
        <QuestionReview 
          attemptId={attemptId}
          resultData={attempt.result_json}
          testTitle={attempt.test?.title || ''}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to Tests
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Take Another Test
        </button>
      </div>
    </div>
  )
}
