
import React from "react";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import PeriodsListView from "@/components/results/PeriodsListView";
import { MonthCalendarView } from "@/components/MonthCalendarView";

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

interface ResultsViewProps {
  schedule: Schedule;
  year: number;
  holidays: Date[];
}

const ResultsView = ({ schedule, year, holidays }: ResultsViewProps) => {
  console.log("ResultsView rendering with:", { 
    periodsCount: schedule?.periods?.length,
    year, 
    holidaysCount: holidays?.length 
  });

  // Validate schedule data
  if (!schedule || !Array.isArray(schedule.periods)) {
    console.error("Invalid schedule data:", schedule);
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50 text-red-800">
        Ogiltigt schemaformat. Kontakta support.
      </div>
    );
  }

  // Normalize dates to ensure they are proper Date objects
  const normalizedSchedule = {
    ...schedule,
    periods: schedule.periods.map(period => ({
      ...period,
      start: period.start instanceof Date ? period.start : new Date(period.start),
      end: period.end instanceof Date ? period.end : new Date(period.end)
    }))
  };

  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Ledighetsperioder</TabsTrigger>
        <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <PeriodsListView 
          periods={normalizedSchedule.periods}
          year={year}
          holidays={holidays}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <MonthCalendarView 
          schedule={normalizedSchedule}
          year={year}
          holidays={holidays}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsView;
