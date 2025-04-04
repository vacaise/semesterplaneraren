<<<<<<< HEAD

import { RefObject, useEffect, useState } from 'react';
=======
import { useRef, useState, useEffect } from 'react';
>>>>>>> 227f356 (Update project configuration and add missing files)
import { OnboardingStep, useOnboarding } from '@/contexts/OnboardingContext';
import { RefObject } from 'react';

interface UseOnboardingOverlayProps {
  step: OnboardingStep;
  primaryButtonRef?: RefObject<HTMLButtonElement>;
}

export function useOnboardingOverlay({ step, primaryButtonRef }: UseOnboardingOverlayProps) {
  const { isOnboardingVisible, isCurrentStep } = useOnboarding();
<<<<<<< HEAD
  const [shouldRender, setShouldRender] = useState(false);
  const overlayRef = useState<HTMLDivElement>(null)[0];

  // Determine if the overlay should be rendered
=======
  const overlayRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Control rendering based on onboarding state
>>>>>>> 227f356 (Update project configuration and add missing files)
  useEffect(() => {
    setShouldRender(isOnboardingVisible && isCurrentStep(step));
  }, [isOnboardingVisible, isCurrentStep, step]);

  // Focus management for accessibility
  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (shouldRender && primaryButtonRef?.current) {
      primaryButtonRef.current.focus();
    }
  }, [shouldRender, primaryButtonRef]);
>>>>>>> 227f356 (Update project configuration and add missing files)

  return {
    overlayRef,
    shouldRender
  };
<<<<<<< HEAD
}
=======
} 
>>>>>>> 227f356 (Update project configuration and add missing files)
