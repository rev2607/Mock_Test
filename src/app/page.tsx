import { SubjectList } from '@/components/SubjectList'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Mock Test Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice with comprehensive mock tests across Computer Science, 
          Artificial Intelligence, and Electronics & Communication Engineering.
        </p>
      </div>
      
      
      <SubjectList />
    </div>
  )
}
