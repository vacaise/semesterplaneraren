
import React from "react";
import ResultsHeader from "@/components/results/ResultsHeader";
import StatisticsSection from "@/components/results/StatisticsSection";
import ResultsActions from "@/components/results/ResultsActions";
import ResultsView from "@/components/results/ResultsView";

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
  return (
    <div className="space-y-8">
      <ResultsHeader 
        mode={schedule.mode}
        year={year}
        vacationDaysUsed={schedule.vacationDaysUsed}
      />
      
      <StatisticsSection 
        totalDaysOff={schedule.totalDaysOff}
        vacationDaysUsed={schedule.vacationDaysUsed}
      />
      
      <ResultsActions 
        schedule={schedule}
        year={year}
        resetToStart={resetToStart}
      />
      
      <ResultsView 
        schedule={schedule}
        year={year}
        holidays={holidays}
      />
    </div>
  );
};

export default Results;
