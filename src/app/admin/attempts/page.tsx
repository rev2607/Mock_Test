'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/lib/database.types'
import { Search, Download, Eye, Filter, Calendar, User, Trophy, Target, XCircle } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'

type Attempt = Database['public']['Tables']['attempts']['Row'] & {
  test?: Database['public']['Tables']['tests']['Row'] & {
    subject?: Database['public']['Tables']['subjects']['Row']
  }
}

export default function AdminAttemptsPage() {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [scoreFilter, setScoreFilter] = useState('')
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
          .order('submitted_at', { ascending: false })

        if (error) {
          console.error('Error fetching attempts:', error)
          // Demo data
          setAttempts([
            {
              id: '1',
              user_id: 'user-1',
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
              user_id: 'user-2',
              test_id: '2',
              started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000).toISOString(),
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
              user_id: 'user-3',
              test_id: '3',
              started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
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
            },
            {
              id: '4',
              user_id: 'user-4',
              test_id: '1',
              started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000).toISOString(),
              score: 92,
              total_marks: 25,
              summary: { correct: 23, total: 25, percentage: 92 },
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
            user_id: 'user-1',
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
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAttempts()
  }, [supabase])

  const filteredAttempts = attempts.filter(attempt => {
    const matchesSearch = attempt.test?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attempt.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = !selectedSubject || attempt.test?.subject_id === selectedSubject
    const matchesDate = !dateFilter || new Date(attempt.submitted_at || attempt.started_at).toDateString() === new Date(dateFilter).toDateString()
    const matchesScore = !scoreFilter || (
      scoreFilter === 'high' && (attempt.score || 0) >= 80 ||
      scoreFilter === 'medium' && (attempt.score || 0) >= 60 && (attempt.score || 0) < 80 ||
      scoreFilter === 'low' && (attempt.score || 0) < 60
    )
    return matchesSearch && matchesSubject && matchesDate && matchesScore
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-4 w-4 text-green-600" />
    if (score >= 60) return <Target className="h-4 w-4 text-yellow-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
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

  const exportToCSV = () => {
    const csvData = filteredAttempts.map(attempt => ({
      'User ID': attempt.user_id,
      'Test': attempt.test?.title || '',
      'Subject': attempt.test?.subject?.name || '',
      'Score': `${Math.round(attempt.score || 0)}%`,
      'Correct': attempt.summary?.correct || 0,
      'Total': attempt.summary?.total || attempt.total_marks || 0,
      'Time Taken': `${calculateTimeTaken(attempt.started_at, attempt.submitted_at || new Date().toISOString())}m`,
      'Submitted': formatDate(attempt.submitted_at || attempt.started_at)
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-attempts-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
    <ProtectedRoute requireAdmin={true}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Attempts & Results</h1>
              <p className="text-gray-600">
                View and analyze all student test attempts and performance
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search attempts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Subjects</option>
              <option value="1">Computer Science</option>
              <option value="2">Artificial Intelligence</option>
              <option value="3">Electronics & Communication</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Scores</option>
              <option value="high">High (80%+)</option>
              <option value="medium">Medium (60-79%)</option>
              <option value="low">Low (&lt;60%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(attempts.reduce((acc, attempt) => acc + (attempt.score || 0), 0) / attempts.length)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Performers</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempts.filter(attempt => (attempt.score || 0) >= 80).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempts.filter(attempt => {
                  const attemptDate = new Date(attempt.submitted_at || attempt.started_at)
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  return attemptDate >= weekAgo
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attempts Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Taken
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttempts.map((attempt) => (
                <tr key={attempt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.user_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{attempt.test?.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {attempt.test?.subject?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getScoreIcon(attempt.score || 0)}
                      <span className={`ml-2 text-sm font-medium ${getScoreColor(attempt.score || 0)}`}>
                        {Math.round(attempt.score || 0)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {(attempt.summary as any)?.correct || 0}/{(attempt.summary as any)?.total || attempt.total_marks || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateTimeTaken(attempt.started_at, attempt.submitted_at || new Date().toISOString())}m
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(attempt.submitted_at || attempt.started_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        // Navigate to detailed results
                        window.location.href = `/results/${attempt.id}`
                      }}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAttempts.length === 0 && (
        <div className="text-center py-12">
          <Filter className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attempts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
      </div>
    </ProtectedRoute>
  )
}
