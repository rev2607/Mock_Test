'use client'

import { MessageCircle, Clock, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChatSupportPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        {/* Coming Soon Content */}
        <div className="space-y-6">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
            <MessageCircle className="h-10 w-10 text-blue-600" />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Chat with US
            </h1>
            <div className="flex items-center justify-center text-2xl font-semibold text-blue-600 mb-4">
              <Clock className="h-6 w-6 mr-2" />
              Coming Soon
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg text-gray-600">
              We&apos;re building a dedicated support system to help you with any questions or issues.
            </p>
            <p className="text-gray-500">
              Get ready for instant support, technical assistance, and personalized help from our team.
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect:</h3>
            <ul className="space-y-2 text-left text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Live chat support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Technical assistance
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                FAQ and help center
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Priority support for premium users
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
