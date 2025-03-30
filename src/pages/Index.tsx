
import { useState } from "react";
import StepOne from "@/components/StepOne";
import StepTwo from "@/components/StepTwo";
import StepThree from "@/components/StepThree";
import Results from "@/components/Results";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getHolidays } from "@/utils/holidays";
import { CalendarDays, ArrowRight } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [vacationDays, setVacationDays] = useState(25);
  const [selectedMode, setSelectedMode] = useState("balanced");
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [optimizedSchedule, setOptimizedSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNextStep = () => {
    // Validera innan vi går vidare
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
      toast({
        title: "Röda dagar hämtade",
        description: `${fetchedHolidays.length} helgdagar laddades för ${year}`,
      });
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
    // Simulera beräkning (kommer att ersättas med faktisk optimeringslogik)
    setTimeout(() => {
      // Enkelt exempel på formaterad data - detta kommer att ersättas med faktisk logik
      const dummySchedule = {
        totalDaysOff: vacationDays + holidays.length,
        mode: selectedMode,
        periods: [
          { 
            start: new Date(year, 3, 1), 
            end: new Date(year, 3, 6),
            days: 6, 
            vacationDaysUsed: 4,
            description: "Påskledighet"
          },
          { 
            start: new Date(year, 5, 20), 
            end: new Date(year, 5, 30),
            days: 11, 
            vacationDaysUsed: 8,
            description: "Midsommarledighet"
          },
          { 
            start: new Date(year, 11, 22), 
            end: new Date(year, 11, 31),
            days: 10, 
            vacationDaysUsed: 5,
            description: "Julledighet"
          }
        ]
      };
      
      setOptimizedSchedule(dummySchedule);
      setCurrentStep(4);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-teal-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">
              Semesteroptimeraren
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar.
          </p>
        </div>

        {currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${
                      currentStep >= step
                        ? step === 1 
                          ? "bg-teal-600" 
                          : step === 2 
                            ? "bg-blue-600" 
                            : "bg-amber-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-sm mt-2 text-gray-600">
                    {step === 1
                      ? "År & Dagar"
                      : step === 2
                      ? "Ledighetstyp"
                      : "Röda dagar"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full max-w-3xl mx-auto h-1 bg-gray-200 relative">
              <div
                className={`h-full transition-all duration-300 ${
                  currentStep === 1 
                    ? "bg-teal-600 w-[0%]" 
                    : currentStep === 2 
                      ? "bg-blue-600 w-[50%]" 
                      : "bg-amber-600 w-[100%]"
                }`}
              ></div>
            </div>
          </div>
        )}

        <Card className="mb-8 shadow-sm border border-gray-200 bg-white">
          <CardHeader className={currentStep === 4 ? "pb-0" : ""}>
            {currentStep < 4 && (
              <CardTitle className="text-xl text-gray-800">
                {currentStep === 1
                  ? "Steg 1: Välj år och antal semesterdagar"
                  : currentStep === 2
                  ? "Steg 2: Välj din önskade ledighetsfördelning"
                  : "Steg 3: Hantera röda dagar"}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <StepOne 
                year={year} 
                setYear={setYear} 
                vacationDays={vacationDays} 
                setVacationDays={setVacationDays} 
              />
            )}
            
            {currentStep === 2 && (
              <StepTwo 
                selectedMode={selectedMode} 
                setSelectedMode={setSelectedMode} 
              />
            )}
            
            {currentStep === 3 && (
              <StepThree 
                holidays={holidays} 
                setHolidays={setHolidays} 
                fetchHolidays={fetchHolidays} 
                year={year}
                isLoading={isLoading}
              />
            )}
            
            {currentStep === 4 && (
              <Results 
                schedule={optimizedSchedule} 
                year={year}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button 
              onClick={handlePrevStep} 
              variant="outline"
              disabled={isLoading}
              className="border-gray-300"
            >
              Tillbaka
            </Button>
          )}
          {currentStep < 4 && (
            <Button 
              onClick={handleNextStep} 
              className={`ml-auto ${
                currentStep === 1 
                  ? "bg-teal-600 hover:bg-teal-700" 
                  : currentStep === 2 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-amber-600 hover:bg-amber-700"
              }`}
              disabled={isLoading}
            >
              {currentStep === 3 ? "Generera schema" : (
                <>
                  Nästa steg <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          )}
          {currentStep === 4 && (
            <Button 
              onClick={() => setCurrentStep(1)} 
              className="ml-auto bg-gray-700 hover:bg-gray-800"
            >
              Börja om
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
