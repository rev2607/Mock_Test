'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface WeakAreasChartProps {
  resultData: any
}

export function WeakAreasChart({ resultData }: WeakAreasChartProps) {
  if (!resultData?.questions) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Topic</h3>
        <div className="text-center text-gray-500 py-8">
          No data available for analysis
        </div>
      </div>
    )
  }

  // Process data for charts
  const topicStats = resultData.questions.reduce((acc: any, question: any) => {
    const topic = question.topic || 'Unknown'
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 }
    }
    acc[topic].total++
    if (question.correct) {
      acc[topic].correct++
    }
    return acc
  }, {})

  const chartData = Object.entries(topicStats).map(([topic, stats]: [string, any]) => ({
    topic,
    correct: stats.correct,
    incorrect: stats.total - stats.correct,
    percentage: Math.round((stats.correct / stats.total) * 100),
    total: stats.total
  }))

  const pieData = chartData.map(item => ({
    name: item.topic,
    value: item.percentage,
    correct: item.correct,
    total: item.total
  }))

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Analysis</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Accuracy by Topic</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="topic" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [`${value}%`, 'Accuracy']}
                labelFormatter={(label) => `Topic: ${label}`}
              />
              <Bar 
                dataKey="percentage" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Question Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string, props: any) => [
                  `${value}% (${props.payload.correct}/${props.payload.total})`,
                  'Accuracy'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Performance Table */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-700 mb-4">Detailed Performance</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Correct
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chartData.map((item, index) => (
                <tr key={item.topic}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.topic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.correct}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.percentage >= 70 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        item.percentage >= 70 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.percentage >= 70 ? 'Strong' : 'Needs Improvement'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
