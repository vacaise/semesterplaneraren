
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, X } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useOnboardingOverlay } from '@/hooks/useOnboardingOverlay';
import { useRef } from 'react';

interface OnboardingOverlayProps {
  step: 'intro';
}

export function OnboardingOverlay({ step }: OnboardingOverlayProps) {
  const { goToNextStep, skipOnboarding } = useOnboarding();
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const { overlayRef, shouldRender } = useOnboardingOverlay({
    step,
    primaryButtonRef,
  });

  if (!shouldRender) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        ref={overlayRef}
        className="relative w-full max-w-lg rounded-lg border border-teal-200 bg-white p-6 shadow-xl dark:border-teal-800 dark:bg-gray-900"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={skipOnboarding}
          aria-label="Skip onboarding"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Welcome to PTO Optimizer!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Let's walk through how to use this tool to make the most of your paid time off days.
          </p>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={skipOnboarding}
            className="border-teal-200 text-teal-600 hover:border-teal-300 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:border-teal-700 dark:hover:bg-teal-900/50"
          >
            Skip
          </Button>
          <Button
            ref={primaryButtonRef}
            onClick={goToNextStep}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            data-testid="onboarding-next-button"
          >
            <span>Continue</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
