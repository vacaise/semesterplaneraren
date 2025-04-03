
import React from "react";
import BreakTypeExplanation from "@/components/BreakTypeExplanation";
import NoPeriodsFound from "@/components/results/NoPeriodsFound";
import PeriodsGrid from "@/components/results/PeriodsGrid";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface Schedule {
  periods: Period[];
}

interface ListViewContentProps {
  schedule: Schedule;
  year: number;
  holidays: Date[];
}

const ListViewContent = ({ schedule, year, holidays }: ListViewContentProps) => {
  return (
    <div className="space-y-6">
      <BreakTypeExplanation />
      
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Dina optimerade ledigheter</h3>
          <p className="text-gray-600">Nedan ser du alla planerade ledighetsperioder för {year}</p>
        </div>
        
        {schedule.periods.length === 0 ? (
          <NoPeriodsFound />
        ) : (
          <PeriodsGrid periods={schedule.periods} holidays={holidays} />
        )}
      </div>
    </div>
  );
};

export default ListViewContent;
