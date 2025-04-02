
import { useState } from "react";
import { format, isPast } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HolidaySelectorProps {
  holidays: Date[];
  setHolidays: (holidays: Date[]) => void;
  fetchHolidays: () => void;
  year: number;
  isLoading: boolean;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const HolidaySelector = ({ 
  holidays, 
  setHolidays, 
  fetchHolidays, 
  year, 
  isLoading,
  selectedDate,
  setSelectedDate
}: HolidaySelectorProps) => {
  const isMobile = useIsMobile();

  const addHoliday = () => {
    if (selectedDate) {
      // Check if date already exists or is in the past
      const exists = holidays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isPast(selectedDate)) {
        setHolidays([...holidays, selectedDate]);
        setSelectedDate(undefined);
      } else if (isPast(selectedDate)) {
        // Don't allow adding past dates
        setSelectedDate(undefined);
      }
    }
  };

  const removeHoliday = (dateToRemove: Date) => {
    setHolidays(
      holidays.filter(
        (date) => format(date, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
      )
    );
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
    <>
      <Button
        onClick={handleFetchHolidays}
        disabled={isLoading}
        variant="outline"
        className="w-full py-6 border-red-200 bg-red-50/50 hover:bg-red-50 text-red-800"
      >
        <MapPin className="h-5 w-5 mr-2" />
        {isLoading ? "Hämtar..." : "Identifiera röda dagar automatiskt"}
      </Button>

      <div className="border rounded-lg overflow-hidden bg-white p-4">
        <h4 className="font-medium text-gray-800 mb-4">Röda dagar ({holidays.length})</h4>
        {holidays.length > 0 ? (
          <ScrollArea className={`${isMobile ? 'h-[200px]' : 'h-[250px]'}`}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Dag</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...holidays].sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {isMobile 
                        ? format(date, "d MMM yyyy", { locale: sv }) 
                        : format(date, "d MMMM yyyy", { locale: sv })}
                    </TableCell>
                    <TableCell>{format(date, "EEEE", { locale: sv })}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHoliday(date)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className={`flex items-center justify-center ${isMobile ? 'h-[200px]' : 'h-[250px]'} bg-gray-50 rounded-md`}>
            <p className="text-gray-500">Inga röda dagar tillagda än</p>
          </div>
        )}
      </div>
    </>
  );
};
