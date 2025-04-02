
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
  // Calculate weekends and holidays within the period, ensuring no double counting
  const publicHolidays = calculatePublicHolidays(startDate, endDate, holidays);
  // Count weekends that are NOT also holidays
  const weekends = calculateWeekends(startDate, endDate, holidays);

  // Generate different background colors based on break type
  const getBgColor = () => {
    switch (type) {
      case "balanced":
        return "bg-purple-50 border-purple-100";
      case "longweekends":
        return "bg-blue-50 border-blue-100";
      case "minibreaks":
        return "bg-teal-50 border-teal-100";
      case "weeks":
        return "bg-amber-50 border-amber-100";
      case "extended":
        return "bg-green-50 border-green-100";
      case "special":
        return "bg-indigo-50 border-indigo-100";
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
            <div className="text-green-800 font-bold text-lg">{vacationDaysNeeded}</div>
            <div className="text-xs text-gray-600">Semesterdagar</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-red-800 font-bold text-lg">{publicHolidays}</div>
            <div className="text-xs text-gray-600">Röda dagar</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-orange-800 font-bold text-lg">{weekends}</div>
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

// Calculate number of weekend days in a period, excluding those that are also holidays
const calculateWeekends = (start: Date, end: Date, holidays: Date[]): number => {
  let count = 0;
  const current = new Date(start);
  
  while (current <= end) {
    const day = current.getDay();
    // Check if it's a weekend (Saturday or Sunday)
    if (day === 0 || day === 6) {
      // Check if this day is also a holiday
      const isAlsoHoliday = holidays.some(holiday => 
        holiday.getDate() === current.getDate() && 
        holiday.getMonth() === current.getMonth() && 
        holiday.getFullYear() === current.getFullYear()
      );
      
      // Only count as weekend if it's not also a holiday
      if (!isAlsoHoliday) {
        count++;
      }
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
    
    // Determine day type - prioritize holidays over weekends
    const isHoliday = holidays.some(holiday => 
      holiday.getDate() === currentDay.getDate() && 
      holiday.getMonth() === currentDay.getMonth() && 
      holiday.getFullYear() === currentDay.getFullYear()
    );
    
    const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
    
    let bgColor = "bg-green-200"; // Vacation day - now green to match calendar view
    
    if (isHoliday) {
      bgColor = "bg-red-200"; // Public holiday - red (takes precedence over weekend)
    } else if (isWeekend) {
      bgColor = "bg-orange-100"; // Weekend - orange/yellow
    }
    
    days.push(
      <div key={i} className={`h-2 flex-1 rounded-sm ${bgColor}`}></div>
    );
  }
  
  return days;
};

export default BreakSummaryCard;
