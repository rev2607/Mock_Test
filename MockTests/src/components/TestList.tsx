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
        // Check if subjectId is a UUID or a key
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(subjectId)
        
        // Fetch subject info - try by ID first, then by key
        let subjectQuery = supabase
          .from('subjects')
          .select('*')
        
        if (isUUID) {
          subjectQuery = subjectQuery.eq('id', subjectId)
        } else {
          subjectQuery = subjectQuery.eq('key', subjectId)
        }
        
        const { data: subjectData, error: subjectError } = await subjectQuery.single()

        if (subjectError) {
          console.error('Error fetching subject:', subjectError.message)
          setSubject(null)
        } else {
          setSubject(subjectData)
        }

        // Fetch tests with question count - use the actual subject ID
        const actualSubjectId = subjectData?.id || subjectId
        const { data: testsData, error: testsError } = await supabase
          .from('tests')
          .select(`
            *,
            subject:subjects(*),
            test_questions(count)
          `)
          .eq('subject_id', actualSubjectId)
          .order('created_at', { ascending: false })

        if (testsError) {
          console.error('Error fetching tests:', testsError.message)
          setTests([])
        } else {
          const testsWithCount = testsData?.map(test => ({
            ...test,
            question_count: test.test_questions?.[0]?.count || 0
          })) || []
          setTests(testsWithCount)
        }
      } catch (error) {
        console.error('Error connecting to database:', error)
        setSubject(null)
        setTests([])
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
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
              <div className="h-5 sm:h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-7 sm:h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {subject?.name || 'Subject'} Tests
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          Choose a test to start practicing and improve your skills
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <BookOpen className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tests available</h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 px-4">
            There are no tests available for this subject yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 mr-2">
                  {test.title}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 flex-shrink-0">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {test.question_count || 0} q
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Duration: {test.duration_minutes} min
                </div>
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Questions: {test.shuffle ? 'Shuffled' : 'Fixed order'}
                </div>
              </div>

              <button
                onClick={() => handleStartTest(test.id)}
                className="w-full flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
