
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { CalendarDays, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepOneProps {
  year: number;
  setYear: (year: number) => void;
  vacationDays: number;
  setVacationDays: (days: number) => void;
}

const StepOne = ({
  year,
  setYear,
  vacationDays,
  setVacationDays
}: StepOneProps) => {
  const currentYear = new Date().getFullYear();
  // Skapa en array med år från nuvarande år till 2030
  const years = Array.from({
    length: 2030 - currentYear + 1
  }, (_, i) => currentYear + i);
  const isMobile = useIsMobile();
  
  // Ensure vacation days are valid (1-50)
  const handleVacationDaysChange = (value: number) => {
    const clampedValue = Math.min(Math.max(Math.round(value), 1), 50);
    setVacationDays(clampedValue);
  };
  
  return <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-teal-50 text-teal-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">1</div>
        <h2 className="text-xl font-medium text-gray-800">Ange dina semesterdagar</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600" aria-label="Information om semesterdagar">
                <Info className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Ange hur många semesterdagar du har tillgängliga för året.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-4 md:p-6 rounded-lg border border-gray-100 bg-white">
        <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex justify-between items-center'} mb-4`}>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-teal-600" aria-hidden="true" />
            <h3 className="font-medium text-lg text-gray-800">Planera ditt år</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-gray-600">År:</span>
            <Select value={year.toString()} onValueChange={value => setYear(parseInt(value))} aria-label="Välj år">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={year.toString()} />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-gray-600 mb-6">Säg hur många betalda semesterdagar du har tillgängliga. Appen kommer att optimera deras användning från nu till slutet av året.</p>

        <div className="space-y-4">
          <Label htmlFor="vacationDays" className="text-gray-700 text-base">Antal semesterdagar</Label>
          <div className={`${isMobile ? 'flex flex-col gap-3' : 'flex items-center space-x-4'}`}>
            <Slider 
              id="vacationDays" 
              defaultValue={[vacationDays]} 
              max={50} 
              min={1} 
              step={1} 
              onValueChange={val => handleVacationDaysChange(val[0])}
              className="flex-1" 
              aria-label="Välj antal semesterdagar" 
            />
            <Input 
              type="number" 
              id="vacationDaysInput" 
              value={vacationDays} 
              onChange={e => handleVacationDaysChange(Number(e.target.value))} 
              className={`${isMobile ? 'w-full' : 'w-24'}`} 
              min={1} 
              max={50} 
              placeholder="Ange dagar"
              aria-label="Ange antal semesterdagar" 
            />
          </div>
        </div>
      </div>
    </div>;
};

export default StepOne;
