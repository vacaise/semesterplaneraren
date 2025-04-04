
import { RefObject, useEffect, useState } from 'react';
import { OnboardingStep, useOnboarding } from '@/contexts/OnboardingContext';

interface UseOnboardingOverlayProps {
  step: OnboardingStep;
  primaryButtonRef?: RefObject<HTMLButtonElement>;
}

export function useOnboardingOverlay({ step, primaryButtonRef }: UseOnboardingOverlayProps) {
  const { isOnboardingVisible, isCurrentStep } = useOnboarding();
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useState<HTMLDivElement>(null)[0];

  // Determine if the overlay should be rendered
  useEffect(() => {
    setShouldRender(isOnboardingVisible && isCurrentStep(step));
  }, [isOnboardingVisible, isCurrentStep, step]);

  // Focus management for accessibility
  useEffect(() => {
    if (shouldRender) {
      // First focus the overlay itself for screen readers
      if (overlayRef) {
        setTimeout(() => {
          overlayRef.focus();
        }, 10);
      }

      // Then focus the primary action button if available
      if (primaryButtonRef?.current) {
        setTimeout(() => {
          primaryButtonRef.current?.focus();
        }, 100);
      }

      // Prevent body scrolling when overlay is shown
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [shouldRender, overlayRef, primaryButtonRef]);

  return {
    overlayRef,
    shouldRender,
  };
}
