
import { useState, useEffect } from "react";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";
import StepThree from "@/components/StepThree";
import Results from "@/components/Results";
import PageHeader from "@/components/PageHeader";
import StepIndicator from "@/components/StepIndicator";
import MainContainer from "@/components/MainContainer";
import StepNavigationButtons from "@/components/StepNavigationButtons";
import { useToast } from "@/hooks/use-toast";
import { getHolidays } from "@/utils/holidays";
import { optimizeVacation } from "@/utils/vacationOptimizer";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState(25);
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Add effect to scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (vacationDays <= 0) {
        toast({
          title: "Ogiltigt antal semesterdagar",
          description: "Vänligen ange minst 1 semesterdag",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      generateOptimizedSchedule();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const fetchHolidays = () => {
    setIsLoading(true);
    try {
      const fetchedHolidays = getHolidays(year);
      setHolidays(fetchedHolidays);
      
      setTimeout(() => {
        toast({
          title: "Röda dagar hämtade",
          description: `${fetchedHolidays.length} helgdagar laddades för ${year}`,
          className: "left-toast",
        });
      }, 100);
    } catch (error) {
      toast({
        title: "Fel vid hämtning av röda dagar",
        description: "Kunde inte hämta röda dagar, försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateOptimizedSchedule = () => {
    setIsLoading(true);
    
    try {
      const optimizedScheduleData = optimizeVacation(year, vacationDays, holidays, selectedMode);
      setOptimizedSchedule(optimizedScheduleData);
      setCurrentStep(4);
    } catch (error) {
      toast({
        title: "Fel vid generering av schema",
        description: "Kunde inte optimera ditt schema, försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <StepThree 
            holidays={holidays} 
            setHolidays={setHolidays} 
            fetchHolidays={fetchHolidays} 
            year={year}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <Results 
            schedule={optimizedSchedule} 
            year={year}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
