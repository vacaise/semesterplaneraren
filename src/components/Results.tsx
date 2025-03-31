import { format, addDays, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, PlaneTakeoff, Building2, Clock } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BreakSummaryCard } from "@/components/BreakSummaryCard";
import { MonthCalendarView } from "@/components/MonthCalendarView";
import { BreakTypeExplanation } from "@/components/BreakTypeExplanation";
import { StatisticCard } from "@/components/StatisticCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface Schedule {
  totalDaysOff: number;
  vacationDaysUsed: number;
  mode: string;
  periods: Period[];
}

interface ResultsProps {
  schedule: Schedule | null;
  year: number;
  holidays?: Date[];
}

const getModeTitle = (mode: string) => {
  switch (mode) {
    case "balanced": return "Balanserad mix";
    case "longweekends": return "Långhelger";
    case "minibreaks": return "Miniledigheter";
    case "weeks": return "Veckor";
    case "extended": return "Långa semestrar";
    default: return mode;
  }
};

const Results = ({ schedule, year, holidays = [] }: ResultsProps) => {
  const isMobile = useIsMobile();
  
  if (!schedule) {
    return <div>Inget schema har genererats än.</div>;
  }

  // Count total days from all periods to verify
  let totalDaysFromPeriods = 0;
  schedule.periods.forEach(period => {
    totalDaysFromPeriods += period.days;
  });
  
  console.log("Total days counted from periods:", totalDaysFromPeriods);
  console.log("Total days off reported from schedule:", schedule.totalDaysOff);

  const totalVacationDays = schedule.vacationDaysUsed || 0;
  const totalDaysOff = schedule.totalDaysOff || 0;

  // Make sure totalDaysOff and totalVacationDays are valid numbers
  const validTotalDaysOff = isNaN(totalDaysOff) ? 0 : totalDaysOff;
  const validTotalVacationDays = (totalVacationDays <= 0 || isNaN(totalVacationDays)) ? 1 : totalVacationDays;
  
  // Calculate efficiency with valid numbers and format to 2 decimal places
  const efficiency = (validTotalDaysOff / validTotalVacationDays).toFixed(2);
    
  // Sort periods chronologically by start date
  const sortedPeriods = [...schedule.periods].sort((a, b) => {
    const dateA = new Date(a.start);
    const dateB = new Date(b.start);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 text-purple-800 h-10 w-10 rounded-full flex items-center justify-center">
          <Building2 className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-medium text-gray-800">Ledighetsdetaljer</h3>
        <div className={`${isMobile ? 'hidden' : 'ml-auto'} bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium`}>
          {sortedPeriods.length} ledigheter planerade
        </div>
      </div>

      {isMobile && (
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium text-center">
          {sortedPeriods.length} ledigheter planerade
        </div>
      )}

      <BreakTypeExplanation />

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-3 gap-4'}`}>
        <StatisticCard 
          value={totalVacationDays} 
          label="Semesterdagar" 
          bgColor="bg-blue-50" 
          borderColor="border-blue-100" 
          textColor="text-blue-800" 
        />
        
        <StatisticCard 
          value={validTotalDaysOff} 
          label="Totalt lediga dagar" 
          bgColor="bg-green-50" 
          borderColor="border-green-100" 
          textColor="text-green-800" 
        />
        
        <StatisticCard 
          value={`${efficiency}x`} 
          label="Effektivitet" 
          bgColor="bg-purple-50" 
          borderColor="border-purple-100" 
          textColor="text-purple-800" 
        />
      </div>

      <Tabs defaultValue="periods" className="w-full">
        <TabsList className={`grid w-full grid-cols-2`}>
          <TabsTrigger value="periods">Ledighetsperioder</TabsTrigger>
          <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="periods" className="space-y-4">
          <h3 className="text-lg font-medium mb-3">
            Dina optimerade ledigheter för {year}
          </h3>
          <p className="text-gray-600 mb-4">
            Baserat på din preferens: {getModeTitle(schedule.mode)}
          </p>
          
          <div className="space-y-4">
            {sortedPeriods.map((period, index) => (
              <BreakSummaryCard key={index} period={period} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <MonthCalendarView schedule={{...schedule, periods: sortedPeriods}} year={year} holidays={holidays} />
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
        <p className="text-sm text-gray-600">
          Med {totalVacationDays} semesterdagar får du {validTotalDaysOff} dagar ledigt - det är {efficiency}x mer ledighet än antalet semesterdagar du använder!
        </p>
      </div>
    </div>
  );
};

export default Results;
