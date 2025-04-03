
import React from "react";
import { MonthCard } from "@/components/MonthCard";
import { CalendarLegend } from "@/components/CalendarLegend";
import { useIsMobile } from "@/hooks/use-mobile";

interface Period {
  start: Date | string;
  end: Date | string;
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
  holidays: Date[];
}

export const MonthCalendarView = ({ schedule, year, holidays = [] }: MonthCalendarViewProps) => {
  const isMobile = useIsMobile();
  
  console.log("MonthCalendarView rendering with:", { 
    scheduleData: schedule,
    periodsCount: schedule.periods.length,
    year, 
    holidays 
  });
  
  // Safely ensure dates are Date objects
  const normalizedPeriods = schedule.periods.map(period => ({
    ...period,
    start: period.start instanceof Date ? period.start : new Date(period.start),
    end: period.end instanceof Date ? period.end : new Date(period.end)
  }));
  
  console.log("Normalized periods:", normalizedPeriods);
  
  // Find months that have vacation periods
  const relevantMonths = new Set<number>();
  
  normalizedPeriods.forEach(period => {
    try {
      const startMonth = new Date(period.start).getMonth();
      const endMonth = new Date(period.end).getMonth();
      
      // If the period spans multiple months
      if (startMonth !== endMonth) {
        for (let m = startMonth; m <= endMonth; m++) {
          relevantMonths.add(m);
        }
      } else {
        relevantMonths.add(startMonth);
      }
    } catch (error) {
      console.error("Error processing period:", period, error);
    }
  });

  // Convert Set to Array and sort
  const monthsToRender = Array.from(relevantMonths).sort((a, b) => a - b);
  console.log("Months to render:", monthsToRender);

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
      
      <div className={`${isMobile ? 'p-2' : 'p-3 sm:p-4'} border border-gray-200 rounded-lg bg-white`}>
        <CalendarLegend />
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4">
          {monthsToRender.map(month => (
            <div key={`month-${month}`}>
              <MonthCard 
                year={year}
                monthIndex={month}
                periods={normalizedPeriods}
                holidays={holidays}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
