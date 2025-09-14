import { ChatWithStudents } from '@/components/ChatWithStudents'

export default function ChatStudentsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chat with Students
        </h1>
        <p className="text-gray-600">
          Connect with fellow students, ask questions, and share knowledge in our study groups.
        </p>
      </div>
      
      <ChatWithStudents />
    </div>
  )
}
