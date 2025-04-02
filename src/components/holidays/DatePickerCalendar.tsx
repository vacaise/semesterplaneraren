
import React from "react";
import { sv } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface DatePickerCalendarProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  year: number;
  onAddHoliday: () => void;
  onAddCompanyDay?: () => void;
  addingCompanyDay?: boolean;
}

export const DatePickerCalendar = ({ 
  selectedDate, 
  setSelectedDate, 
  year,
  onAddHoliday,
  onAddCompanyDay,
  addingCompanyDay = false
}: DatePickerCalendarProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="border rounded-lg overflow-hidden bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-800">Välj datum</h4>
      </div>
      <div className={`${isMobile ? 'flex justify-center' : ''}`}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
          locale={sv}
          defaultMonth={new Date(year, 0)}
          classNames={{
            head_cell: "text-xs font-medium text-gray-500",
            day: "h-9 w-9 text-sm p-0 font-normal aria-selected:opacity-100 aria-selected:bg-red-100 aria-selected:text-red-800 aria-selected:font-medium",
            day_today: "bg-red-50 text-red-800 font-medium",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100",
            months: isMobile ? "flex flex-col space-y-4" : "",
            month: isMobile ? "flex flex-col space-y-4" : "",
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <Button 
          onClick={onAddHoliday} 
          disabled={!selectedDate}
          className="w-full"
        >
          Lägg till röd dag
        </Button>
        {addingCompanyDay && onAddCompanyDay && (
          <Button 
            onClick={onAddCompanyDay} 
            disabled={!selectedDate}
            variant="secondary"
            className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800"
          >
            Lägg till klämdag
          </Button>
        )}
      </div>
    </div>
  );
};
