'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type Subject = Database['public']['Tables']['subjects']['Row']

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { user } = useAuth()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Check if Supabase is properly configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_url_here') {
          console.error('Supabase not configured')
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('subjects')
          .select('*')
          .order('name')

        if (error) {
          console.error('Error fetching subjects:', error.message)
          setSubjects([])
        } else {
          setSubjects(data || [])
        }
      } catch (error) {
        console.error('Error connecting to database:', error)
        setSubjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [supabase])

  const handleSubjectClick = (subject: Subject) => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page with a message
      router.push('/auth/login?message=Please login to access tests')
      return
    }
    router.push(`/tests/${subject.id}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => {
        const IconComponent = BookOpen
        
        return (
          <button
            key={subject.id}
            onClick={() => handleSubjectClick(subject)}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 text-left group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200">
                <IconComponent className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
              {subject.name}
            </h3>
            
            <p className="text-gray-600 text-sm">
              Click to view available tests and start practicing
            </p>
            
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
              View Tests
              <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )
      })}
    </div>
  )
}
