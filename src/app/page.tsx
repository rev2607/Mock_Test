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
      
      {/* Demo Data Notice */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Demo Data Mode
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You're currently viewing demo data. To see your real test results and take actual tests, 
                please set up the database by following the instructions in <code className="bg-yellow-100 px-1 rounded">setup-instructions.md</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <SubjectList />
    </div>
  )
}
