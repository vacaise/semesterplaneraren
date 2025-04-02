
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsHeader } from "@/components/results/ResultsHeader";
import { ResultsCalendarTab } from "@/components/results/ResultsCalendarTab";
import { ResultsListTab } from "@/components/results/ResultsListTab";
import { useICalExporter } from "@/components/results/ResultsICalExporter";

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
  const { exportToICal } = useICalExporter();
  
  const handleExportCalendar = () => {
    exportToICal(schedule, year);
  };

  return (
    <div className="space-y-8">
      <ResultsHeader 
        schedule={schedule} 
        year={year} 
        resetToStart={resetToStart}
        onExportCalendar={handleExportCalendar}
      />
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Kalendervy</TabsTrigger>
          <TabsTrigger value="list">Ledighetsperioder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <ResultsCalendarTab 
            schedule={schedule}
            year={year}
            holidays={holidays}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <ResultsListTab 
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
