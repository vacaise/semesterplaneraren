
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Calendar, Download, ArrowLeft, Award, AlarmClock, CalendarDays } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OptimizationResult } from "@/utils/calculators";
import MonthlyCalendarView from "@/components/MonthlyCalendarView";

interface VacationResultsProps {
  result: OptimizationResult | null;
  year: number;
  holidays: Date[];
  resetForm: () => void;
}

const VacationResults = ({ result, year, holidays, resetForm }: VacationResultsProps) => {
  if (!result) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-gray-500">Ingen semesterplan genererad ännu.</p>
        </CardContent>
      </Card>
    );
  }
  
  const getModeDisplayName = (mode: string): string => {
    switch (mode) {
      case "balanced": return "Balanserad mix";
      case "longweekends": return "Långhelger";
      case "minibreaks": return "Miniledigheter";
      case "weeks": return "Veckor";
      case "extended": return "Långa semestrar";
      default: return mode;
    }
  };
  
  const getTypeDisplayName = (type: string): string => {
    switch (type) {
      case "bridge": return "Klämdag";
      case "longWeekend": return "Långhelg";
      case "week": return "Vecka";
      case "extended": return "Längre semester";
      case "single": return "Enstaka dag";
      default: return type;
    }
  };
  
  const getBadgeColor = (type: string): string => {
    switch (type) {
      case "bridge": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "longWeekend": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "week": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "extended": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "single": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const exportToCalendar = () => {
    let iCalData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Semesteroptimering//SE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    result.periods.forEach((period, index) => {
      const formatIcalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };
      
      const endDateAdjusted = new Date(period.end);
      endDateAdjusted.setDate(endDateAdjusted.getDate() + 1);

      iCalData = [
        ...iCalData,
        "BEGIN:VEVENT",
        `UID:vacationopt-${year}-${index}@semesteroptimering`,
        `DTSTAMP:${formatIcalDate(new Date())}T000000Z`,
        `DTSTART;VALUE=DATE:${formatIcalDate(period.start)}`,
        `DTEND;VALUE=DATE:${formatIcalDate(endDateAdjusted)}`,
        `SUMMARY:${period.description}`,
        `DESCRIPTION:${period.totalDays} dagar ledigt. ${period.vacationDaysUsed} semesterdagar.`,
        "END:VEVENT"
      ];
    });

    iCalData.push("END:VCALENDAR");

    const blob = new Blob([iCalData.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `semesterplan-${year}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h2 className="text-2xl font-bold mb-2">Din optimerade semesterplan</h2>
        <p className="text-gray-600">
          Baserat på dina val har vi optimerat din ledighet för {year} med {result.vacationDaysUsed} semesterdagar
          i stil "{getModeDisplayName(result.mode)}".
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total ledighet</p>
                  <h3 className="text-2xl font-semibold">{result.totalDaysOff} dagar</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Semesterdagar</p>
                  <h3 className="text-2xl font-semibold">{result.vacationDaysUsed}</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <AlarmClock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effektivitet</p>
                  <h3 className="text-2xl font-semibold">{result.efficiency}x</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={resetForm} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka
        </Button>
        
        <Button onClick={exportToCalendar}>
          <Download className="mr-2 h-4 w-4" />
          Exportera till kalender
        </Button>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Kalender</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ledighetsperioder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead className="hidden md:table-cell">Ledighet</TableHead>
                      <TableHead>Semesterdagar</TableHead>
                      <TableHead className="hidden md:table-cell">Typ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.periods.map((period, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{period.description}</TableCell>
                        <TableCell>
                          {format(period.start, 'd MMM', { locale: sv })} - {format(period.end, 'd MMM', { locale: sv })}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{period.totalDays} dagar</TableCell>
                        <TableCell>{period.vacationDaysUsed}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className={getBadgeColor(period.type)}>
                            {getTypeDisplayName(period.type)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Kalendervy</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyCalendarView 
                periods={result.periods} 
                holidays={holidays}
                year={year}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VacationResults;
