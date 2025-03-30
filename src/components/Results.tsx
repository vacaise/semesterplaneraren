
import { format, addDays, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysUsed: number;
  description: string;
}

interface Schedule {
  totalDaysOff: number;
  mode: string;
  periods: Period[];
}

interface ResultsProps {
  schedule: Schedule | null;
  year: number;
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

const Results = ({ schedule, year }: ResultsProps) => {
  if (!schedule) {
    return <div>Inget schema har genererats än.</div>;
  }

  const totalVacationDays = schedule.periods.reduce(
    (total, period) => total + period.vacationDaysUsed, 
    0
  );
  
  const totalDaysOff = schedule.periods.reduce(
    (total, period) => total + period.days, 
    0
  );

  const efficiency = (totalDaysOff / totalVacationDays).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-800">{totalVacationDays}</h3>
              <p className="text-sm text-gray-600">Semesterdagar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800">{totalDaysOff}</h3>
              <p className="text-sm text-gray-600">Totalt lediga dagar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-purple-800">
                {efficiency}x
              </h3>
              <p className="text-sm text-gray-600">Effektivitet</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">
          Ditt optimerade schema för {year}: {getModeTitle(schedule.mode)}
        </h3>
        
        <ScrollArea className="h-[350px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Längd</TableHead>
                <TableHead>Semesterdagar</TableHead>
                <TableHead>Beskrivning</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.periods.map((period, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      <span>
                        {format(period.start, "d MMM", { locale: sv })} - {format(period.end, "d MMM", { locale: sv })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{period.days} dagar</TableCell>
                  <TableCell>{period.vacationDaysUsed} dagar</TableCell>
                  <TableCell>{period.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
        <p className="text-sm text-gray-600">
          Med {totalVacationDays} semesterdagar får du {totalDaysOff} dagar ledigt - det är {efficiency}x mer ledighet än antalet semesterdagar du använder!
        </p>
      </div>
    </div>
  );
};

export default Results;
