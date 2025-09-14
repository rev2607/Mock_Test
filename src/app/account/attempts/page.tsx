'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

type Attempt = Database['public']['Tables']['attempts']['Row'] & {
  test: Database['public']['Tables']['tests']['Row'] & {
    subject: Database['public']['Tables']['subjects']['Row']
  }
}

export default function UserAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { user } = useAuth()

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user) {
        setLoading(false)
        setAttempts([])
        return
      }
      
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
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false })

        if (error) {
          console.error('Error fetching attempts:', error)
          setAttempts([])
        } else {
          setAttempts(data || [])
        }
      } catch (error) {
        console.error('Error connecting to database:', error)
        setAttempts([])
      } finally {
        setLoading(false)
      }
    }

    fetchAttempts()
  }, [supabase, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (attempts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Test Attempts Yet</h1>
          <p className="text-gray-600 mb-6">You haven&apos;t taken any tests yet. Start by selecting a subject and taking a test!</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Subjects
          </Link>
        </div>
      </div>
    )
  }

  const totalAttempts = attempts.length
  const averageScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / totalAttempts
  const averageTime = attempts.reduce((sum, attempt) => {
    if (attempt.submitted_at) {
      const duration = new Date(attempt.submitted_at).getTime() - new Date(attempt.started_at).getTime()
      return sum + duration / 60000 // Convert to minutes
    }
    return sum
  }, 0) / totalAttempts
  const highScores = attempts.filter(attempt => (attempt.score || 0) >= 80).length

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Test Attempts</h1>
          <p className="text-gray-600">View your test history and track your progress over time</p>
        </div>

        <div className="space-y-6">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{attempt.test?.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {attempt.test?.subject?.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(attempt.started_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {attempt.test?.duration_minutes} minutes
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {attempt.test?.duration_minutes} questions
                    </div>
                    <div className="flex items-center">
                      <span className={`font-semibold ${
                        (attempt.score || 0) >= 80 ? 'text-green-600' : 
                        (attempt.score || 0) >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {attempt.score?.toFixed(0)}%
                      </span>
                      <span className="ml-1 text-gray-500">
                        ({(attempt.summary as any)?.correct || 0} out of {(attempt.summary as any)?.total || 0} correct)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Link
                    href={`/results/${attempt.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(averageTime)}m</div>
              <div className="text-sm text-gray-600">Avg. Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{highScores}</div>
              <div className="text-sm text-gray-600">High Scores (80%+)</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}