
import React from "react";
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { DayType } from "@/utils/calendarDayUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarDayProps {
  date: Date;
  dayNumber: number;
  dayType: DayType;
}

export const CalendarDay = ({ date, dayNumber, dayType }: CalendarDayProps) => {
  const isMobile = useIsMobile();
  
  // Style based on day type
  let bgColor = "bg-white border-gray-200";
  let textColor = "text-gray-800";
  
  switch (dayType) {
    case "vacation":
      bgColor = "bg-purple-400 border-purple-500";
      textColor = "text-white";
      break;
    case "holiday":
      bgColor = "bg-amber-300 border-amber-400";
      textColor = "text-amber-900";
      break;
    case "weekend":
      bgColor = "bg-blue-200 border-blue-300";
      textColor = "text-blue-900";
      break;
    case "past":
      bgColor = "bg-gray-100 border-gray-200";
      textColor = "text-gray-400";
      break;
    default:
      bgColor = "bg-gray-50 border-gray-200";
      textColor = "text-gray-600";
  }
  
  const size = isMobile ? "h-6 w-6 text-[10px]" : "h-8 w-8 md:h-10 md:w-10 text-xs md:text-sm";
  
  return (
    <div 
      className={`${bgColor} ${textColor} ${size} flex items-center justify-center border rounded-full font-medium`}
      title={format(date, 'EEEE d MMMM', { locale: sv })}
    >
      {dayNumber}
    </div>
  );
};
