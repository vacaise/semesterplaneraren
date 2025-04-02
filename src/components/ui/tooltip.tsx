
'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { PossibleColors } from '@/types';
import { cn } from '@/lib/utils';

const TooltipProvider = ({ children, ...props }: TooltipPrimitive.TooltipProviderProps) => (
  <TooltipPrimitive.Provider 
    delayDuration={100} 
    skipDelayDuration={300}
    {...props}
  >
    {children}
  </TooltipPrimitive.Provider>
);

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => (
  <TooltipPrimitive.Trigger 
    ref={ref} 
    {...props} 
  />
));
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-[9999] max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border bg-white dark:bg-gray-900 px-3 py-1.5 text-sm text-popover-foreground shadow-lg',
        className
      )}
      forceMount
      tabIndex={-1}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Custom tooltip content component for stat cards that takes a color scheme
interface StatTooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  colorScheme: PossibleColors;
}

const StatTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  StatTooltipContentProps
>(({ className, sideOffset = 4, colorScheme, ...props }, ref) => {
  // Default tooltip styles
  const defaultTooltipBg = 'bg-gray-100 dark:bg-gray-800';
  
  // Use color scheme based classes if available, otherwise use defaults
  let bgClass = defaultTooltipBg;
  
  // Get color class based on colorScheme
  switch(colorScheme) {
    case 'primary':
    case 'blue':
      bgClass = 'bg-blue-50 dark:bg-blue-950/50';
      break;
    case 'secondary':
    case 'slate':
      bgClass = 'bg-gray-50 dark:bg-gray-800/90';
      break;
    case 'success':
    case 'green':
      bgClass = 'bg-green-50 dark:bg-green-950/50';
      break;
    case 'warning':
    case 'amber':
      bgClass = 'bg-amber-50 dark:bg-amber-950/50';
      break;
    case 'danger':
      bgClass = 'bg-red-50 dark:bg-red-950/50';
      break;
    case 'info':
    case 'teal':
      bgClass = 'bg-cyan-50 dark:bg-cyan-950/50';
      break;
    case 'purple':
    case 'violet':
      bgClass = 'bg-purple-50 dark:bg-purple-950/50';
      break;
    case 'orange':
      bgClass = 'bg-orange-50 dark:bg-orange-950/50';
      break;
    case 'indigo':
      bgClass = 'bg-indigo-50 dark:bg-indigo-950/50';
      break;
    case 'pto':
      bgClass = 'bg-blue-50 dark:bg-blue-950/50';
      break;
    case 'publicHoliday':
      bgClass = 'bg-red-50 dark:bg-red-950/50';
      break;
    case 'companyDayOff':
      bgClass = 'bg-purple-50 dark:bg-purple-950/50';
      break;
    case 'weekend':
    case 'extendedWeekend':
      bgClass = 'bg-gray-50 dark:bg-gray-800/90';
      break;
    default:
      bgClass = defaultTooltipBg;
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[9999] max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 rounded-md border px-2 py-2 shadow-lg',
          bgClass,
          className
        )}
        forceMount
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
StatTooltipContent.displayName = 'StatTooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, StatTooltipContent, TooltipProvider };
