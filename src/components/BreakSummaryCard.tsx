
import React from "react";
import { format, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, Clock, Coffee } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Period {
  start: Date;
  end: Date;
  days: number;
  vacationDaysNeeded: number;
  description: string;
  type: string;
}

interface BreakSummaryCardProps {
  period: Period;
}

export const BreakSummaryCard = ({ period }: BreakSummaryCardProps) => {
  const getBreakType = (days: number) => {
    if (days <= 4) return { type: "Långhelg", class: "bg-green-100 text-green-800", icon: <Coffee className="h-4 w-4 text-green-600" /> };
    if (days <= 6) return { type: "Miniledighet", class: "bg-amber-100 text-amber-800", icon: <Calendar className="h-4 w-4 text-amber-600" /> };
    if (days <= 9) return { type: "Veckoledighet", class: "bg-blue-100 text-blue-800", icon: <Calendar className="h-4 w-4 text-blue-600" /> };
    return { type: "Längre ledighet", class: "bg-purple-100 text-purple-800", icon: <Calendar className="h-4 w-4 text-purple-600" /> };
  };

  const breakStyle = getBreakType(period.days);
  
  // Calculate approximate weekends and holidays
  const totalDays = period.days;
  const vacationDays = period.vacationDaysNeeded;
  
  // Estimate 2 weekend days per 7 days of the period, rounded down
  const weekendEstimate = Math.floor(totalDays / 7) * 2;
  // Add one more if the period is odd and longer than 3 days
  const weekends = weekendEstimate + (totalDays % 7 >= 3 ? 1 : 0);
  
  // Estimate holidays - this is just an approximation
  const holidays = Math.max(0, totalDays - vacationDays - weekends);
  
  // Function to create visualization blocks for the proper number of days
  const createDayBlocks = () => {
    const blocks = [];
    
    // Make sure we're creating exactly the right number of total blocks
    const totalBlocks = totalDays;
    let blocksCreated = 0;
    
    // Create blocks for vacation days (green)
    for (let i = 0; i < vacationDays && blocksCreated < totalBlocks; i++) {
      blocks.push(
        <TooltipProvider key={`v-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-green-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Semesterdag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      blocksCreated++;
    }
    
    // Create blocks for holidays (red)
    for (let i = 0; i < holidays && blocksCreated < totalBlocks; i++) {
      blocks.push(
        <TooltipProvider key={`h-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-red-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Röd dag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      blocksCreated++;
    }
    
    // Create blocks for weekends (orange)
    for (let i = 0; i < weekends && blocksCreated < totalBlocks; i++) {
      blocks.push(
        <TooltipProvider key={`w-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-orange-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Helgdag (lördag/söndag)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      blocksCreated++;
    }
    
    // If we still haven't created enough blocks (due to rounding), add more vacation days
    while (blocksCreated < totalBlocks) {
      blocks.push(
        <TooltipProvider key={`extra-${blocksCreated}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-green-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Semesterdag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      blocksCreated++;
    }
    
    return blocks;
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between border-b">
        <div>
          <h4 className="font-medium">
            {format(new Date(period.start), "d MMM", { locale: sv })} - {format(new Date(period.end), "d MMM", { locale: sv })}
          </h4>
          <p className="text-sm text-gray-600">{period.days} dagar ledigt</p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm ${breakStyle.class}`}>
          {breakStyle.type}
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 rounded-md">
            <Calendar className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Semesterdagar</div>
            <div className="font-medium">{period.vacationDaysNeeded}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 rounded-md">
            <Calendar className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Röda dagar</div>
            <div className="font-medium">{holidays}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-md">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Helg</div>
            <div className="font-medium">{weekends}</div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-50">
        <div className="text-sm text-gray-600">{period.description}</div>
      </div>
      
      <div className="p-4 flex gap-1">
        {createDayBlocks()}
      </div>
    </div>
  );
};
