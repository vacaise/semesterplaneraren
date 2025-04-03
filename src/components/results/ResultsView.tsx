
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
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Ledighetsperioder</TabsTrigger>
        <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <PeriodsListView 
          periods={schedule.periods}
          year={year}
          holidays={holidays}
        />
      </TabsContent>
      
      <TabsContent value="calendar">
        <MonthCalendarView 
          schedule={schedule}
          year={year}
          holidays={holidays}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsView;
