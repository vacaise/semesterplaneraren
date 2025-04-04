
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useOnboardingOverlay } from '@/hooks/useOnboardingOverlay';
import { useCallback, useRef } from 'react';

interface OnboardingCompleteProps {
  step: 'complete';
}

export function OnboardingComplete({ step }: OnboardingCompleteProps) {
  const { completeOnboarding } = useOnboarding();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { overlayRef, shouldRender } = useOnboardingOverlay({
    step,
    primaryButtonRef: closeButtonRef,
  });

  const handleClose = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  if (!shouldRender) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose}
    >
      <div 
        ref={overlayRef as React.RefObject<HTMLDivElement>}
        className="relative w-full max-w-lg rounded-lg border border-green-200 bg-white p-6 shadow-xl dark:border-green-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          onClick={handleClose}
          aria-label="Close onboarding"
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/50">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
            You're All Set!
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            You now know how to use the PTO Optimizer. Start planning your optimal time off!
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            ref={closeButtonRef}
            onClick={handleClose}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="lg"
            data-testid="onboarding-complete-button"
          >
            Get Started
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
