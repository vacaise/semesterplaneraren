'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isPast,
  isToday,
  parse,
  startOfDay,
  startOfMonth,
} from 'date-fns';
import { OptimizedDay } from '@/types';
import { cn, DayType, dayTypeToColorScheme } from '@/lib/utils';
import { COLOR_SCHEMES, WEEKDAYS } from '@/constants';
import { useEffect, useState } from 'react';

interface MonthCalendarProps {
  month: number;
  year: number;
  days: OptimizedDay[];
}

interface CalendarDayProps {
  day: OptimizedDay;
  dayInfo: ReturnType<(day: OptimizedDay) => {
    date: Date;
    dayType: 'default' | 'companyDayOff' | 'weekend' | 'pto' | 'publicHoliday' | 'extendedWeekend';
    tooltipText: string;
    bgClass: string;
    textClass: string;
    isCurrentDay: boolean
  }>;
  hasPublicHoliday: boolean;
  mounted: boolean;
}

const getDayColorScheme = (day: OptimizedDay, date: Date, isCurrentDay: boolean, isCurrentYear: boolean) => {
  // Determine color scheme based on day state
  if (isCurrentDay) {
    return 'today';
  }
  
  if (isCurrentYear && isPast(startOfDay(date)) && !isCurrentDay) {
    return 'past';
  }
  
  // Determine day type based on properties
  let dayType: DayType = 'default';
  
  if (day.isPTO) {
    dayType = 'pto';
  } else if (day.isPublicHoliday) {
    dayType = 'publicHoliday';
  } else if (day.isCompanyDayOff) {
    dayType = 'companyDayOff';
  } else if (day.isWeekend) {
    dayType = 'weekend';
  }
  
  return dayTypeToColorScheme[dayType];
};

/**
 * Renders a single calendar day with appropriate styling and tooltip
 */
const CalendarDay = ({ day, dayInfo, hasPublicHoliday }: CalendarDayProps) => {
  const { date, bgClass, textClass, isCurrentDay, dayType } = dayInfo;
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const isCurrentYear = date.getFullYear() === currentYear;
  
  getDayColorScheme(day, date, isCurrentDay, isCurrentYear);

  return (
    <>
      <div
        className={cn(
          'absolute inset-0.5 rounded-md',
          bgClass,
          isCurrentDay && 'ring-2 ring-blue-400 dark:ring-blue-500 shadow-sm',
          day.isPartOfBreak && dayType !== 'extendedWeekend' && !isCurrentDay && 'ring-1 ring-indigo-300/40 dark:ring-indigo-400/30 ring-dashed',
          dayType === 'extendedWeekend' && !isCurrentDay && 'ring-1 ring-purple-400/70 dark:ring-purple-400/50'
        )}
      />
      <div className={cn(
        'absolute inset-0 flex items-center justify-center font-medium z-10 text-xs',
        textClass,
        day.isPartOfBreak && dayType !== 'extendedWeekend' && 'text-indigo-700 dark:text-indigo-300'
      )}>
        {format(date, 'd')}
      </div>
      {hasPublicHoliday && day.isPublicHoliday && (
        <div className={cn(
          'absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full',
          COLOR_SCHEMES[dayTypeToColorScheme.publicHoliday].calendar.text,
        )} />
      )}
    </>
  );
};

/**
 * MonthCalendar Component
 * Displays a single month calendar with optimized day styling
 */
export function MonthCalendar({ month, year, days }: MonthCalendarProps) {
  const [mounted, setMounted] = useState(false);
  const [calendarDays, setCalendarDays] = useState<Array<OptimizedDay | null>>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const start = startOfMonth(new Date(year, month));
    const end = endOfMonth(start);
    const daysInMonth = eachDayOfInterval({ start, end });
    const startingDayIndex = getDay(start);
    
    const newCalendarDays = Array(35).fill(null);
    daysInMonth.forEach((date, index) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const day = days.find(d => d.date === dateStr);
      newCalendarDays[startingDayIndex + index] = day || {
        date: dateStr,
        isWeekend: getDay(date) === 0 || getDay(date) === 6,
        isPTO: false,
        isPartOfBreak: false,
        isPublicHoliday: false,
        isCompanyDayOff: false,
      };
    });

    setStartDate(start);
    setCalendarDays(newCalendarDays);
  }, [month, year, days]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const isCurrentYear = year === currentYear;

  const calendarContent = (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
      {/* Calendar Header */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 leading-none">
          {startDate ? format(startDate, 'MMMM yyyy') : ''}
        </h4>
      </div>

      {/* Calendar Grid */}
      <div className="p-2">
        <div className="grid grid-cols-7 gap-0.5">
          {/* Weekday Headers */}
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-1">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                'aspect-square p-1 text-xs relative',
                !day && 'bg-gray-50 dark:bg-gray-800/30',
              )}
            >
              {day && (
                <CalendarDay
                  day={day}
                  dayInfo={{
                    date: parse(day.date, 'yyyy-MM-dd', new Date()),
                    dayType: day.isPTO ? 'pto' : 
                             day.isPublicHoliday ? 'publicHoliday' : 
                             day.isCompanyDayOff ? 'companyDayOff' : 
                             day.isWeekend ? 'weekend' : 'default',
                    tooltipText: day.isPTO ? 'PTO Day' :
                                day.isPublicHoliday ? 'Public Holiday' :
                                day.isCompanyDayOff ? 'Company Day Off' :
                                day.isWeekend ? 'Weekend' : '',
                    bgClass: COLOR_SCHEMES[getDayColorScheme(day, parse(day.date, 'yyyy-MM-dd', new Date()), isToday(parse(day.date, 'yyyy-MM-dd', new Date())), isCurrentYear)].calendar.bg,
                    textClass: COLOR_SCHEMES[getDayColorScheme(day, parse(day.date, 'yyyy-MM-dd', new Date()), isToday(parse(day.date, 'yyyy-MM-dd', new Date())), isCurrentYear)].calendar.text,
                    isCurrentDay: isToday(parse(day.date, 'yyyy-MM-dd', new Date()))
                  }}
                  hasPublicHoliday={day.isPublicHoliday}
                  mounted={mounted}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!mounted || !startDate) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-lg shadow-sm overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 animate-pulse">
        <div className="h-64"></div>
      </div>
    );
  }

  return calendarContent;
}