import { OptimizerProvider } from './contexts/OptimizerContext'
import { OptimizerForm } from './components/OptimizerForm'

function App() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
  };

  return (
    <OptimizerProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">Holiday Optimizer</h1>
          <OptimizerForm onSubmitAction={handleSubmit} />
        </main>
      </div>
    </OptimizerProvider>
  )
}

export default App
