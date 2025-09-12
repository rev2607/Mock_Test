'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, LogOut, Home, Settings, BarChart3 } from 'lucide-react'

export function Navbar() {
  const { user, loading, signOut, isAdmin } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Mock Test Platform</h1>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600"
          >
            <Home className="h-6 w-6" />
            <span>Mock Test Platform</span>
          </button>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => router.push('/admin/questions')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage Questions</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/tests')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Manage Tests</span>
                    </button>
                    <button
                      onClick={() => router.push('/admin/attempts')}
                      className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span>View Results</span>
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => router.push('/account/attempts')}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>My Attempts</span>
                </button>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
