'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Question = Database['public']['Tables']['questions']['Row'] & {
  options: Database['public']['Tables']['options']['Row'][]
  subject?: Database['public']['Tables']['subjects']['Row']
}

type Subject = Database['public']['Tables']['subjects']['Row']

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
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

        // Fetch questions with options
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            options(*),
            subject:subjects(*)
          `)
          .order('created_at', { ascending: false })

        if (questionsError) {
          console.error('Error fetching questions:', questionsError)
          // Demo data
          setQuestions([
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
              ],
              subject: {
                id: '1',
                name: 'Computer Science',
                key: 'cs',
                created_at: new Date().toISOString()
              }
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
              ],
              subject: {
                id: '1',
                name: 'Computer Science',
                key: 'cs',
                created_at: new Date().toISOString()
              }
            }
          ])
        } else {
          setQuestions(questionsData || [])
        }
      } catch (error) {
        console.error('Error:', error)
        // Demo data
        setSubjects([
          { id: '1', name: 'Computer Science', key: 'cs', created_at: new Date().toISOString() },
          { id: '2', name: 'Artificial Intelligence', key: 'ai', created_at: new Date().toISOString() },
          { id: '3', name: 'Electronics & Communication', key: 'ece', created_at: new Date().toISOString() }
        ])
        setQuestions([
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
            ],
            subject: {
              id: '1',
              name: 'Computer Science',
              key: 'cs',
              created_at: new Date().toISOString()
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || question.subject_id === selectedSubject
    return matchesSearch && matchesSubject
  })

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 1) return 'bg-green-100 text-green-800'
    if (difficulty <= 2) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 1) return 'Easy'
    if (difficulty <= 2) return 'Medium'
    return 'Hard'
  }

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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Questions</h1>
            <p className="text-gray-600">
              Create, edit, and manage test questions and their options
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
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
                placeholder="Search questions..."
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

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedSubject 
                ? 'Try adjusting your search criteria' 
                : 'Get started by adding your first question'
              }
            </p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.title}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {question.subject?.name}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                      {getDifficultyText(question.difficulty)}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      {question.topic}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {question.body}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Options:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {question.options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-2 rounded border ${
                            option.is_correct 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <span className={`text-sm ${
                            option.is_correct ? 'text-green-800 font-medium' : 'text-gray-700'
                          }`}>
                            {option.text}
                            {option.is_correct && ' ✓'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingQuestion(question)
                      setShowModal(true)
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this question?')) {
                        // Handle delete
                        console.log('Delete question:', question.id)
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingQuestion(null)
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
                    defaultValue={editingQuestion?.subject_id || ''}
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
                    Question Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingQuestion?.title || ''}
                    placeholder="Enter question title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Body
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={editingQuestion?.body || ''}
                    placeholder="Enter question description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingQuestion?.topic || ''}
                      placeholder="e.g., Algorithms"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={editingQuestion?.difficulty || 1}
                    >
                      <option value={1}>Easy</option>
                      <option value={2}>Medium</option>
                      <option value={3}>Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${index}`}
                          defaultValue={editingQuestion?.options[index - 1]?.text || ''}
                        />
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="correct-option"
                            value={index}
                            defaultChecked={editingQuestion?.options[index - 1]?.is_correct || false}
                            className="mr-1"
                          />
                          <span className="text-sm text-gray-700">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingQuestion(null)
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingQuestion ? 'Update Question' : 'Create Question'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
