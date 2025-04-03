
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BreakSummaryCard from "@/components/BreakSummaryCard";
import BreakTypeExplanation from "@/components/BreakTypeExplanation";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface PeriodsListViewProps {
  periods: Period[];
  year: number;
  holidays: Date[];
}

const PeriodsListView = ({ periods, year, holidays }: PeriodsListViewProps) => {
  console.log("PeriodsListView rendering with:", { periodsCount: periods?.length, year });
  
  // Ensure periods is an array
  const validPeriods = Array.isArray(periods) ? periods : [];
  
  // Convert date strings to Date objects if needed
  const normalizedPeriods = validPeriods.map(period => ({
    ...period,
    start: period.start instanceof Date ? period.start : new Date(period.start),
    end: period.end instanceof Date ? period.end : new Date(period.end)
  }));

  return (
    <div className="space-y-6">
      <BreakTypeExplanation />
      
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Dina optimerade ledigheter</h3>
          <p className="text-gray-600">Nedan ser du alla planerade ledighetsperioder för {year}</p>
        </div>
        
        {normalizedPeriods.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Inga ledighetsperioder hittades för resten av året.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {normalizedPeriods.map((period, index) => (
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
        )}
      </div>
    </div>
  );
};

export default PeriodsListView;
