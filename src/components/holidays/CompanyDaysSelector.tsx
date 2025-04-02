
import { useState } from "react";
import { format, isPast } from "date-fns";
import { sv } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Briefcase } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";

interface CompanyDaysSelectorProps {
  companyDays: Date[];
  setCompanyDays: (companyDays: Date[]) => void;
  holidays: Date[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

export const CompanyDaysSelector = ({ 
  companyDays,
  setCompanyDays,
  holidays,
  selectedDate,
  setSelectedDate
}: CompanyDaysSelectorProps) => {
  const [isCompanyDaysOpen, setIsCompanyDaysOpen] = useState(false);
  const [addingCompanyDay, setAddingCompanyDay] = useState(false);
  const isMobile = useIsMobile();

  const addCompanyDay = () => {
    if (selectedDate) {
      // Check if date already exists or is in the past
      const exists = companyDays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      const isHoliday = holidays.some(
        (date) => format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );
      
      if (!exists && !isHoliday && !isPast(selectedDate)) {
        setCompanyDays([...companyDays, selectedDate]);
        setSelectedDate(undefined);
      } else if (isPast(selectedDate)) {
        // Don't allow adding past dates
        setSelectedDate(undefined);
      }
    }
  };

  const removeCompanyDay = (dateToRemove: Date) => {
    setCompanyDays(
      companyDays.filter(
        (date) => format(date, "yyyy-MM-dd") !== format(dateToRemove, "yyyy-MM-dd")
      )
    );
  };

  return (
    <Collapsible
      open={isCompanyDaysOpen}
      onOpenChange={setIsCompanyDaysOpen}
      className="border rounded-lg overflow-hidden bg-white"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between p-4 font-medium text-gray-800 hover:bg-purple-50"
        >
          <div className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
            Förväntade klämdagar och företagsledighet
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${isCompanyDaysOpen ? "rotate-90" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0">
        <p className="text-gray-600 mb-4">
          Lägg till klämdagar och företagsspecifika lediga dagar som inte räknas som officiella röda dagar.
          Dessa dagar kommer behandlas som helgdagar när semesterperioder beräknas.
        </p>
        
        <div className="flex mb-4">
          <Button
            variant="outline"
            onClick={() => setAddingCompanyDay(!addingCompanyDay)}
            className={`w-full py-2 border-purple-200 ${addingCompanyDay ? 'bg-purple-100' : 'bg-purple-50/50'} hover:bg-purple-50 text-purple-800`}
          >
            {addingCompanyDay ? "Stäng datumväljare" : "Lägg till klämdag"}
          </Button>
        </div>

        <div className="bg-white">
          <h4 className="font-medium text-gray-800 mb-4">Klämdagar ({companyDays.length})</h4>
          {companyDays.length > 0 ? (
            <ScrollArea className="h-[200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Dag</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...companyDays].sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
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
                          onClick={() => removeCompanyDay(date)}
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
            <div className={`flex items-center justify-center h-[200px] bg-gray-50 rounded-md`}>
              <p className="text-gray-500">Inga klämdagar tillagda än</p>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
