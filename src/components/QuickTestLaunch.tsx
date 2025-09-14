'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, BookOpen, Check, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

const examOptions = [
  { value: 'jee-mains', label: 'JEE Mains' },
  { value: 'jee-advanced', label: 'JEE Advanced' },
  { value: 'eamcet', label: 'EAMCET' },
  { value: 'aiims', label: 'AIIMS' },
]

// Generate year options for the last 15 years
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 15 }, (_, i) => {
  const year = currentYear - i
  return { value: year.toString(), label: year.toString() }
})


export function QuickTestLaunch() {
  const [selectedExam, setSelectedExam] = useState('jee-mains')
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false)
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleStartTest = async () => {
    setLoading(true)
    
    try {
      // For JEE Mains 2025, find and redirect to IIT JEE Mock Test 1
      if (selectedExam === 'jee-mains' && selectedYear === '2025') {
        const { data: testData, error } = await supabase
          .from('tests')
          .select('id')
          .eq('title', 'IIT JEE Mock Test 1')
          .single()
        
        if (error) {
          console.error('Error finding test:', error)
          // Fallback to IIT JEE tests page
          router.push('/tests/iit')
        } else if (testData) {
          // Redirect directly to the test
          router.push(`/test/${testData.id}/start`)
        } else {
          router.push('/tests/iit')
        }
      } else if (selectedExam === 'jee-advanced') {
        router.push('/tests/iit')
      } else if (selectedExam === 'aiims') {
        router.push('/tests/aiims')
      } else if (selectedExam === 'eamcet') {
        router.push('/tests/eamcet')
      } else {
        router.push('/tests/iit')
      }
    } catch (error) {
      console.error('Error starting test:', error)
      router.push('/tests/iit')
    } finally {
      setLoading(false)
    }
  }

  const selectedExamLabel = examOptions.find(exam => exam.value === selectedExam)?.label || 'Select Exam'
  const selectedYearLabel = yearOptions.find(year => year.value === selectedYear)?.label || 'Select Year'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center mb-3 sm:mb-4">
          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2 sm:mr-3" />
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Quick Test Launch</h2>
        </div>
        <p className="text-sm sm:text-base lg:text-lg text-blue-600 font-medium">Start your practice session in seconds</p>
      </div>

      {/* Input Fields */}
      <div className="mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Select Exam */}
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
            Select Exam
          </label>
          <div className="relative">
            <button
              onClick={() => {
                setIsExamDropdownOpen(!isExamDropdownOpen)
                setIsYearDropdownOpen(false)
              }}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                isExamDropdownOpen ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-gray-900">{selectedExamLabel}</span>
              <svg className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExamDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {examOptions.map((exam) => (
                  <button
                    key={exam.value}
                    onClick={() => {
                      setSelectedExam(exam.value)
                      setIsExamDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-50 transition-colors text-sm sm:text-base ${
                      selectedExam === exam.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {exam.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Select Year */}
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 inline mr-1 sm:mr-2" />
            Year
          </label>
          <div className="relative">
            <button
              onClick={() => {
                setIsYearDropdownOpen(!isYearDropdownOpen)
                setIsExamDropdownOpen(false)
              }}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm sm:text-base ${
                isYearDropdownOpen ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-gray-900">{selectedYearLabel}</span>
              <svg className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isYearDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {yearOptions.map((year) => (
                  <button
                    key={year.value}
                    onClick={() => {
                      setSelectedYear(year.value)
                      setIsYearDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-blue-50 transition-colors text-sm sm:text-base ${
                      selectedYear === year.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                    }`}
                  >
                    {year.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <button
        onClick={handleStartTest}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
      >
        {loading ? 'Starting Test...' : 'Start Test Now'}
      </button>

      {/* Features */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
          <span>Instant score</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
          <span>Weak areas analysis</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2 flex-shrink-0" />
          <span>Performance dashboard</span>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isExamDropdownOpen || isYearDropdownOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsExamDropdownOpen(false)
            setIsYearDropdownOpen(false)
          }}
        />
      )}
    </div>
  )
}
