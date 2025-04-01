
import React from "react";
import { format, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateRange } from "@/utils/vacationOptimizer/helpers";
import { Calendar } from "lucide-react";

interface BreakSummaryCardProps {
  title: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  vacationDaysNeeded: number;
  type: string;
  holidays: Date[];
}

const BreakSummaryCard = ({
  title,
  startDate,
  endDate,
  totalDays,
  vacationDaysNeeded,
  type,
  holidays,
}: BreakSummaryCardProps) => {
  // Calculate weekends and holidays within the period
  const weekends = calculateWeekends(startDate, endDate);
  const publicHolidays = calculatePublicHolidays(startDate, endDate, holidays);

  // Generate different background colors based on break type
  const getBgColor = () => {
    switch (type) {
      case "holiday":
        return "bg-red-50 border-red-100";
      case "bridge":
        return "bg-teal-50 border-teal-100";
      case "weekend":
        return "bg-yellow-50 border-yellow-100";
      case "summer":
        return "bg-blue-50 border-blue-100";
      case "winter":
        return "bg-indigo-50 border-indigo-100";
      case "spring":
        return "bg-green-50 border-green-100";
      case "fall":
        return "bg-orange-50 border-orange-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  return (
    <Card className={`border ${getBgColor()}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg flex items-center gap-2">
              <Calendar className="h-4 w-4" />{title}
            </h3>
            <div className="text-purple-700 font-medium">
              {totalDays} dagar ledigt
            </div>
          </div>
          <div className="text-purple-700 font-medium">
            {format(startDate, "MMM d", { locale: sv })} - {format(endDate, "MMM d", { locale: sv })}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="flex flex-col items-center">
            <div className="text-purple-700 font-bold text-lg">{vacationDaysNeeded}</div>
            <div className="text-xs text-gray-600">Semesterdagar</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-amber-700 font-bold text-lg">{publicHolidays}</div>
            <div className="text-xs text-gray-600">Röda dagar</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-blue-700 font-bold text-lg">{weekends}</div>
            <div className="text-xs text-gray-600">Helgdagar</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex space-x-1">
            {generateColoredDayIndicators(startDate, endDate, holidays)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Calculate number of weekend days in a period
const calculateWeekends = (start: Date, end: Date): number => {
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    if (day === 0 || day === 6) { // Sunday or Saturday
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

// Calculate number of public holidays in a period
const calculatePublicHolidays = (start: Date, end: Date, holidays: Date[]): number => {
  return holidays.filter(holiday => {
    const holiday00 = new Date(holiday.getFullYear(), holiday.getMonth(), holiday.getDate());
    return holiday00 >= start && holiday00 <= end;
  }).length;
};

// Generate colored day indicators for the period
const generateColoredDayIndicators = (start: Date, end: Date, holidays: Date[]) => {
  const dayCount = differenceInDays(end, start) + 1;
  const days = [];
  
  // Limit to max 14 days of indicators
  const maxIndicators = Math.min(dayCount, 14);
  
  for (let i = 0; i < maxIndicators; i++) {
    const currentDay = new Date(start);
    currentDay.setDate(start.getDate() + i);
    
    // Determine day type
    const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
    const isHoliday = holidays.some(holiday => 
      holiday.getDate() === currentDay.getDate() && 
      holiday.getMonth() === currentDay.getMonth() && 
      holiday.getFullYear() === currentDay.getFullYear()
    );
    
    let bgColor = "bg-purple-200"; // Default: PTO/Vacation day
    
    if (isHoliday) {
      bgColor = "bg-amber-200"; // Public holiday
    } else if (isWeekend) {
      bgColor = "bg-blue-200"; // Weekend
    }
    
    days.push(
      <div key={i} className={`h-2 flex-1 rounded-sm ${bgColor}`}></div>
    );
  }
  
  return days;
};

export default BreakSummaryCard;
