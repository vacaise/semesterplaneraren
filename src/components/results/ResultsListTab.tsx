
import React from "react";
import BreakSummaryCard from "@/components/BreakSummaryCard";
import BreakTypeExplanation from "@/components/BreakTypeExplanation";
import { Card, CardContent } from "@/components/ui/card";

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

interface ResultsListTabProps {
  schedule: Schedule;
  year: number;
  holidays: Date[];
  companyDays?: Date[];
}

export const ResultsListTab = ({ schedule, year, holidays, companyDays = [] }: ResultsListTabProps) => {
  return (
    <div className="space-y-6">
      <BreakTypeExplanation />
      
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Dina optimerade ledigheter</h3>
          <p className="text-gray-600">Nedan ser du alla planerade ledighetsperioder för {year}</p>
        </div>
        
        {schedule.periods.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Inga ledighetsperioder hittades för resten av året.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedule.periods.map((period, index) => (
              <BreakSummaryCard
                key={index}
                title={period.description}
                startDate={new Date(period.start)}
                endDate={new Date(period.end)}
                totalDays={period.days}
                vacationDaysNeeded={period.vacationDaysNeeded}
                type={period.type}
                holidays={holidays}
                companyDays={companyDays}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
