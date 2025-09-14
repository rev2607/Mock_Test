import { QuickTestLaunch } from '@/components/QuickTestLaunch'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Welcome to Student Hub
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
          Practice with comprehensive mock tests for various competitive exams and subjects.
        </p>
      </div>
      
      {/* Quick Test Launch Section */}
      <div className="mb-12 sm:mb-16">
        <QuickTestLaunch />
      </div>
    </div>
  )
}
