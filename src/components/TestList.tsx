'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Clock, Play, Users, BookOpen } from 'lucide-react'

type Test = Database['public']['Tables']['tests']['Row'] & {
  subject?: Database['public']['Tables']['subjects']['Row']
  question_count?: number
}

export function TestList({ subjectId }: { subjectId: string }) {
  const [tests, setTests] = useState<Test[]>([])
  const [subject, setSubject] = useState<Database['public']['Tables']['subjects']['Row'] | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch subject info
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('*')
          .eq('id', subjectId)
          .single()

        if (subjectError) {
          console.log('Database not set up, using demo data:', subjectError.message)
          // Fallback for demo
          setSubject({ id: subjectId, name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() })
        } else {
          setSubject(subjectData)
        }

        // Fetch tests with question count
        const { data: testsData, error: testsError } = await supabase
          .from('tests')
          .select(`
            *,
            subject:subjects(*),
            test_questions(count)
          `)
          .eq('subject_id', subjectId)
          .order('created_at', { ascending: false })

        if (testsError) {
          console.log('Database not set up, using demo data:', testsError.message)
          // Demo data
          setTests([
            {
              id: '1',
              subject_id: subjectId,
              title: 'CS Fundamentals Test',
              duration_minutes: 60,
              shuffle: true,
              created_at: new Date().toISOString(),
              question_count: 25
            },
            {
              id: '2',
              subject_id: subjectId,
              title: 'Advanced Programming Concepts',
              duration_minutes: 90,
              shuffle: false,
              created_at: new Date().toISOString(),
              question_count: 40
            }
          ])
        } else {
          const testsWithCount = testsData?.map(test => ({
            ...test,
            question_count: test.test_questions?.[0]?.count || 0
          })) || []
          setTests(testsWithCount)
        }
      } catch (error) {
        console.log('Error connecting to database, using demo data:', error)
        // Demo data
        setSubject({ id: subjectId, name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() })
        setTests([
          {
            id: '1',
            subject_id: subjectId,
            title: 'CS Fundamentals Test',
            duration_minutes: 60,
            shuffle: true,
            created_at: new Date().toISOString(),
            question_count: 25
          },
          {
            id: '2',
            subject_id: subjectId,
            title: 'Advanced Programming Concepts',
            duration_minutes: 90,
            shuffle: false,
            created_at: new Date().toISOString(),
            question_count: 40
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [subjectId, supabase])

  const handleStartTest = (testId: string) => {
    router.push(`/test/${testId}/start`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {subject?.name || 'Subject'} Tests
        </h1>
        <p className="text-gray-600">
          Choose a test to start practicing and improve your skills
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tests available</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no tests available for this subject yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {test.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  {test.question_count || 0} questions
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {test.duration_minutes} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Questions: {test.shuffle ? 'Shuffled' : 'Fixed order'}
                </div>
              </div>

              <button
                onClick={() => handleStartTest(test.id)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
