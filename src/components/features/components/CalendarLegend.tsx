
import { cn } from '@/lib/utils';

interface CalendarLegendProps {
  hasPTODays: boolean;
  hasHolidays: boolean;
  hasCompanyDaysOff: boolean;
  hasExtendedWeekends: boolean;
  hasWeekends: boolean;
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn(
        'w-4 h-4 rounded', 
        color
      )} />
      <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}

export function CalendarLegend({
  hasPTODays,
  hasHolidays,
  hasCompanyDaysOff,
  hasExtendedWeekends,
  hasWeekends
}: CalendarLegendProps) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 my-4">
      {hasPTODays && (
        <LegendItem 
          color="bg-blue-500" 
          label="PTO Days" 
        />
      )}
      
      {hasHolidays && (
        <LegendItem 
          color="bg-emerald-500" 
          label="Public Holidays" 
        />
      )}
      
      {hasCompanyDaysOff && (
        <LegendItem 
          color="bg-violet-500" 
          label="Company Days Off" 
        />
      )}
      
      {hasWeekends && (
        <LegendItem 
          color="bg-amber-200 dark:bg-amber-900/50" 
          label="Weekends" 
        />
      )}
      
      {hasExtendedWeekends && (
        <LegendItem 
          color="border-2 border-indigo-300 dark:border-indigo-700" 
          label="Part of Break" 
        />
      )}
    </div>
  );
}
