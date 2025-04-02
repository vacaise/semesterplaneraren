
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
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

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
      const exists = holidays.some(
        date => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      const isCompanyDay = companyDays.some(
        date => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isCompanyDay && !isPast(selectedDate)) {
        setHolidays([...holidays, selectedDate]);
        setSelectedDate(undefined);
      } else if (isPast(selectedDate)) {
        setSelectedDate(undefined);
      }
    }
  };

  const handleFetchHolidays = () => {
    fetchHolidays();
    
    // Scroll to navigation buttons after a short delay to allow for holidays to be fetched
    setTimeout(() => {
      const navButtons = document.querySelector("#main-container + div");
      if (navButtons) {
        navButtons.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 500);
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

      {/* Knapp för att identifiera röda dagar automatiskt */}
      <Button
        onClick={handleFetchHolidays}
        disabled={isLoading}
        variant="outline"
        className="w-full py-6 border-red-200 bg-red-50/50 hover:bg-red-50 text-red-800"
      >
        <MapPin className="h-5 w-5 mr-2" />
        {isLoading ? "Hämtar..." : "Identifiera röda dagar automatiskt"}
      </Button>

      {/* Datumväljare och röda dagar sida vid sida */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
        {/* Datumväljare till vänster */}
        <DatePickerCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          year={year}
          onAddHoliday={handleAddHoliday}
          onAddCompanyDay={() => {}}
          addingCompanyDay={false}
          holidays={holidays}
          companyDays={companyDays}
        />

        {/* Röda dagar till höger */}
        <div className="border rounded-lg overflow-hidden bg-white p-4">
          <h4 className="font-medium text-gray-800 mb-4">Röda dagar ({holidays.length})</h4>
          <HolidaySelector
            holidays={holidays}
            setHolidays={setHolidays}
            fetchHolidays={fetchHolidays}
            year={year}
            isLoading={isLoading}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            hideAutoButton={true} // Hide the auto button since we've moved it to the top
          />
        </div>
      </div>

      {/* Klämdagar som ett collapsible element */}
      <CompanyDaysSelector
        companyDays={companyDays}
        setCompanyDays={setCompanyDays}
        holidays={holidays}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

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
