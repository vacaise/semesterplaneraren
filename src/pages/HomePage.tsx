
import { useState } from "react";
import { Helmet } from "react-helmet";
import VacationForm from "@/components/VacationForm";
import VacationResults from "@/components/VacationResults";
import { getSwedishHolidays } from "@/utils/holidays";
import { optimizeVacation } from "@/utils/optimizer";
import { OptimizationResult } from "@/utils/calculators";

const HomePage = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState<number>(25);
  const [mode, setMode] = useState<string>("balanced");
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadHolidays = () => {
    setIsLoading(true);
    try {
      const swedishHolidays = getSwedishHolidays(year);
      setHolidays(swedishHolidays);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading holidays:", error);
      setIsLoading(false);
    }
  };

  const generateVacationPlan = () => {
    if (vacationDays <= 0) {
      alert("Du måste ange minst en semesterdag.");
      return;
    }

    setIsLoading(true);
    
    try {
      const optimizationResult = optimizeVacation(year, vacationDays, holidays, mode);
      setResult(optimizationResult);
      setStep(3); // Go to results step
    } catch (error) {
      console.error("Optimization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Semesteroptimering | Maximera din ledighet</title>
        <meta name="description" content="Optimera dina semesterdagar för att få ut mesta möjliga ledighet" />
      </Helmet>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Semesteroptimering
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Maximera din ledighet genom att optimera dina semesterdagar
            </p>
          </div>

          {step < 3 ? (
            <VacationForm
              year={year}
              setYear={setYear}
              vacationDays={vacationDays}
              setVacationDays={setVacationDays}
              mode={mode}
              setMode={setMode}
              holidays={holidays}
              loadHolidays={loadHolidays}
              step={step}
              setStep={setStep}
              generateVacationPlan={generateVacationPlan}
              isLoading={isLoading}
            />
          ) : (
            <VacationResults
              result={result}
              year={year}
              holidays={holidays}
              resetForm={resetForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
