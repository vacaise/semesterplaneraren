
import { useHolidays } from '@/hooks/useOptimizer';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar, X } from 'lucide-react';

interface DateListProps {
  title: string;
  colorScheme: 'teal' | 'blue' | 'amber' | 'violet';
}

export function DateList({ title, colorScheme }: DateListProps) {
  const { holidays, removeHoliday } = useHolidays();

  if (holidays.length === 0) {
    return (
      <div className="text-center py-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white/50 dark:bg-gray-800/50">
        <Calendar className="mx-auto h-5 w-5 text-gray-400 dark:text-gray-500 mb-1" aria-hidden="true" />
        <p className="text-xs text-gray-500 dark:text-gray-400">No holidays selected</p>
      </div>
    );
  }

  // Color classes based on the color scheme
  const headingColorClasses = {
    teal: 'text-teal-900 dark:text-teal-100',
    blue: 'text-blue-900 dark:text-blue-100',
    amber: 'text-amber-900 dark:text-amber-100',
    violet: 'text-violet-900 dark:text-violet-100',
  };

  const tagColorClasses = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700/30',
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700/30',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700/30',
    violet: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700/30',
  };

  const buttonColorClasses = {
    teal: 'text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300',
    blue: 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    amber: 'text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300',
    violet: 'text-violet-500 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300',
  };

  // Sort dates chronologically
  const sortedHolidays = [...holidays].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-2">
      <h4 className={cn('text-xs font-medium', headingColorClasses[colorScheme])}>
        {title} ({holidays.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {sortedHolidays.map((holiday) => {
          const date = parse(holiday.date, 'yyyy-MM-dd', new Date());
          const formattedDate = format(date, 'MMM d, yyyy');

          return (
            <div
              key={holiday.date}
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border',
                tagColorClasses[colorScheme]
              )}
            >
              <span>{formattedDate}</span>
              <button
                type="button"
                onClick={() => removeHoliday(holiday.date)}
                className={cn(
                  'p-0.5 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50',
                  buttonColorClasses[colorScheme]
                )}
                aria-label={`Remove ${formattedDate}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
