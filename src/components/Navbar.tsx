'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, BarChart3, Menu, X, ChevronDown, BookOpen, TrendingUp, MessageCircle, Users, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export function Navbar() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-lg"></div>
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  const handleSignOut = async () => {
    await signOut()
    setIsProfileDropdownOpen(false)
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative h-10 w-10">
              <Image
                src="/studenthub_logo.png"
                alt="Student Hub Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Student Hub<span className="text-blue-600">.in</span>
            </span>
          </button>

          {/* Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Test Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <BookOpen className="h-4 w-4" />
                <span>Test</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <button
                    onClick={() => router.push('/tests/iit')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    IIT JEE
                  </button>
                  <button
                    onClick={() => router.push('/tests/aiims')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    AIIMS
                  </button>
                  <button
                    onClick={() => router.push('/tests/eamcet')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    EAMCET
                  </button>
                </div>
              </div>
            </div>

            {/* College Rankometer */}
            <button
              onClick={() => router.push('/college-rankometer')}
              className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span>College Rankometer</span>
            </button>

            {/* Career Guidance */}
            <button
              onClick={() => router.push('/career-guidance')}
              className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Career Guidance</span>
            </button>

            {/* Chat with Students */}
            <button
              onClick={() => router.push('/chat/students')}
              className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Chat with Students</span>
            </button>

            {/* Chat with US */}
            <button
              onClick={() => router.push('/chat/support')}
              className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat with US</span>
            </button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.email?.split('@')[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">Student</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          router.push('/account/attempts')
                          setIsProfileDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>My Attempts</span>
                      </button>


                      <div className="border-t">
                        <button
                          onClick={() => {
                            router.push('/profile/edit')
                            setIsProfileDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/auth/login')}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <div className="pt-4 space-y-2">
              <button
                onClick={() => {
                  router.push('/tests/iit')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>IIT JEE Tests</span>
              </button>
              <button
                onClick={() => {
                  router.push('/tests/aiims')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>AIIMS Tests</span>
              </button>
              <button
                onClick={() => {
                  router.push('/tests/eamcet')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>EAMCET Tests</span>
              </button>
              <button
                onClick={() => {
                  router.push('/college-rankometer')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>College Rankometer</span>
              </button>
              <button
                onClick={() => {
                  router.push('/career-guidance')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Career Guidance</span>
              </button>
              <button
                onClick={() => {
                  router.push('/chat/students')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Chat with Students</span>
              </button>
              <button
                onClick={() => {
                  router.push('/chat/support')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat with US</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileDropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileDropdownOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}
