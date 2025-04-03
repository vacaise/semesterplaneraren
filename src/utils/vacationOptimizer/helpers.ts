
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

// Format a date range for display
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getMonth() === endDate.getMonth()) {
    // Same month
    return `${format(startDate, 'd')}–${format(endDate, 'd MMM', { locale: sv })}`;
  } else {
    // Different months
    return `${format(startDate, 'd MMM', { locale: sv })}–${format(endDate, 'd MMM', { locale: sv })}`;
  }
}

// Determine the type of period based on its length
export function determinePeriodType(totalDays: number): string {
  if (totalDays <= 4) {
    return "longweekend";
  } else if (totalDays <= 6) {
    return "minibreak";
  } else if (totalDays <= 9) {
    return "week";
  } else {
    return "extended";
  }
}

// Get month name in Swedish
export function getMonthName(month: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[month];
}

// Generate description for a vacation period
export function generatePeriodDescription(startDate: Date, endDate: Date): string {
  const monthStart = startDate.getMonth();
  const monthEnd = endDate.getMonth();
  
  if (monthStart === monthEnd) {
    return `Ledighet i ${getMonthName(monthStart)}`;
  } else {
    return `Ledighet ${getMonthName(monthStart)}-${getMonthName(monthEnd)}`;
  }
}

// Check if a period overlaps with any period in a list
export function overlapsWithAny(
  periodStart: Date,
  periodEnd: Date,
  existingPeriods: { start: Date, end: Date }[]
): boolean {
  return existingPeriods.some(existingPeriod => {
    return (
      (periodStart <= existingPeriod.end && periodEnd >= existingPeriod.start)
    );
  });
}
