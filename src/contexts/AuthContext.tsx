'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  isAdmin: boolean
  isProfileComplete: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const supabase = createClient()

  const checkProfileCompletion = (user: User | null) => {
    if (!user) {
      setIsProfileComplete(false)
      return
    }

    const metadata = user.user_metadata || {}
    const hasRequiredFields = !!(
      metadata.user_name &&
      metadata.phone_number &&
      metadata.city &&
      metadata.pincode &&
      metadata.target_exam
    )
    
    setIsProfileComplete(hasRequiredFields)
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      checkProfileCompletion(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        checkProfileCompletion(currentUser)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const isAdmin = user?.user_metadata?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAdmin, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
