
import { cn } from '@/lib/utils';

export function BreakTypeLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <div className="flex items-center gap-1.5">
        <div className={cn('px-2 py-1 text-xs rounded-full', 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300')} >
          Extended Vacation
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">10+ days</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={cn('px-2 py-1 text-xs rounded-full', 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300')} >
          Week-long Break
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">7-9 days</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={cn('px-2 py-1 text-xs rounded-full', 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300')} >
          Mini Break
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">5-6 days</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <div className={cn('px-2 py-1 text-xs rounded-full', 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300')} >
          Long Weekend
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">3-4 days</span>
      </div>
    </div>
  );
}
