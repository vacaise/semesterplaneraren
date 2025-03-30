
import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
    if (days <= 4) return { type: "Långhelg", class: "bg-green-100 text-green-800" };
    if (days <= 6) return { type: "Miniledighet", class: "bg-amber-100 text-amber-800" };
    if (days <= 9) return { type: "Veckoledighet", class: "bg-blue-100 text-blue-800" };
    return { type: "Längre ledighet", class: "bg-purple-100 text-purple-800" };
  };

  const breakStyle = getBreakType(period.days);
  
  // Här skapar vi en simpel visualisering av dagarna
  const createDayBlocks = () => {
    const totalDays = period.days;
    const blocks = [];
    
    // Antagande: semesterdagar först, röda dagar i mitten, helger i slutet
    const vacationDays = period.vacationDaysNeeded;
    const holidays = 2; // Förenkla med antagande (kan ersättas med faktiskt data)
    const weekends = 2; // Förenkla med antagande (kan ersättas med faktiskt data)
    
    // Skapa block för semesterdagar (rosa)
    for (let i = 0; i < vacationDays; i++) {
      blocks.push(
        <TooltipProvider key={`v-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-pink-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Semesterdag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Skapa block för röda dagar (gul)
    for (let i = 0; i < holidays; i++) {
      blocks.push(
        <TooltipProvider key={`h-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-amber-200 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Röd dag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    // Skapa block för helger (orange)
    for (let i = 0; i < weekends; i++) {
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
    }
    
    // Fyll på med vanliga dagar om det behövs (beige)
    const remainingDays = totalDays - vacationDays - holidays - weekends;
    for (let i = 0; i < remainingDays; i++) {
      blocks.push(
        <TooltipProvider key={`r-${i}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-4 rounded-sm bg-amber-50 flex-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Vardag</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
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
          <div className="p-1.5 bg-pink-100 rounded-md">
            <Calendar className="h-4 w-4 text-pink-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Semesterdagar</div>
            <div className="font-medium">{period.vacationDaysNeeded}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 rounded-md">
            <Calendar className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Röda dagar</div>
            <div className="font-medium">2</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-md">
            <Clock className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Helg</div>
            <div className="font-medium">2</div>
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
