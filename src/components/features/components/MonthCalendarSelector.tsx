import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { format, addMonths, subMonths, getMonth, setMonth, getYear, setYear, isSameMonth, isToday, isAfter, isBefore, isSameDay, getDay, getDaysInMonth, startOfMonth, endOfMonth, addDays, isSameYear } from 'date-fns';

// Define color scheme mapping for styling
const colorClasses = {
  teal: {
    selected: 'bg-teal-600 hover:bg-teal-700 text-white',
    current: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
    control: 'text-teal-600 hover:text-teal-800 hover:bg-teal-50 dark:text-teal-400 dark:hover:text-teal-200 dark:hover:bg-teal-900/30',
  },
  blue: {
    selected: 'bg-blue-600 hover:bg-blue-700 text-white',
    current: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    control: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/30',
  },
  amber: {
    selected: 'bg-amber-600 hover:bg-amber-700 text-white',
    current: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    control: 'text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-200 dark:hover:bg-amber-900/30',
  },
  violet: {
    selected: 'bg-violet-600 hover:bg-violet-700 text-white',
    current: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',
    control: 'text-violet-600 hover:text-violet-800 hover:bg-violet-50 dark:text-violet-400 dark:hover:text-violet-200 dark:hover:bg-violet-900/30',
  },
};

interface MonthCalendarSelectorProps {
  id: string;
  year: number;
  selectedDates: Date[];
  onDateSelect: (date: Date) => void;
  colorScheme: 'teal' | 'blue' | 'amber' | 'violet';
}

export function MonthCalendarSelector({
  id,
  selectedDates,
  onDateSelect,
  colorScheme,
  year,
}: MonthCalendarSelectorProps) {
  const today = new Date();
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the provided year and current month
  const initialDate = setYear(new Date(), year);
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  // Move to the previous month
  const prevMonth = () => {
    // Don't go before current month for current year, or January for future years
    const newMonth = subMonths(currentMonth, 1);
    const isCurrentYear = getYear(today) === year;
    
    if (isCurrentYear) {
      if (getMonth(newMonth) < getMonth(today) && getYear(newMonth) === getYear(today)) {
        return;
      }
    } else if (getMonth(newMonth) < 0) {
      return;
    }
    
    setCurrentMonth(newMonth);
  };

  // Move to the next month
  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    if (getYear(newMonth) > year) {
      return;
    }
    setCurrentMonth(newMonth);
  };

  // Get month days with padding for calendar layout
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Get days from start of week to first day of month
    const startDay = getDay(monthStart);
    const prevDays = Array.from({ length: startDay }, (_, i) => {
      const date = addDays(monthStart, -startDay + i);
      return { date, isCurrentMonth: false, isPast: isBefore(date, today) };
    });
    
    // Get all days in the month
    const daysInMonth = getDaysInMonth(currentMonth);
    const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = addDays(monthStart, i);
      return { 
        date, 
        isCurrentMonth: true, 
        isPast: isBefore(date, today) && !isToday(date),
        isToday: isToday(date),
        isSelected: selectedDates.some(selectedDate => isSameDay(selectedDate, date)) 
      };
    });
    
    // Get days from last day of month to end of week
    const endDay = 6 - getDay(monthEnd);
    const nextDays = Array.from({ length: endDay }, (_, i) => {
      const date = addDays(monthEnd, i + 1);
      return { date, isCurrentMonth: false, isPast: isBefore(date, today) };
    });
    
    return [...prevDays, ...monthDays, ...nextDays];
  };

  const days = getMonthDays();
  const isCurrentYear = isSameYear(currentMonth, today);
  const isCurrentMonthInView = isSameMonth(currentMonth, today);
  
  // Can't go before current month for current year
  const canGoPrevious = !(isCurrentYear && isCurrentMonthInView);
  // Can't go past December of selected year
  const canGoNext = getMonth(currentMonth) < 11;

  // Remove this line as currentDate is undefined
  // const monthDays = Array.from({ length: 31 }, (_, i) => {
  //   const date = addDays(currentDate, i);
  //   return { 
  //     date, 
  //     isCurrentMonth: true, 
  //     isPast: isBefore(date, new Date()) && !isSameDay(date, new Date()),
  //     isToday: isSameDay(date, new Date()),
  //     isSelected: selectedDates.some(selectedDate => isSameDay(selectedDate, date)) 
  //   };
  // });

  return (
    <div ref={containerRef} className="space-y-2" id={id}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrevious}
          className={cn(
            "rounded-full p-1.5",
            colorClasses[colorScheme].control,
            !canGoPrevious && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-medium">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className={cn(
            "rounded-full p-1.5",
            colorClasses[colorScheme].control,
            !canGoNext && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar grid */}
      <div>
        {/* Day names */}
        <div className="grid grid-cols-7 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isDisabled = day.isPast || !day.isCurrentMonth;
            
            return (
              <button
                key={index}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onDateSelect(day.date)}
                className={cn(
                  "text-xs w-7 h-7 flex items-center justify-center rounded-full",
                  isDisabled && "opacity-40 cursor-not-allowed",
                  !day.isCurrentMonth && "text-gray-400 dark:text-gray-600",
                  (day as any).isToday && colorClasses[colorScheme].current,
                  (day as any).isSelected && colorClasses[colorScheme].selected
                )}
                aria-label={format(day.date, 'MMMM d, yyyy')}
                aria-pressed={(day as any).isSelected}
                aria-disabled={isDisabled}
              >
                {format(day.date, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
