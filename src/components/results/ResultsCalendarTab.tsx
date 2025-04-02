
import React from "react";
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

interface ResultsCalendarTabProps {
  schedule: Schedule;
  year: number;
  holidays: Date[];
  companyDays?: Date[];
}

export const ResultsCalendarTab = ({ schedule, year, holidays, companyDays = [] }: ResultsCalendarTabProps) => {
  return (
    <MonthCalendarView 
      schedule={schedule}
      year={year}
      holidays={holidays}
      companyDays={companyDays}
    />
  );
};
