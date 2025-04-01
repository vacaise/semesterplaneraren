
import React, { useState } from "react";
import StatisticCard from "@/components/StatisticCard";
import BreakSummaryCard from "@/components/BreakSummaryCard";
import BreakTypeExplanation from "@/components/BreakTypeExplanation";
import { MonthCalendarView } from "@/components/MonthCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CalendarDays, AlarmClock, RotateCcw, Home, Calendar, Download } from "lucide-react";
import { calculateEfficiency } from "@/utils/vacationOptimizer/calculators";
import { formatDateRange } from "@/utils/vacationOptimizer/helpers";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

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
  schedule: Schedule;
  year: number;
  holidays: Date[];
  resetToStart: () => void;
}

const Results = ({ schedule, year, holidays, resetToStart }: ResultsProps) => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Calculate efficiency
  const efficiency = calculateEfficiency(schedule.totalDaysOff, schedule.vacationDaysUsed);
  
  // Get mode display text
  const getModeDisplayText = (mode: string): string => {
    switch (mode) {
      case "balanced": return "Balanserad mix";
      case "longweekends": return "Långhelger";
      case "minibreaks": return "Miniledigheter";
      case "weeks": return "Veckor";
      case "extended": return "Långa semestrar";
      default: return "Anpassad";
    }
  };

  // Generate iCal file for export
  const exportToICal = () => {
    let iCalData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//vacai//SE",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    schedule.periods.forEach((period, index) => {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      
      // Format dates for iCal (YYYYMMDD)
      const formatICalDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
      };

      // Add one day to the end date for iCal (exclusive end date)
      const endDateIcal = new Date(endDate);
      endDateIcal.setDate(endDateIcal.getDate() + 1);

      // Create event
      iCalData = [
        ...iCalData,
        "BEGIN:VEVENT",
        `UID:vacai-${year}-${index}@vacai.se`,
        `DTSTAMP:${formatICalDate(new Date())}T000000Z`,
        `DTSTART;VALUE=DATE:${formatICalDate(startDate)}`,
        `DTEND;VALUE=DATE:${formatICalDate(endDateIcal)}`,
        `SUMMARY:${period.description}`,
        `DESCRIPTION:${period.days} dagar ledigt. ${period.vacationDaysNeeded} semesterdagar.`,
        "END:VEVENT"
      ];
    });

    iCalData.push("END:VCALENDAR");

    // Create and download the file
    const blob = new Blob([iCalData.join("\r\n")], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vacai-${year}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Kalender exporterad",
      description: "Din ledighetsplan har exporterats som en iCal-fil (.ics)",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center mb-4">
          <div className="bg-blue-50 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">
            ✓
          </div>
          <h2 className="text-xl font-medium ml-2 text-gray-800">Din optimerade semesterplan</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Baserat på dina val har vi optimerat din ledighet för {year} med {schedule.vacationDaysUsed} semesterdagar 
          i stil "{getModeDisplayText(schedule.mode)}".
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatisticCard
            title="Total ledighet"
            value={`${schedule.totalDaysOff} dagar`}
            description="Antal dagar du kommer vara ledig totalt"
            color="purple"
            icon={<Sparkles />}
          />
          
          <StatisticCard
            title="Semesterdagar"
            value={`${schedule.vacationDaysUsed}`}
            description="Antal semesterdagar som används"
            color="blue"
            icon={<Calendar />}
          />
          
          <StatisticCard
            title="Effektivitet"
            value={`${efficiency}x`}
            description="Lediga dagar per använd semesterdag"
            color="teal"
            icon={<AlarmClock />}
          />
        </div>
        
        <div className="flex gap-4 mb-6">
          <Button onClick={resetToStart} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Börja om
          </Button>
          
          <Button variant="outline" onClick={resetToStart} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Tillbaka till start
          </Button>
          
          <Button variant="outline" onClick={exportToICal} className="flex items-center gap-2 ml-auto">
            <Download className="h-4 w-4" />
            Exportera kalender
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Ledighetsperioder</TabsTrigger>
          <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6">
          <BreakTypeExplanation />
          
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Dina optimerade ledigheter</h3>
              <p className="text-gray-600">Nedan ser du alla planerade ledighetsperioder för {year}</p>
            </div>
            
            {schedule.periods.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  Inga ledighetsperioder hittades för resten av året.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedule.periods.map((period, index) => (
                  <BreakSummaryCard
                    key={index}
                    title={period.description}
                    startDate={new Date(period.start)}
                    endDate={new Date(period.end)}
                    totalDays={period.days}
                    vacationDaysNeeded={period.vacationDaysNeeded}
                    type={period.type}
                    holidays={holidays}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar">
          <MonthCalendarView 
            schedule={schedule}
            year={year}
            holidays={holidays}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results;
