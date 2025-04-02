
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, getDay } from "date-fns";
import { sv } from "date-fns/locale";
import { VacationPeriod } from "@/utils/calculators";
import { isDayOff } from "@/utils/calculators";

interface MonthlyCalendarViewProps {
  periods: VacationPeriod[];
  holidays: Date[];
  year: number;
}

interface DayInfo {
  date: Date;
  isInPeriod: boolean;
  isHoliday: boolean;
  isWeekend: boolean;
  isCurrentMonth: boolean;
}

const MonthlyCalendarView = ({ periods, holidays, year }: MonthlyCalendarViewProps) => {
  // Find months with vacation periods
  const relevantMonths = useMemo(() => {
    const months = new Set<number>();
    
    periods.forEach(period => {
      const startMonth = period.start.getMonth();
      const endMonth = period.end.getMonth();
      
      // If the period spans multiple months
      if (startMonth !== endMonth) {
        for (let m = startMonth; m <= endMonth; m++) {
          months.add(m);
        }
      } else {
        months.add(startMonth);
      }
    });
    
    return Array.from(months).sort((a, b) => a - b);
  }, [periods]);

  // Is a specific date within any vacation period
  const isDateInPeriod = (date: Date): boolean => {
    return periods.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      return date >= periodStart && date <= periodEnd;
    });
  };

  // Is a specific date a holiday
  const isDateHoliday = (date: Date): boolean => {
    return holidays.some(holiday => 
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate()
    );
  };

  // Generate calendar for a specific month
  const generateCalendarDays = (monthIndex: number): DayInfo[] => {
    const monthStart = startOfMonth(new Date(year, monthIndex));
    const monthEnd = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get day of week of first day (0 = Sunday, 1 = Monday, etc)
    let firstDayOfWeek = getDay(monthStart);
    // Adjust for Swedish calendar (Monday is first day)
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Add empty days at the beginning
    const prefixDays: DayInfo[] = Array.from({ length: firstDayOfWeek }, (_, i) => {
      const date = addDays(monthStart, -(firstDayOfWeek - i));
      return {
        date,
        isInPeriod: isDateInPeriod(date),
        isHoliday: isDateHoliday(date),
        isWeekend: isDayOff(date, holidays),
        isCurrentMonth: false
      };
    });
    
    // Create days of the month
    const monthDays: DayInfo[] = daysInMonth.map(date => ({
      date,
      isInPeriod: isDateInPeriod(date),
      isHoliday: isDateHoliday(date),
      isWeekend: isDayOff(date, holidays),
      isCurrentMonth: true
    }));
    
    // Calculate trailing days needed
    const totalCells = Math.ceil((firstDayOfWeek + daysInMonth.length) / 7) * 7;
    const suffixDays: DayInfo[] = Array.from(
      { length: totalCells - (prefixDays.length + monthDays.length) },
      (_, i) => {
        const date = addDays(monthEnd, i + 1);
        return {
          date,
          isInPeriod: isDateInPeriod(date),
          isHoliday: isDateHoliday(date),
          isWeekend: isDayOff(date, holidays),
          isCurrentMonth: false
        };
      }
    );
    
    return [...prefixDays, ...monthDays, ...suffixDays];
  };

  // Get CSS class for a specific day
  const getDayClass = (day: DayInfo): string => {
    if (!day.isCurrentMonth) return "text-gray-300";
    if (day.isHoliday) return "bg-red-200 text-red-800";
    if (day.isWeekend) return "bg-gray-100 text-gray-600";
    if (day.isInPeriod) return "bg-green-200 text-green-800";
    return "";
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-red-200 mr-2"></div>
          <span className="text-sm">Röd dag</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-gray-100 mr-2"></div>
          <span className="text-sm">Helg</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-green-200 mr-2"></div>
          <span className="text-sm">Semesterdag</span>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 rounded bg-white border border-gray-200 mr-2"></div>
          <span className="text-sm">Vardag</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevantMonths.map(month => (
          <Card key={month}>
            <CardHeader className="py-3">
              <CardTitle className="text-base">
                {format(new Date(year, month), 'MMMM yyyy', { locale: sv })}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-7 text-xs mb-2">
                <div className="text-center font-medium text-gray-500">Må</div>
                <div className="text-center font-medium text-gray-500">Ti</div>
                <div className="text-center font-medium text-gray-500">On</div>
                <div className="text-center font-medium text-gray-500">To</div>
                <div className="text-center font-medium text-gray-500">Fr</div>
                <div className="text-center font-medium text-gray-500">Lö</div>
                <div className="text-center font-medium text-gray-500">Sö</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays(month).map((day, i) => (
                  <div
                    key={i}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${getDayClass(day)}`}
                    title={format(day.date, 'EEEE d MMMM', { locale: sv })}
                  >
                    {format(day.date, 'd')}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendarView;
