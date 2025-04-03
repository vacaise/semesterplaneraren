
import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={`${isMobile ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-xs sm:text-sm'} 
        rounded-full flex items-center justify-center transition ${dayType.className}`}
      title={`${format(date, 'EEEE d MMMM', { locale: sv })}: ${dayType.type}`}
    >
      {dayNumber}
    </div>
  );
};
