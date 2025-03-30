
import { format, addDays, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, PlaneTakeoff, Building2, Clock } from "lucide-react";
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

const getBreakType = (days: number) => {
  if (days <= 4) return { type: "Long Weekend", class: "bg-green-100 text-green-800" };
  if (days <= 6) return { type: "Mini Break", class: "bg-amber-100 text-amber-800" };
  if (days <= 9) return { type: "Week Break", class: "bg-blue-100 text-blue-800" };
  return { type: "Extended Break", class: "bg-purple-100 text-purple-800" };
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
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 text-purple-800 h-10 w-10 rounded-full flex items-center justify-center">
          <Building2 className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-medium text-gray-800">Ledighetsdetaljer</h3>
        <div className="ml-auto bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
          {schedule.periods.length} ledigheter planerade
        </div>
      </div>

      <div className="p-4 border border-purple-100 rounded-lg bg-purple-50/50">
        <h4 className="text-gray-800 font-medium mb-3">Förstå dina ledighetstyper</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-white rounded-md">
                <PlaneTakeoff className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h5 className="font-medium text-green-800">Långhelg</h5>
                <p className="text-sm text-gray-600">3-4 dagar ledigt runt en helg</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-white rounded-md">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h5 className="font-medium text-amber-800">Miniledighet</h5>
                <p className="text-sm text-gray-600">5-6 dagar för en snabb getaway</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-white rounded-md">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h5 className="font-medium text-blue-800">Veckoledighet</h5>
                <p className="text-sm text-gray-600">7-9 dagar för en ordentlig semester</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-white rounded-md">
                <PlaneTakeoff className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h5 className="font-medium text-purple-800">Längre ledighet</h5>
                <p className="text-sm text-gray-600">10-15 dagar för en utökad semester</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-800">{totalVacationDays}</h3>
              <p className="text-sm text-gray-600">Semesterdagar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-green-800">{totalDaysOff}</h3>
              <p className="text-sm text-gray-600">Totalt lediga dagar</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
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
        <h3 className="text-lg font-medium mb-3">
          Dina optimerade ledigheter för {year}
        </h3>
        <p className="text-gray-600 mb-4">
          Baserat på din preferens: {getModeTitle(schedule.mode)}
        </p>
        
        <div className="space-y-4">
          {schedule.periods.map((period, index) => {
            const breakStyle = getBreakType(period.days);
            return (
              <div key={index} className="border rounded-lg overflow-hidden bg-white">
                <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
                  <div>
                    <h4 className="font-medium">
                      {format(period.start, "d MMM", { locale: sv })} - {format(period.end, "d MMM", { locale: sv })}
                    </h4>
                    <p className="text-sm text-gray-600">{period.days} dagar ledigt</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm ${breakStyle.class}`}>
                    {breakStyle.type}
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-pink-100 rounded-md">
                      <Calendar className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Semesterdagar</div>
                      <div className="font-medium">{period.vacationDaysUsed}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-md">
                      <Calendar className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Röda dagar</div>
                      <div className="font-medium">2</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-md">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Helger</div>
                      <div className="font-medium">2</div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2 bg-gray-50">
                  <div className="text-sm text-gray-600">{period.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
        <p className="text-sm text-gray-600">
          Med {totalVacationDays} semesterdagar får du {totalDaysOff} dagar ledigt - det är {efficiency}x mer ledighet än antalet semesterdagar du använder!
        </p>
      </div>
    </div>
  );
};

export default Results;
