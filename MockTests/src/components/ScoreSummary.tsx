'use client'

import { Trophy, Target, Clock, CheckCircle, XCircle } from 'lucide-react'

interface ScoreSummaryProps {
  score: number
  correct: number
  total: number
  timeTaken: number
  totalTime: number
}

export function ScoreSummary({ score, correct, total, timeTaken, totalTime }: ScoreSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Trophy className="h-8 w-8 text-green-600" />
    if (score >= 60) return <Target className="h-8 w-8 text-yellow-600" />
    return <XCircle className="h-8 w-8 text-red-600" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          {getScoreIcon(score)}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {Math.round(score)}%
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {correct} out of {total} correct
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Correct Answers</h3>
        <div className="text-4xl font-bold text-green-600">
          {correct}
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {total > 0 ? Math.round(((correct / total) * 100)) : 0}% accuracy
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Taken</h3>
        <div className="text-4xl font-bold text-blue-600">
          {timeTaken}m
        </div>
        <p className="text-gray-600 text-sm mt-2">
          out of {totalTime} minutes
        </p>
      </div>
    </div>
  )
}
