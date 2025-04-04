
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface StepTooltipProps {
  /**
   * The title text to display in the tooltip
   */
  title: string;
  /**
   * The description text to display in the tooltip
   */
  description: string;
  /**
   * The color scheme to use for styling (matches step colors)
   */
  colorScheme: 'teal' | 'blue' | 'amber' | 'violet';
  /**
   * Accessible label for the tooltip trigger
   */
  ariaLabel: string;
}

export function StepTooltip({ 
  title, 
  description, 
  colorScheme,
  ariaLabel
}: StepTooltipProps) {
  // Map colorScheme to specific style classes
  const colorClasses = {
    teal: 'text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300',
    blue: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    amber: 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300',
    violet: 'text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300',
  };

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${colorClasses[colorScheme]}`} aria-label={ariaLabel}>
        <InfoIcon className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="max-w-xs">
        <div className="space-y-1 p-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
