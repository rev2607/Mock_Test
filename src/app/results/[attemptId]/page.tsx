'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { ScoreSummary } from '@/components/ScoreSummary'
import { WeakAreasChart } from '@/components/WeakAreasChart'
import { QuestionReview } from '@/components/QuestionReview'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Attempt = Database['public']['Tables']['attempts']['Row'] & {
  test: Database['public']['Tables']['tests']['Row'] & {
    subject: Database['public']['Tables']['subjects']['Row']
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
          console.error('Error fetching attempt:', error.message)
          setAttempt(null)
        } else {
          setAttempt(data)
        }
      } catch (error) {
        console.error('Error connecting to database:', error)
        setAttempt(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAttempt()
  }, [attemptId, supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!attempt) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Attempt Not Found</h1>
          <p className="text-gray-600 mb-6">The test attempt you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link
            href="/account/attempts"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Attempts
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results</h1>
          <p className="text-gray-600">
            {attempt.test?.title} - {attempt.test?.subject?.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ScoreSummary 
              score={(attempt.summary as any)?.percentage || 0}
              correct={(attempt.summary as any)?.correct || 0}
              total={(attempt.summary as any)?.total || 0}
              timeTaken={attempt.submitted_at 
                ? Math.round((new Date(attempt.submitted_at).getTime() - new Date(attempt.started_at).getTime()) / 60000)
                : 0
              }
              totalTime={attempt.test?.duration_minutes || 0}
            />
            <WeakAreasChart resultData={attempt.result_json || {}} />
            <QuestionReview 
              attemptId={attempt.id}
              resultData={attempt.result_json || {}}
              testTitle={attempt.test?.title || 'Test'}
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Started:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(attempt.started_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Submitted:</span>
                  <span className="font-medium text-gray-900">
                    {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : 'Not submitted'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900 font-medium">Duration:</span>
                  <span className="font-medium text-gray-900">
                    {attempt.submitted_at 
                      ? Math.round((new Date(attempt.submitted_at).getTime() - new Date(attempt.started_at).getTime()) / 60000)
                      : 'N/A'
                    } minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}