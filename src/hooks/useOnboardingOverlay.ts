
import { useRef, useState, useEffect } from 'react';
import { OnboardingStep, useOnboarding } from '@/contexts/OnboardingContext';
import { RefObject } from 'react';

interface UseOnboardingOverlayProps {
  step: OnboardingStep;
  primaryButtonRef?: RefObject<HTMLButtonElement>;
}

export function useOnboardingOverlay({ step, primaryButtonRef }: UseOnboardingOverlayProps) {
  const { isOnboardingVisible, isCurrentStep } = useOnboarding();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  // Control rendering based on onboarding state
  useEffect(() => {
    setShouldRender(isOnboardingVisible && isCurrentStep(step));
  }, [isOnboardingVisible, isCurrentStep, step]);

  // Focus management for accessibility
  useEffect(() => {
    if (shouldRender && primaryButtonRef?.current) {
      primaryButtonRef.current.focus();
    }
  }, [shouldRender, primaryButtonRef]);

  return {
    overlayRef,
    shouldRender
  };
}
