'use client'

import { useParams } from 'next/navigation'
import { TestList } from '@/components/TestList'

export default function TestsPage() {
  const params = useParams()
  const subjectId = params.subjectId as string

  return (
    <div className="max-w-6xl mx-auto">
      <TestList subjectId={subjectId} />
    </div>
  )
}
