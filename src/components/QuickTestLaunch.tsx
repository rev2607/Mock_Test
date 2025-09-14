'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, BookOpen, Check } from 'lucide-react'

const examOptions = [
  { value: 'jee-mains', label: 'JEE Mains' },
  { value: 'jee-advanced', label: 'JEE Advanced' },
  { value: 'neet', label: 'NEET' },
  { value: 'gate', label: 'GATE' },
  { value: 'cat', label: 'CAT' },
  { value: 'upsc', label: 'UPSC' },
  { value: 'ssc', label: 'SSC' },
  { value: 'banking', label: 'Banking' },
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
  const router = useRouter()

  const handleStartTest = () => {
    // For now, redirect to a generic test page
    // In a real implementation, this would create a test based on selected exam
    router.push('/test/quick-test')
  }

  const selectedExamLabel = examOptions.find(exam => exam.value === selectedExam)?.label || 'Select Exam'
  const selectedYearLabel = yearOptions.find(year => year.value === selectedYear)?.label || 'Select Year'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Play className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-900">Quick Test Launch</h2>
        </div>
        <p className="text-lg text-blue-600 font-medium">Start your practice session in seconds</p>
      </div>

      {/* Input Field */}
      <div className="mb-8">
        {/* Select Exam */}
        <div className="relative max-w-md mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="h-4 w-4 inline mr-2" />
            Select Exam
          </label>
          <div className="relative">
            <button
              onClick={() => setIsExamDropdownOpen(!isExamDropdownOpen)}
              className={`w-full px-4 py-3 border-2 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                isExamDropdownOpen ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <span className="text-gray-900">{selectedExamLabel}</span>
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
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
      </div>

      {/* Start Test Button */}
      <button
        onClick={handleStartTest}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Start Test Now
      </button>

      {/* Features */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center text-sm text-gray-600">
          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span>Instant score</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span>Step-by-step solutions</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span>Performance dashboard</span>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isExamDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsExamDropdownOpen(false)}
        />
      )}
    </div>
  )
}
