
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarDays, Calendar, ArrowRight, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VacationFormProps {
  year: number;
  setYear: (year: number) => void;
  vacationDays: number;
  setVacationDays: (days: number) => void;
  mode: string;
  setMode: (mode: string) => void;
  holidays: Date[];
  loadHolidays: () => void;
  step: number;
  setStep: (step: number) => void;
  generateVacationPlan: () => void;
  isLoading: boolean;
}

const VacationForm = ({
  year,
  setYear,
  vacationDays,
  setVacationDays,
  mode,
  setMode,
  holidays,
  loadHolidays,
  step,
  setStep,
  generateVacationPlan,
  isLoading
}: VacationFormProps) => {
  const [showHolidays, setShowHolidays] = useState<boolean>(false);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  
  useEffect(() => {
    if (step === 2 && holidays.length === 0) {
      loadHolidays();
    }
  }, [step]);
  
  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      generateVacationPlan();
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  const handleVacationDaysChange = (value: number) => {
    // Ensure the value is within valid range (1-40)
    const validatedValue = Math.max(1, Math.min(40, value));
    setVacationDays(validatedValue);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex mb-6 relative">
        <div className="w-full flex justify-between items-center">
          <div 
            className={`flex-1 text-center ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
            aria-current={step === 1 ? 'step' : undefined}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${step >= 1 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {step > 1 ? <Check size={18} /> : 1}
            </span>
            <span className="mt-2 block text-sm">Dina uppgifter</span>
          </div>
          
          <div className="w-full max-w-xs h-0.5 bg-gray-200 relative top-5"></div>
          
          <div 
            className={`flex-1 text-center ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
            aria-current={step === 2 ? 'step' : undefined}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${step >= 2 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {step > 2 ? <Check size={18} /> : 2}
            </span>
            <span className="mt-2 block text-sm">Röda dagar</span>
          </div>
          
          <div className="w-full max-w-xs h-0.5 bg-gray-200 relative top-5"></div>
          
          <div 
            className={`flex-1 text-center ${step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
            aria-current={step === 3 ? 'step' : undefined}
          >
            <span className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${step >= 3 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              3
            </span>
            <span className="mt-2 block text-sm">Resultat</span>
          </div>
        </div>
      </div>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <CalendarDays className="mr-2 h-5 w-5 text-blue-500" />
              Välj år och antal semesterdagar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="year" className="mb-2 block text-sm font-medium">Vilket år vill du planera semestern för?</Label>
              <Select
                value={year.toString()}
                onValueChange={(value) => setYear(parseInt(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Välj år" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vacationDays" className="mb-2 block text-sm font-medium">Antal semesterdagar ({vacationDays})</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Slider
                  id="vacationDays"
                  max={40}
                  min={1}
                  step={1}
                  value={[vacationDays]}
                  onValueChange={(vals) => handleVacationDaysChange(vals[0])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  id="vacationDaysInput"
                  value={vacationDays}
                  onChange={(e) => handleVacationDaysChange(Number(e.target.value))}
                  className="w-full sm:w-24"
                  min={1}
                  max={40}
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block text-sm font-medium">Välj typ av optimering</Label>
              <RadioGroup value={mode} onValueChange={setMode} className="space-y-3">
                <div className={`p-4 rounded-lg border transition-all ${mode === 'balanced' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="balanced" />
                    <Label htmlFor="balanced" className="font-medium">Balanserad mix</Label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">En smart blandning av kortare ledigheter och längre semestrar</p>
                </div>
                
                <div className={`p-4 rounded-lg border transition-all ${mode === 'longweekends' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="longweekends" id="longweekends" />
                    <Label htmlFor="longweekends" className="font-medium">Långhelger</Label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Fler 3-4 dagars helger genom året</p>
                </div>
                
                <div className={`p-4 rounded-lg border transition-all ${mode === 'minibreaks' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minibreaks" id="minibreaks" />
                    <Label htmlFor="minibreaks" className="font-medium">Miniledigheter</Label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Flera kortare 5-6 dagars ledigheter utspridda över året</p>
                </div>
                
                <div className={`p-4 rounded-lg border transition-all ${mode === 'weeks' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weeks" id="weeks" />
                    <Label htmlFor="weeks" className="font-medium">Veckor</Label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Fokuserar på 7-9 dagars ledighet för längre perioder</p>
                </div>
                
                <div className={`p-4 rounded-lg border transition-all ${mode === 'extended' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extended" id="extended" />
                    <Label htmlFor="extended" className="font-medium">Långa semestrar</Label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Längre 10-15 dagars ledigheter för djupare avkoppling</p>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleNextStep} disabled={vacationDays < 1}>
              Fortsätt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-red-500" />
              Röda dagar för {year}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Nedan visas röda dagar för {year}. Du kan fortsätta med dessa röda dagar eller ladda om dem om du vill.
              </p>
                            
              <div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={loadHolidays} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Laddar röda dagar...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Ladda röda dagar för {year}
                    </>
                  )}
                </Button>
              </div>
              
              <div className="mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowHolidays(!showHolidays)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showHolidays ? 'Dölj röda dagar' : 'Visa alla röda dagar'}
                </button>
                
                {showHolidays && (
                  <div className="mt-4 border rounded-md p-4 space-y-1 max-h-60 overflow-y-auto">
                    {holidays.length === 0 ? (
                      <p className="text-gray-500">Inga röda dagar laddade än.</p>
                    ) : (
                      holidays.sort((a, b) => a.getTime() - b.getTime()).map((holiday, index) => (
                        <div key={index} className="flex justify-between text-sm py-1">
                          <span>{format(holiday, 'EEEE', { locale: sv })}</span>
                          <span className="font-medium">{format(holiday, 'd MMMM yyyy', { locale: sv })}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={handlePreviousStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tillbaka
            </Button>
            <Button onClick={handleNextStep} disabled={isLoading || holidays.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bearbetar...
                </>
              ) : (
                <>
                  Generera plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default VacationForm;
