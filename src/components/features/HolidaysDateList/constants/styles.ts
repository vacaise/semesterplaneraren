
import { DateListStylesMap } from '../types';

export const colorStyles: Record<string, DateListStylesMap> = {
  amber: {
    container: 'bg-amber-50/50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    divider: 'divide-amber-200/70 dark:divide-amber-800/30',
    highlight: 'bg-amber-100/80 dark:bg-amber-900/50',
    text: 'text-amber-900 dark:text-amber-100',
    muted: 'text-amber-700 dark:text-amber-300',
    accent: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-100/50 dark:hover:bg-amber-900/30',
    active: 'active:bg-amber-200/50 dark:active:bg-amber-800/30',
    input: 'border-amber-300 dark:border-amber-700 focus:border-amber-500 dark:focus:border-amber-500',
  },
  violet: {
    container: 'bg-violet-50/50 dark:bg-violet-900/20',
    border: 'border-violet-200 dark:border-violet-800',
    divider: 'divide-violet-200/70 dark:divide-violet-800/30',
    highlight: 'bg-violet-100/80 dark:bg-violet-900/50',
    text: 'text-violet-900 dark:text-violet-100',
    muted: 'text-violet-700 dark:text-violet-300',
    accent: 'text-violet-600 dark:text-violet-400',
    hover: 'hover:bg-violet-100/50 dark:hover:bg-violet-900/30',
    active: 'active:bg-violet-200/50 dark:active:bg-violet-800/30',
    input: 'border-violet-300 dark:border-violet-700 focus:border-violet-500 dark:focus:border-violet-500',
  },
};
