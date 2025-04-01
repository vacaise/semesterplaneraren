
import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface DayTypeInfo {
  className: string;
  type: string;
}

interface CalendarDayProps {
  date: Date;
  dayNumber: number;
  dayType: DayTypeInfo;
}

export const CalendarDay = ({ date, dayNumber, dayType }: CalendarDayProps) => {
  return (
    <div 
      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm transition ${dayType.className}`}
      title={`${format(date, 'EEEE d MMMM', { locale: sv })}: ${dayType.type}`}
    >
      {dayNumber}
    </div>
  );
};
