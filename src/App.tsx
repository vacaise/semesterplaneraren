
import { OnboardingContainer } from './components/features/onboarding/OnboardingContainer'
import { OptimizerProvider } from './contexts/OptimizerContext'

function App() {
  return (
    <OptimizerProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Holiday Optimizer</h1>
          <OnboardingContainer />
        </main>
      </div>
    </OptimizerProvider>
  )
}

export default App
