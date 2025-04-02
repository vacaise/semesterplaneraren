
import { useState } from "react";
import { format, isPast } from "date-fns";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { DatePickerCalendar } from "@/components/holidays/DatePickerCalendar";
import { HolidaySelector } from "@/components/holidays/HolidaySelector";
import { CompanyDaysSelector } from "@/components/holidays/CompanyDaysSelector";

interface StepThreeProps {
  holidays: Date[];
  setHolidays: (holidays: Date[]) => void;
  fetchHolidays: () => void;
  year: number;
  isLoading: boolean;
  companyDays: Date[];
  setCompanyDays: (companyDays: Date[]) => void;
}

const StepThree = ({ 
  holidays, 
  setHolidays, 
  fetchHolidays, 
  year,
  isLoading,
  companyDays,
  setCompanyDays 
}: StepThreeProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [addingCompanyDay, setAddingCompanyDay] = useState(false);
  const isMobile = useIsMobile();

  const handleAddHoliday = () => {
    if (selectedDate) {
      // Delegate to the HolidaySelector component
      const exists = holidays.some(
        date => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isPast(selectedDate)) {
        setHolidays([...holidays, selectedDate]);
        setSelectedDate(undefined);
      } else if (isPast(selectedDate)) {
        setSelectedDate(undefined);
      }
    }
  };

  const handleAddCompanyDay = () => {
    if (selectedDate) {
      // Delegate to the CompanyDaysSelector component
      const exists = companyDays.some(
        date => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      const isHoliday = holidays.some(
        date => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isHoliday && !isPast(selectedDate)) {
        setCompanyDays([...companyDays, selectedDate]);
        setSelectedDate(undefined);
      } else if (isPast(selectedDate)) {
        setSelectedDate(undefined);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-amber-50 text-amber-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">3</div>
        <h3 className="text-xl font-medium text-gray-800">Röda dagar</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Info className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Lägg till röda dagar för {year} genom att använda automatisk identifiering eller välja datum från kalendern.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <HolidaySelector
        holidays={holidays}
        setHolidays={setHolidays}
        fetchHolidays={fetchHolidays}
        year={year}
        isLoading={isLoading}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
        <DatePickerCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          year={year}
          onAddHoliday={handleAddHoliday}
          onAddCompanyDay={handleAddCompanyDay}
          addingCompanyDay={addingCompanyDay}
        />

        <CompanyDaysSelector
          companyDays={companyDays}
          setCompanyDays={setCompanyDays}
          holidays={holidays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      <div className="bg-red-50 p-4 rounded-md border border-red-100">
        <h3 className="font-medium text-red-800 mb-2">Observera</h3>
        <p className="text-sm text-gray-600">
          Röda dagar kan variera mellan år. Automatisk funktion för att hämta svenska röda dagar finns, men verifiera alltid att datumen stämmer.
        </p>
      </div>
    </div>
  );
};

export default StepThree;
