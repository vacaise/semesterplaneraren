import { OptimizedDay } from '@/types';
import { cn } from '@/lib/utils';
import { MONTHS } from '@/constants';
import { getDaysInMonth, getDay, format, startOfMonth, endOfMonth, addDays, isBefore, isSameDay } from 'date-fns';

interface MonthCalendarProps {
  month: number;
  year: number;
  days: OptimizedDay[];
}

export function MonthCalendar({ month, year, days }: MonthCalendarProps) {
  const today = new Date();
  
  // Generate calendar grid data
  const getMonthDays = () => {
    const monthDate = new Date(year, month);
    const firstDayOfMonth = getDay(startOfMonth(monthDate)); // 0 is Sunday, 1 is Monday, etc.
    const daysInMonth = getDaysInMonth(monthDate);
    
    // Create array for days in the month
    const monthDays = [];
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      monthDays.push({ isEmpty: true });
    }
    
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Find day in optimized days array
      const dayData = days.find(day => day.date === dateString);
      
      // Check if this date is in the past
      const isPast = isBefore(date, today) && !isSameDay(date, today);
      
      monthDays.push({
        isEmpty: false,
        date,
        day: i,
        dayData,
        isPast
      });
    }
    
    return monthDays;
  };
  
  const monthDays = getMonthDays();
  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 px-1">
        {MONTHS[month]} {year}
      </h4>
      
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
          <div 
            key={day} 
            className={cn(
              "text-xs font-medium text-center",
              (i === 0 || i === 6) ? "text-gray-400 dark:text-gray-500" : "text-gray-600 dark:text-gray-400"
            )}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar cells */}
        {monthDays.map((dayInfo, i) => {
          if (dayInfo.isEmpty) {
            return <div key={`empty-${i}`} className="h-7 w-full" />;
          }
          
          const { dayData, day, isPast } = dayInfo;
          
          let cellClass = "text-xs flex items-center justify-center h-7 rounded";
          
          if (isPast) {
            // Past dates are grayed out
            cellClass += " opacity-40 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500";
          } else if (dayData) {
            if (dayData.isPTO) {
              // PTO days
              cellClass += " bg-blue-500 text-white font-semibold";
            } else if (dayData.isPublicHoliday) {
              // Public holidays
              cellClass += " bg-emerald-500 text-white font-semibold";
            } else if (dayData.isCompanyDayOff) {
              // Company days off
              cellClass += " bg-violet-500 text-white font-semibold";
            } else if (dayData.isWeekend) {
              // Weekends
              cellClass += " bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300";
            } else {
              // Regular work days
              cellClass += " bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
            }
            
            if (dayData.isPartOfBreak) {
              // Highlight days that are part of a break
              cellClass += " ring-2 ring-offset-1 ring-indigo-300 dark:ring-indigo-700";
            }
          } else {
            // Default styling
            cellClass += " bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300";
          }
          
          return (
            <div 
              key={`day-${day}`}
              className={cellClass}
              title={dayData ? [
                `${format(new Date(dayData.date), 'EEEE, MMMM d, yyyy')}`,
                dayData.isPTO ? '• PTO Day' : '',
                dayData.isPublicHoliday ? `• Holiday: ${dayData.publicHolidayName}` : '',
                dayData.isCompanyDayOff ? `• Company Day Off: ${dayData.companyDayName}` : '',
                dayData.isWeekend ? '• Weekend' : ''
              ].filter(Boolean).join('\n') : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
