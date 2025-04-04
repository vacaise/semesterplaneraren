import { Break } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface BreakCardProps {
  breakPeriod: Break;
}

export function BreakCard({ breakPeriod }: BreakCardProps) {
  const { startDate, endDate, totalDays, ptoDays, publicHolidays, weekends, companyDaysOff } = breakPeriod;
  
  // Parse the dates
  const startDateObj = parseISO(startDate);
  const endDateObj = parseISO(endDate);
  
  // Format dates for display
  const formattedStartDate = format(startDateObj, 'EEE, MMM d');
  const formattedEndDate = format(endDateObj, 'EEE, MMM d');
  const startYear = format(startDateObj, 'yyyy');
  const endYear = format(endDateObj, 'yyyy');
  const yearDisplay = startYear === endYear ? startYear : `${startYear}-${endYear}`;
  
  // Determine break classification
  let breakType = 'Standard Break';
  let breakClass = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  
  if (totalDays >= 10) {
    breakType = 'Extended Vacation';
    breakClass = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
  } else if (totalDays >= 7) {
    breakType = 'Week-long Break';
    breakClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  } else if (totalDays >= 5) {
    breakType = 'Mini Break';
    breakClass = 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300';
  } else if (totalDays >= 3) {
    breakType = 'Long Weekend';
    breakClass = 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'border rounded-lg overflow-hidden',
        'border-gray-200 dark:border-gray-700',
        'h-full flex flex-col'
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {formattedStartDate} - {formattedEndDate}, {yearDisplay}
          </span>
        </div>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full font-medium',
          breakClass
        )}>
          {breakType}
        </span>
      </div>
      
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Days</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{totalDays} days</span>
          </div>
          
          <div className="flex gap-1.5 flex-wrap">
            {ptoDays > 0 && (
              <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs">
                {ptoDays} PTO {ptoDays === 1 ? 'day' : 'days'}
              </div>
            )}
            {publicHolidays > 0 && (
              <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded text-xs">
                {publicHolidays} {publicHolidays === 1 ? 'holiday' : 'holidays'}
              </div>
            )}
            {weekends > 0 && (
              <div className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded text-xs">
                {weekends} weekend {weekends === 1 ? 'day' : 'days'}
              </div>
            )}
            {companyDaysOff > 0 && (
              <div className="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded text-xs">
                {companyDaysOff} company {companyDaysOff === 1 ? 'day' : 'days'}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
