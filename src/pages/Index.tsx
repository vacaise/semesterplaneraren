
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Helmet } from "react-helmet";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState(25);
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [companyDays, setCompanyDays] = useState<Date[]>([]);
  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    setHolidays([]);
    setCompanyDays([]);
  }, [year]);

  const resetToStart = () => {
    setCurrentStep(1);
    setOptimizedSchedule(null);
    setVacationDays(25);
    setSelectedMode("balanced");
    setHolidays([]);
    setCompanyDays([]);
    setYear(new Date().getFullYear());
    window.scrollTo(0, 0);
  };

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
      console.log("Generating schedule with holidays:", holidays);
      console.log("Company days:", companyDays);
      // Combine holidays and company days for optimization
      const allDaysOff = [...holidays, ...companyDays];
      const optimizedScheduleData = optimizeVacation(year, vacationDays, allDaysOff, selectedMode);
      console.log("Generated schedule:", optimizedScheduleData);
      setOptimizedSchedule(optimizedScheduleData);
      setCurrentStep(4);
    } catch (error) {
      toast({
        title: "Fel vid generering av schema",
        description: "Kunde inte optimera ditt schema, försök igen senare",
        variant: "destructive",
      });
      console.error("Optimization error:", error);
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
            companyDays={companyDays}
            setCompanyDays={setCompanyDays}
          />
        );
      case 4:
        return (
          <Results 
            schedule={optimizedSchedule} 
            year={year}
            holidays={holidays}
            companyDays={companyDays}
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
