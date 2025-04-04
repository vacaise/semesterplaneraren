
'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpButtonProps {
  className?: string;
  dataTestId?: string;
}

export function HelpButton({ className, dataTestId }: HelpButtonProps) {
  const { isOnboardingVisible, startOnboarding } = useOnboarding();

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'h-8 w-8',
        'border-teal-200 hover:border-teal-300',
        'bg-teal-50/50 hover:bg-teal-100/50',
        'text-teal-700 hover:text-teal-800',
        'dark:border-teal-700 dark:hover:border-teal-600',
        'dark:bg-teal-900/20 dark:hover:bg-teal-900/30',
        'dark:text-teal-400 dark:hover:text-teal-300',
        className
      )}
      data-testid={dataTestId}
      onClick={startOnboarding}
      disabled={isOnboardingVisible}
      aria-label="Open help guide"
      title="Open help guide"
      type="button"
    >
      <HelpCircle className="h-4 w-4" />
      <span className="sr-only">Help</span>
    </Button>
  );
}
