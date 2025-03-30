
import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CalendarDayProps {
  date: Date;
  dayNumber: number;
  dayType: {
    className: string;
    type: string;
  };
}

export const CalendarDay = ({ date, dayNumber, dayType }: CalendarDayProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`h-10 w-10 flex items-center justify-center rounded-md cursor-help ${dayType.className}`}
          >
            <span className={dayType.type === "Semesterdag" ? "font-bold" : ""}>
              {dayNumber}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{format(date, "EEEE d MMMM", { locale: sv })} - {dayType.type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
