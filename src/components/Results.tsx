
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
  schedule: Schedule | null;
  year: number;
  holidays: Date[];
  resetToStart: () => void;
}

const Results = ({ schedule, year, holidays, resetToStart }: ResultsProps) => {
  if (!schedule) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-600">Ingen semesterplan hittades. Vänligen försök igen.</p>
        <button 
          onClick={resetToStart}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Starta om
        </button>
      </div>
    );
  }

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
