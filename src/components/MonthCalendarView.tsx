
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
    periodsCount: schedule?.periods?.length || 0,
    year, 
    holidays 
  });
  
  // Ensure schedule and periods exist
  if (!schedule || !schedule.periods || !Array.isArray(schedule.periods)) {
    console.error("Invalid schedule data", schedule);
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-800">
        Det gick inte att visa kalendervyn. Vänligen försök igen senare.
      </div>
    );
  }
  
  // Safely ensure dates are Date objects
  const normalizedPeriods = schedule.periods.map(period => ({
    ...period,
    start: period.start instanceof Date ? period.start : new Date(period.start),
    end: period.end instanceof Date ? period.end : new Date(period.end)
  }));
  
  // Find months that have vacation periods
  const relevantMonths = new Set<number>();
  
  normalizedPeriods.forEach(period => {
    try {
      const startMonth = period.start.getMonth();
      const endMonth = period.end.getMonth();
      
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

  // If no relevant months, show at least current month
  if (relevantMonths.size === 0) {
    relevantMonths.add(new Date().getMonth());
  }

  // Convert Set to Array and sort
  const monthsToRender = Array.from(relevantMonths).sort((a, b) => a - b);
  console.log("Months to render:", monthsToRender);

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
