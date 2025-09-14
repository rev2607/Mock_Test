import { ChatWithStudents } from '@/components/ChatWithStudents'

export default function ChatStudentsPage() {
  return (
    <div className="w-full h-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Chat with Students
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Connect with fellow students, ask questions, and share knowledge in our study groups.
        </p>
      </div>
      
      <div className="h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] lg:h-[calc(100vh-220px)]">
        <ChatWithStudents />
      </div>
    </div>
  )
}
