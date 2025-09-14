import { QuickTestLaunch } from '@/components/QuickTestLaunch'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Student Hub
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice with comprehensive mock tests for various competitive exams and subjects.
        </p>
      </div>
      
      {/* Quick Test Launch Section */}
      <div className="mb-16">
        <QuickTestLaunch />
      </div>
    </div>
  )
}
