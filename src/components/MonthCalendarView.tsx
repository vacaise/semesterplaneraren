
import React from "react";
import { format, getDaysInMonth, startOfMonth, getDay, endOfMonth, isSameDay, isWeekend, addMonths, isSameMonth, isAfter, isBefore } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDayOff } from "@/utils/vacationOptimizer";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

interface MonthCalendarViewProps {
  schedule: Schedule;
  year: number;
  holidays?: Date[];
}

export const MonthCalendarView = ({ schedule, year, holidays = [] }: MonthCalendarViewProps) => {
  // Funktion för att kontrollera om datum är inom en ledighetsperiod
  const isInPeriod = (date: Date) => {
    return schedule.periods.some(period => {
      const startDate = new Date(period.start);
      const endDate = new Date(period.end);
      return date >= startDate && date <= endDate;
    });
  };

  // Funktion för att avgöra vilken typ av dag det är
  const getDayType = (date: Date) => {
    // Röd dag (helgdag)
    if (holidays.some(holiday => isSameDay(holiday, date))) {
      return { className: "bg-amber-200 text-amber-800", type: "Röd dag" };
    }
    
    // Helg
    if (isWeekend(date)) {
      return { className: "bg-orange-100 text-orange-800", type: "Helg" };
    }
    
    // Semesterdag (om inom en period och varken röd dag eller helg)
    if (isInPeriod(date)) {
      return { className: "bg-pink-200 text-pink-800 border-2 border-pink-300", type: "Semesterdag" };
    }
    
    // Vardag
    return { className: "", type: "Vardag" };
  };

  // Skapa månadskalender för en specifik månad
  const renderMonth = (monthIndex: number) => {
    const monthDate = new Date(year, monthIndex, 1);
    const daysInMonth = getDaysInMonth(monthDate);
    const firstDayOfMonth = startOfMonth(monthDate);
    const firstDayWeekday = getDay(firstDayOfMonth); // 0 för söndag, 1 för måndag, etc.
    
    // Vi använder svenska veckan som börjar med måndag (index 0)
    const adjustedFirstDay = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    const daysArray = [];
    // Lägg till tomma celler för dagar före månadens start
    for (let i = 0; i < adjustedFirstDay; i++) {
      daysArray.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Lägg till dagar i månaden
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day);
      const dayType = getDayType(date);
      
      daysArray.push(
        <TooltipProvider key={`day-${day}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={`h-10 w-10 flex items-center justify-center rounded-md cursor-help ${dayType.className}`}
              >
                <span className={dayType.type === "Semesterdag" ? "font-bold" : ""}>
                  {day}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(date, "EEEE d MMMM", { locale: sv })} - {dayType.type}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {format(monthDate, "MMMM yyyy", { locale: sv })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            <div className="text-center text-gray-500 font-medium">Mån</div>
            <div className="text-center text-gray-500 font-medium">Tis</div>
            <div className="text-center text-gray-500 font-medium">Ons</div>
            <div className="text-center text-gray-500 font-medium">Tor</div>
            <div className="text-center text-gray-500 font-medium">Fre</div>
            <div className="text-center text-gray-500 font-medium">Lör</div>
            <div className="text-center text-gray-500 font-medium">Sön</div>
            {daysArray}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Only consider months from current date forward
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Find months that have vacation periods
  const relevantMonths = new Set<number>();
  
  schedule.periods.forEach(period => {
    const startMonth = new Date(period.start).getMonth();
    const endMonth = new Date(period.end).getMonth();
    const startYear = new Date(period.start).getFullYear();
    const endYear = new Date(period.end).getFullYear();
    
    // Only consider periods in the current year or future years
    if (startYear < currentYear) return;
    
    // If the period spans multiple months
    if (startMonth !== endMonth) {
      for (let m = startMonth; m <= endMonth; m++) {
        // Only add months from the current month forward
        if (startYear === currentYear && m < currentMonth) continue;
        relevantMonths.add(m);
      }
    } else {
      // Only add months from the current month forward
      if (startYear === currentYear && startMonth < currentMonth) return;
      relevantMonths.add(startMonth);
    }
  });

  // Konvertera Set till Array och sortera
  const monthsToRender = Array.from(relevantMonths).sort((a, b) => a - b);

  // If no relevant months found, show message
  if (monthsToRender.length === 0) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Kalendervy</h3>
          <p className="text-gray-600">Se dina optimerade ledigheter för {year}</p>
        </div>
        
        <div className="p-8 border border-gray-200 rounded-lg bg-white text-center text-gray-500">
          Inga ledighetsperioder planerade för resten av året.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Kalendervy</h3>
        <p className="text-gray-600">Se dina optimerade ledigheter för {year}</p>
      </div>
      
      <div className="p-4 border border-gray-200 rounded-lg bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-pink-200 rounded"></div>
            <span className="text-sm text-gray-600">Semesterdagar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-amber-200 rounded"></div>
            <span className="text-sm text-gray-600">Röda dagar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-orange-100 rounded"></div>
            <span className="text-sm text-gray-600">Helg</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthsToRender.map(month => (
            <div key={`month-${month}`}>
              {renderMonth(month)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
