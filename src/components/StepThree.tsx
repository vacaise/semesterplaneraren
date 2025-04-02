
import { useState, useEffect } from "react";
import { format, isPast, isWeekend } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CalendarDays, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Plus
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [customHolidayName, setCustomHolidayName] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const today = new Date();

  const addHoliday = () => {
    if (selectedDate) {
      // Check if date already exists or is in the past
      const exists = holidays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isPast(selectedDate)) {
        setHolidays([...holidays, selectedDate]);
        setSelectedDate(undefined);
        toast({
          title: "Röd dag tillagd",
          description: `${format(selectedDate, "d MMMM yyyy", { locale: sv })} har lagts till som röd dag.`,
        });
      } else if (isPast(selectedDate)) {
        // Don't allow adding past dates
        toast({
          title: "Ogiltigt datum",
          description: "Du kan inte lägga till datum i det förflutna.",
          variant: "destructive",
        });
        setSelectedDate(undefined);
      } else {
        toast({
          title: "Datum finns redan",
          description: "Detta datum är redan markerat som röd dag.",
          variant: "destructive",
        });
        setSelectedDate(undefined);
      }
    }
  };

  const addCustomHoliday = () => {
    if (selectedDate && customHolidayName.trim()) {
      // Check if date already exists or is in the past
      const exists = holidays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isPast(selectedDate)) {
        setHolidays([...holidays, selectedDate]);
        toast({
          title: "Klämdag tillagd",
          description: `${customHolidayName} (${format(selectedDate, "d MMMM yyyy", { locale: sv })}) har lagts till.`,
        });
      } else if (exists) {
        toast({
          title: "Datum finns redan",
          description: "Detta datum är redan markerat som röd dag.",
          variant: "destructive",
        });
      } else if (isPast(selectedDate)) {
        toast({
          title: "Ogiltigt datum",
          description: "Du kan inte lägga till datum i det förflutna.",
          variant: "destructive",
        });
      }
      
      setSelectedDate(undefined);
      setCustomHolidayName("");
      setShowAddDialog(false);
    }
  };

  const removeHoliday = (dateToRemove: Date) => {
    setHolidays(
      holidays.filter(
        (date) => format(date, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
      )
    );
    
    toast({
      title: "Röd dag borttagen",
      description: `${format(dateToRemove, "d MMMM yyyy", { locale: sv })} har tagits bort.`,
    });
  };

  const handleFetchHolidays = () => {
    fetchHolidays();
  };

  const isDayHighlighted = (day: Date) => {
    return holidays.some(holiday => 
      format(holiday, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    );
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

      <Button
        onClick={handleFetchHolidays}
        disabled={isLoading}
        variant="outline"
        className="w-full py-6 border-red-200 bg-red-50/50 hover:bg-red-50 text-red-800"
      >
        <MapPin className="h-5 w-5 mr-2" />
        {isLoading ? "Hämtar..." : "Identifiera röda dagar automatiskt"}
      </Button>

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 gap-6'}`}>
        <div className="border rounded-lg overflow-hidden bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-800">Välj datum</h4>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Lägg till klämdag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Lägg till klämdag eller speciell dag</DialogTitle>
                  <DialogDescription>
                    Välj ett datum och ange ett namn för denna speciella dag.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md"
                      locale={sv}
                      defaultMonth={new Date(year, 0)}
                      modifiers={{
                        highlighted: isDayHighlighted
                      }}
                      modifiersClassNames={{
                        highlighted: "bg-red-100 text-red-800 font-semibold"
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="holidayName">Namn på dagen</Label>
                    <Input
                      id="holidayName"
                      value={customHolidayName}
                      onChange={(e) => setCustomHolidayName(e.target.value)}
                      placeholder="t.ex. Klämdag, Företagsdag etc."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Avbryt
                  </Button>
                  <Button 
                    onClick={addCustomHoliday} 
                    disabled={!selectedDate || !customHolidayName.trim()}
                  >
                    Lägg till
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className={`${isMobile ? 'flex justify-center' : ''}`}>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              locale={sv}
              defaultMonth={new Date(year, 0)}
              modifiers={{
                highlighted: isDayHighlighted
              }}
              modifiersClassNames={{
                highlighted: "bg-red-100 text-red-800 font-semibold"
              }}
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
          <Button 
            onClick={addHoliday} 
            disabled={!selectedDate}
            className="w-full mt-4"
          >
            Lägg till röd dag
          </Button>
        </div>

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
