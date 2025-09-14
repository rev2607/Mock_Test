'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, GraduationCap, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export function ProfileCompletionCheck({ children }: { children: React.ReactNode }) {
  const { user, loading, isProfileComplete } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login?message=Please login to access this feature')
    return null
  }

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You need to complete your profile to access tests and chat features.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Required Information:</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-3 text-gray-400" />
                <span>Email address</span>
                <span className="ml-auto text-green-600">✓</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-3 text-gray-400" />
                <span>Full name</span>
                <span className="ml-auto text-red-500">✗</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <span>Phone number</span>
                <span className="ml-auto text-red-500">✗</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                <span>City</span>
                <span className="ml-auto text-red-500">✗</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                <span>Pincode</span>
                <span className="ml-auto text-red-500">✗</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-3 text-gray-400" />
                <span>Target exam</span>
                <span className="ml-auto text-red-500">✗</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/profile/edit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
