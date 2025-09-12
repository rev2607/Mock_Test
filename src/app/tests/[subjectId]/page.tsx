'use client'

import { useParams } from 'next/navigation'
import { TestList } from '@/components/TestList'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function TestsPage() {
  const params = useParams()
  const subjectId = params.subjectId as string

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto">
        <TestList subjectId={subjectId} />
      </div>
    </ProtectedRoute>
  )
}
