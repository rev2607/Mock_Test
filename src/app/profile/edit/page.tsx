'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, GraduationCap, Save, ArrowLeft } from 'lucide-react'

export default function EditProfile() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    userName: '',
    phoneNumber: '',
    city: '',
    pincode: '',
    targetExam: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/auth/login?message=Please login to edit your profile')
      return
    }

    // Load existing profile data
    loadProfileData()
  }, [user, loading, router])

  const loadProfileData = async () => {
    try {
      if (!user) return

      const metadata = user.user_metadata || {}
      setFormData({
        userName: metadata.user_name || '',
        phoneNumber: metadata.phone_number || '',
        city: metadata.city || '',
        pincode: metadata.pincode || '',
        targetExam: metadata.target_exam || ''
      })
    } catch (err) {
      console.error('Error loading profile data:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!user) return

    // Validation
    if (!formData.userName || !formData.phoneNumber || !formData.city || !formData.pincode || !formData.targetExam) {
      setError('Please fill in all required fields')
      return
    }

    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setSaving(true)

    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          user_name: formData.userName,
          phone_number: formData.phoneNumber,
          city: formData.city,
          pincode: formData.pincode,
          target_exam: formData.targetExam
        }
      })

      if (authError) {
        console.error('Error updating auth profile:', authError)
        setError('Failed to update profile. Please try again.')
        return
      }

      // Also update the profiles table directly (as backup)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          user_name: formData.userName,
          phone_number: formData.phoneNumber,
          city: formData.city,
          pincode: formData.pincode,
          target_exam: formData.targetExam,
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Error updating profiles table:', profileError)
        // Don't show error to user as auth update succeeded
      }

      setSuccess('Profile updated successfully!')
      setTimeout(() => {
        router.push('/chat/students')
      }, 1500)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('An unexpected error occurred. Please try again.')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="mt-2 text-gray-600">Update your profile information</p>
        </div>

        {/* Profile Form */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                <User className="h-4 w-4 inline mr-2" />
                Full Name *
              </label>
              <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="name"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.userName}
                onChange={handleInputChange}
                suppressHydrationWarning
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                pattern="[0-9]{10}"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                placeholder="Enter your 10-digit phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  // Allow: backspace, delete, tab, escape, enter
                  if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                      (e.keyCode === 65 && e.ctrlKey === true) ||
                      (e.keyCode === 67 && e.ctrlKey === true) ||
                      (e.keyCode === 86 && e.ctrlKey === true) ||
                      (e.keyCode === 88 && e.ctrlKey === true) ||
                      // Allow: home, end, left, right
                      (e.keyCode >= 35 && e.keyCode <= 39)) {
                    return;
                  }
                  // Ensure that it is a number and stop the keypress
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }}
                suppressHydrationWarning
              />
            </div>

            {/* City/Area */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 inline mr-2" />
                City/Area *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your city or area"
                value={formData.city}
                onChange={handleInputChange}
                suppressHydrationWarning
              />
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 inline mr-2" />
                Pincode *
              </label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                autoComplete="postal-code"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                suppressHydrationWarning
              />
            </div>

            {/* Target Exam */}
            <div>
              <label htmlFor="targetExam" className="block text-sm font-medium text-gray-700">
                <GraduationCap className="h-4 w-4 inline mr-2" />
                Target Exam *
              </label>
              <select
                id="targetExam"
                name="targetExam"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.targetExam}
                onChange={handleInputChange}
              >
                <option value="">Select your target exam</option>
                <option value="IIT/JEE">IIT/JEE</option>
                <option value="NEET">NEET</option>
                <option value="AIIMS">AIIMS</option>
                <option value="EAMCET">EAMCET</option>
                <option value="BITSAT">BITSAT</option>
                <option value="VITEEE">VITEEE</option>
                <option value="SRMJEE">SRMJEE</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
