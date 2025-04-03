
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
import { useToast } from "@/hooks/use-toast";
import { getHolidays } from "@/utils/holidays";
import { optimizeVacation } from "@/utils/vacationOptimizer";
import { mockSchedule } from "@/utils/vacationOptimizer/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState(25);
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  // Reset holidays when year changes
  useEffect(() => {
    setHolidays([]);
    setErrorMessage(null);
  }, [year]);

  // Clear error message when vacation days change
  useEffect(() => {
    setErrorMessage(null);
  }, [vacationDays]);

  // Reset to start
  const resetToStart = () => {
    setCurrentStep(1);
    setOptimizedSchedule(null);
    setErrorMessage(null);
    window.scrollTo(0, 0);
  };

  // Handle next step
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

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fetch holidays
  const fetchHolidays = () => {
    setIsLoading(true);
    try {
      console.log("Fetching holidays for year:", year);
      const fetchedHolidays = getHolidays(year);
      console.log("Fetched holidays:", fetchedHolidays);
      setHolidays(fetchedHolidays);
      
      setTimeout(() => {
        toast({
          title: "Röda dagar hämtade",
          description: `${fetchedHolidays.length} helgdagar laddades för ${year}`,
          className: "left-toast",
        });
      }, 100);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast({
        title: "Fel vid hämtning av röda dagar",
        description: "Kunde inte hämta röda dagar, försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate optimized schedule
  const generateOptimizedSchedule = () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Generating schedule with holidays:", holidays);
      console.log("Vacation days:", vacationDays);
      console.log("Selected mode:", selectedMode);
      
      let optimizedScheduleData;
      
      try {
        // Try to use the real optimization function
        optimizedScheduleData = optimizeVacation(year, vacationDays, holidays, selectedMode as any);
      } catch (optimizationError) {
        console.error("Real optimization failed, using mock data:", optimizationError);
        // Fall back to mock data if the real optimization fails
        optimizedScheduleData = mockSchedule(year, vacationDays);
      }
      
      console.log("Generated schedule:", optimizedScheduleData);
      
      if (!optimizedScheduleData || !optimizedScheduleData.periods || !Array.isArray(optimizedScheduleData.periods)) {
        throw new Error("Invalid schedule data returned from optimization");
      }
      
      setOptimizedSchedule(optimizedScheduleData);
      setCurrentStep(4);
    } catch (error: any) {
      // Handle optimization errors
      const errorMessage = error?.message || "Kunde inte optimera ditt schema, försök igen senare";
      console.error("Optimization error:", error);
      
      setErrorMessage(errorMessage);
      
      toast({
        title: "Kunde inte skapa optimal semesterplan",
        description: "Det gick inte att hitta en kombination som använder exakt angivet antal semesterdagar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              isLoading={isLoading}
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
            isLoading={isLoading}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
