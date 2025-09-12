'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Clock, Trophy, Target, XCircle, Eye } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Attempt = Database['public']['Tables']['attempts']['Row'] & {
  test?: Database['public']['Tables']['tests']['Row'] & {
    subject?: Database['public']['Tables']['subjects']['Row']
  }
}

export default function UserAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchAttempts = async () => {
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
          .eq('user_id', 'demo-user') // In real app, get from auth
          .order('submitted_at', { ascending: false })

        if (error) {
          console.error('Error fetching attempts:', error)
          // Demo data
          setAttempts([
            {
              id: '1',
              user_id: 'demo-user',
              test_id: '1',
              started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
              submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(), // 45 minutes later
              score: 85,
              total_marks: 25,
              summary: { correct: 21, total: 25, percentage: 85 },
              result_json: null,
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
            },
            {
              id: '2',
              user_id: 'demo-user',
              test_id: '2',
              started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
              submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(), // 75 minutes later
              score: 72,
              total_marks: 40,
              summary: { correct: 29, total: 40, percentage: 72 },
              result_json: null,
              created_at: new Date().toISOString(),
              test: {
                id: '2',
                subject_id: '1',
                title: 'Advanced Programming Concepts',
                duration_minutes: 90,
                shuffle: false,
                created_at: new Date().toISOString(),
                subject: {
                  id: '1',
                  name: 'Computer Science',
                  key: 'cs',
                  created_at: new Date().toISOString()
                }
              }
            },
            {
              id: '3',
              user_id: 'demo-user',
              test_id: '3',
              started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
              submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(), // 50 minutes later
              score: 68,
              total_marks: 30,
              summary: { correct: 20, total: 30, percentage: 68 },
              result_json: null,
              created_at: new Date().toISOString(),
              test: {
                id: '3',
                subject_id: '2',
                title: 'AI Fundamentals',
                duration_minutes: 60,
                shuffle: true,
                created_at: new Date().toISOString(),
                subject: {
                  id: '2',
                  name: 'Artificial Intelligence',
                  key: 'ai',
                  created_at: new Date().toISOString()
                }
              }
            }
          ])
        } else {
          setAttempts(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
        // Demo data
        setAttempts([
          {
            id: '1',
            user_id: 'demo-user',
            test_id: '1',
            started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            submitted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
            score: 85,
            total_marks: 25,
            summary: { correct: 21, total: 25, percentage: 85 },
            result_json: null,
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
          },
          {
            id: '2',
            user_id: 'demo-user',
            test_id: '2',
            started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(),
            score: 72,
            total_marks: 40,
            summary: { correct: 29, total: 40, percentage: 72 },
            result_json: null,
            created_at: new Date().toISOString(),
            test: {
              id: '2',
              subject_id: '1',
              title: 'Advanced Programming Concepts',
              duration_minutes: 90,
              shuffle: false,
              created_at: new Date().toISOString(),
              subject: {
                id: '1',
                name: 'Computer Science',
                key: 'cs',
                created_at: new Date().toISOString()
              }
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAttempts()
  }, [supabase])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-5 w-5 text-green-600" />
    if (score >= 60) return <Target className="h-5 w-5 text-yellow-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateTimeTaken = (startedAt: string, submittedAt: string) => {
    const start = new Date(startedAt)
    const end = new Date(submittedAt)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / (1000 * 60))
    return diffMins
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Attempts</h1>
          <p className="text-gray-600">
            View your test history and track your progress over time
          </p>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No attempts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't taken any tests yet. Start by choosing a subject and test.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Browse Tests
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {attempts.map((attempt) => (
              <div key={attempt.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {attempt.test?.title}
                      </h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {attempt.test?.subject?.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(attempt.submitted_at || attempt.started_at)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {calculateTimeTaken(attempt.started_at, attempt.submitted_at || new Date().toISOString())} minutes
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500">
                          {attempt.summary?.total || attempt.total_marks} questions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {getScoreIcon(attempt.score || 0)}
                        <span className={`ml-2 text-2xl font-bold ${getScoreColor(attempt.score || 0)}`}>
                          {Math.round(attempt.score || 0)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {attempt.summary?.correct || 0} out of {attempt.summary?.total || attempt.total_marks} correct
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => router.push(`/results/${attempt.id}`)}
                      className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance Summary */}
        {attempts.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {attempts.length}
                </div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(attempts.reduce((acc, attempt) => acc + (attempt.score || 0), 0) / attempts.length)}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {Math.round(attempts.reduce((acc, attempt) => {
                    const timeTaken = calculateTimeTaken(attempt.started_at, attempt.submitted_at || new Date().toISOString())
                    return acc + timeTaken
                  }, 0) / attempts.length)}m
                </div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {attempts.filter(attempt => (attempt.score || 0) >= 80).length}
                </div>
                <div className="text-sm text-gray-600">High Scores (80%+)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
