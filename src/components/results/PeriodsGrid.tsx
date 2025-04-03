
import React from "react";
import BreakSummaryCard from "@/components/BreakSummaryCard";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface PeriodsGridProps {
  periods: Period[];
  holidays: Date[];
}

const PeriodsGrid = ({ periods, holidays }: PeriodsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {periods.map((period, index) => (
        <BreakSummaryCard
          key={index}
          title={period.description}
          startDate={new Date(period.start)}
          endDate={new Date(period.end)}
          totalDays={period.days}
          vacationDaysNeeded={period.vacationDaysNeeded}
          type={period.type}
          holidays={holidays}
        />
      ))}
    </div>
  );
};

export default PeriodsGrid;
