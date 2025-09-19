'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Still loading, don't redirect yet

    if (requireAuth && !user) {
      // User needs to be authenticated but isn't
      router.push('/auth/login')
      return
    }

    if (requireAdmin && (!user || !isAdmin)) {
      // User needs to be admin but isn't
      router.push('/')
      return
    }
  }, [user, loading, isAdmin, requireAuth, requireAdmin, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If authentication is required but user is not logged in, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If admin is required but user is not admin, don't render children
  if (requireAdmin && (!user || !isAdmin)) {
    return null
  }

  return <>{children}</>
}
