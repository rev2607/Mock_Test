'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Plus, Edit, Trash2, Search, Clock, BookOpen, Users } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Test = Database['public']['Tables']['tests']['Row'] & {
  subject?: Database['public']['Tables']['subjects']['Row']
  question_count?: number
}

type Subject = Database['public']['Tables']['subjects']['Row']

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('name')

        if (subjectsError) {
          console.error('Error fetching subjects:', subjectsError)
          // Demo data
          setSubjects([
            { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() },
            { id: '2', name: 'Artificial Intelligence', key: 'ai', created_at: new Date().toISOString() },
            { id: '3', name: 'Electronics & Communication', key: 'ece', created_at: new Date().toISOString() }
          ])
        } else {
          setSubjects(subjectsData || [])
        }

        // Fetch tests
        const { data: testsData, error: testsError } = await supabase
          .from('tests')
          .select(`
            *,
            subject:subjects(*),
            test_questions(count)
          `)
          .order('created_at', { ascending: false })

        if (testsError) {
          console.error('Error fetching tests:', testsError)
          // Demo data
          setTests([
            {
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
              },
              question_count: 25
            },
            {
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
              },
              question_count: 40
            },
            {
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
              },
              question_count: 30
            }
          ])
        } else {
          const testsWithCount = testsData?.map(test => ({
            ...(test as any),
            question_count: (test as any).test_questions?.[0]?.count || 0
          })) || []
          setTests(testsWithCount)
        }
      } catch (error) {
        console.error('Error:', error)
        // Demo data
        setSubjects([
          { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() },
          { id: '2', name: 'Artificial Intelligence', key: 'ai', created_at: new Date().toISOString() },
          { id: '3', name: 'Electronics & Communication', key: 'ece', created_at: new Date().toISOString() }
        ])
        setTests([
          {
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
            },
            question_count: 25
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || test.subject_id === selectedSubject
    return matchesSearch && matchesSubject
  })

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
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
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Tests</h1>
              <p className="text-gray-600">
                Create, edit, and manage test configurations
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Test
            </button>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedSubject 
                ? 'Try adjusting your search criteria' 
                : 'Get started by creating your first test'
              }
            </p>
          </div>
        ) : (
          filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {test.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {test.subject?.name}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.shuffle ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.shuffle ? 'Shuffled' : 'Fixed Order'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setEditingTest(test)
                      setShowModal(true)
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this test?')) {
                        // Handle delete
                        console.log('Delete test:', test.id)
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {test.duration_minutes} minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Questions: {test.question_count || 0}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Created: {new Date(test.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    // Navigate to test questions management
                    console.log('Manage questions for test:', test.id)
                  }}
                  className="w-full text-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                >
                  Manage Questions
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Test Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTest ? 'Edit Test' : 'Create New Test'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingTest(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingTest?.subject_id || ''}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingTest?.title || ''}
                    placeholder="Enter test title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingTest?.duration_minutes || 60}
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      defaultChecked={editingTest?.shuffle || false}
                    />
                    <span className="text-sm text-gray-700">
                      Shuffle questions order
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingTest(null)
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingTest ? 'Update Test' : 'Create Test'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  )
}
