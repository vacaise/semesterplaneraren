import { OnboardingContainer } from './components/features/onboarding/OnboardingContainer'

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Holiday Optimizer</h1>
        <OnboardingContainer />
      </main>
    </div>
  )
}

export default App 