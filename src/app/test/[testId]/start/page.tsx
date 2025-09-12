'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Clock, Play, BookOpen, Users } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Test = Database['public']['Tables']['tests']['Row'] & {
  subject?: Database['public']['Tables']['subjects']['Row']
  question_count?: number
}

export default function StartTestPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.testId as string
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select(`
            *,
            subject:subjects(*),
            test_questions(count)
          `)
          .eq('id', testId)
          .single()

        if (error) {
          console.error('Error fetching test:', error)
          // Demo data
          setTest({
            id: testId,
            subject_id: '1',
            title: 'CS Fundamentals Test',
            duration_minutes: 60,
            shuffle: true,
            created_at: new Date().toISOString(),
            subject: { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() },
            question_count: 25
          })
        } else {
          setTest({
            ...data,
            question_count: data.test_questions?.[0]?.count || 0
          })
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
          subject: { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() },
          question_count: 25
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTest()
  }, [testId, supabase])

  const handleStartTest = () => {
    router.push(`/test/${testId}/run`)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded mt-8"></div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test not found</h1>
        <p className="text-gray-600">The test you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {test.title}
            </h1>
            <p className="text-gray-600">
              {test.subject?.name || 'Subject'} • {test.question_count || 0} Questions
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Duration</h3>
                <p className="text-gray-600">{test.duration_minutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Questions</h3>
                <p className="text-gray-600">
                  {test.question_count || 0} questions • {test.shuffle ? 'Random order' : 'Fixed order'}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Instructions</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions using the progress bar</li>
                  <li>• Make sure to submit before time runs out</li>
                  <li>• You can review your answers before final submission</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Back
            </button>
            <button
              onClick={handleStartTest}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Test
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
