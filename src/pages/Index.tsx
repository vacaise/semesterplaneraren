
import { useState, useEffect } from "react";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";
import StepThree from "@/components/StepThree";
import Results from "@/components/Results";
import PageHeader from "@/components/PageHeader";
import StepIndicator from "@/components/StepIndicator";
import MainContainer from "@/components/MainContainer";
import StepNavigationButtons from "@/components/StepNavigationButtons";
import Footer from "@/components/Footer";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHolidays } from "@/hooks/use-holidays";
import { useVacationOptimization } from "@/hooks/use-vacation-optimization";
import { useWizard } from "@/hooks/use-wizard";

const Index = () => {
  // Basic state
  const [year, setYear] = useState(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState(25);
  const [selectedMode, setSelectedMode] = useState("balanced");
  
  // Custom hooks
  const isMobile = useIsMobile();
  const { holidays, setHolidays, fetchHolidays, resetHolidays, isLoading: isLoadingHolidays } = useHolidays(year);
  const { 
    optimizedSchedule, 
    setOptimizedSchedule,
    generateOptimizedSchedule, 
    isLoading: isOptimizing,
    errorMessage,
    setErrorMessage
  } = useVacationOptimization();
  const { currentStep, nextStep, prevStep, resetToStart } = useWizard(1);

  // Reset holidays when year changes
  useEffect(() => {
    resetHolidays();
    setErrorMessage(null);
  }, [year]);

  // Clear error message when vacation days change
  useEffect(() => {
    setErrorMessage(null);
  }, [vacationDays, setErrorMessage]);

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      nextStep(currentStep, { vacationDays });
    } else {
      const success = generateOptimizedSchedule(year, vacationDays, holidays, selectedMode);
      if (success) {
        nextStep(currentStep, {}); // Go to results if optimization was successful
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    prevStep();
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne 
            year={year} 
            setYear={setYear} 
            vacationDays={vacationDays} 
            setVacationDays={setVacationDays} 
          />
        );
      case 2:
        return (
          <StepTwo 
            selectedMode={selectedMode} 
            setSelectedMode={setSelectedMode} 
          />
        );
      case 3:
        return (
          <>
            {errorMessage && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Optimering misslyckades</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                  <p className="mt-2">Försök med ett annat antal semesterdagar eller en annan optimeringsmetod.</p>
                </AlertDescription>
              </Alert>
            )}
            <StepThree 
              holidays={holidays} 
              setHolidays={setHolidays} 
              fetchHolidays={fetchHolidays} 
              year={year}
              isLoading={isLoadingHolidays}
            />
          </>
        );
      case 4:
        return (
          <Results 
            schedule={optimizedSchedule} 
            year={year}
            holidays={holidays}
            resetToStart={resetToStart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>vacai | Maxa din ledighet</title>
        <meta name="description" content="Maximera din ledighet med smart semesterplanering. Planera dina semesterdagar optimalt för att få ut mest möjliga ledighet." />
        <link rel="canonical" href="https://vacai.se" />
      </Helmet>
      
      <div className={`py-6 md:py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <PageHeader />
          
          {currentStep < 4 && <StepIndicator currentStep={currentStep} />}

          <MainContainer currentStep={currentStep}>
            {renderCurrentStep()}
          </MainContainer>

          <StepNavigationButtons 
            currentStep={currentStep}
            handleNextStep={handleNextStep}
            handlePrevStep={handlePrevStep}
            resetToStart={resetToStart}
            isLoading={isLoadingHolidays || isOptimizing}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
