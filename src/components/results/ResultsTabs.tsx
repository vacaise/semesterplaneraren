
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthCalendarView } from "@/components/MonthCalendarView";
import ListViewContent from "@/components/results/ListViewContent";

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

interface ResultsTabsProps {
  schedule: Schedule;
  year: number;
  holidays: Date[];
}

const ResultsTabs = ({ schedule, year, holidays }: ResultsTabsProps) => {
  return (
    <Tabs defaultValue="list" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="list">Ledighetsperioder</TabsTrigger>
        <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <ListViewContent
          schedule={schedule}
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

export default ResultsTabs;
