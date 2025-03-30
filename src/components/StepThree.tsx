
import { useState } from "react";
import { format } from "date-fns";
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

interface StepThreeProps {
  holidays: Date[];
  setHolidays: (holidays: Date[]) => void;
  fetchHolidays: () => void;
  year: number;
  isLoading: boolean;
}

const StepThree = ({ 
  holidays, 
  setHolidays, 
  fetchHolidays, 
  year,
  isLoading 
}: StepThreeProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const addHoliday = () => {
    if (selectedDate) {
      // Check if date already exists
      const exists = holidays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists) {
        setHolidays([...holidays, selectedDate]);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Röda dagar för {year}</h3>
        <Button 
          onClick={fetchHolidays} 
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? "Hämtar..." : "Hämta svenska röda dagar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-2">Välj datum</h4>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={sv}
              year={year}
            />
          </div>
          <Button 
            onClick={addHoliday} 
            disabled={!selectedDate}
            className="w-full"
          >
            Lägg till röd dag
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">Röda dagar ({holidays.length})</h4>
          {holidays.length > 0 ? (
            <ScrollArea className="h-[250px] rounded-md border">
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
                      <TableCell>{format(date, "d MMMM yyyy", { locale: sv })}</TableCell>
                      <TableCell>{format(date, "EEEE", { locale: sv })}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHoliday(date)}
                          className="h-8 w-8 p-0"
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
            <div className="flex items-center justify-center h-[250px] border rounded-md">
              <p className="text-gray-500">Inga röda dagar tillagda än</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-md">
        <h3 className="font-medium text-amber-800 mb-2">Observera</h3>
        <p className="text-sm text-gray-600">
          Röda dagar kan variera mellan år. Automatisk funktion för att hämta svenska röda dagar finns, men verifiera alltid att datumen stämmer.
        </p>
      </div>
    </div>
  );
};

export default StepThree;
