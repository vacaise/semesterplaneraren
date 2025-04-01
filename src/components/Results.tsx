
import React, { useState } from "react";
import StatisticCard from "@/components/StatisticCard";
import BreakSummaryCard from "@/components/BreakSummaryCard";
import BreakTypeExplanation from "@/components/BreakTypeExplanation";
import { MonthCalendarView } from "@/components/MonthCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, CalendarDays, AlarmClock } from "lucide-react";
import { calculateEfficiency } from "@/utils/vacationOptimizer/calculators";
import { formatDateRange } from "@/utils/vacationOptimizer/helpers";
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
  schedule: Schedule;
  year: number;
  holidays: Date[];
}

const Results = ({ schedule, year, holidays }: ResultsProps) => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const isMobile = useIsMobile();
  
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
            title="Effektivitet"
            value={`${efficiency}x`}
            description="Lediga dagar per använd semesterdag"
            color="teal"
            icon={<AlarmClock />}
          />
          
          <StatisticCard
            title="Semesterperioder"
            value={`${schedule.periods.length}`}
            description="Antal perioder med sammanhängande ledighet"
            color="blue"
            icon={<CalendarDays />}
          />
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
