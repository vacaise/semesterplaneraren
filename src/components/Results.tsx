
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import StatisticsSection from "@/components/results/StatisticsSection";
import ResultsHeader from "@/components/results/ResultsHeader";
import ActionButtons from "@/components/results/ActionButtons";
import ResultsTabs from "@/components/results/ResultsTabs";
import ExportCalendar from "@/components/results/ExportCalendar";
import { getModeDisplayText } from "@/components/results/ModeDisplayHelper";

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
  const isMobile = useIsMobile();
  const { exportToICal } = ExportCalendar({ periods: schedule.periods, year });
  
  return (
    <div className="space-y-8">
      <ResultsHeader 
        vacationDaysUsed={schedule.vacationDaysUsed} 
        year={year} 
        modeName={getModeDisplayText(schedule.mode)}
      />
      
      <StatisticsSection 
        totalDaysOff={schedule.totalDaysOff}
        vacationDaysUsed={schedule.vacationDaysUsed}
      />
      
      <ActionButtons 
        resetToStart={resetToStart} 
        exportToICal={exportToICal} 
        isMobile={isMobile} 
      />
      
      <ResultsTabs 
        schedule={schedule} 
        year={year} 
        holidays={holidays} 
      />
    </div>
  );
};

export default Results;
