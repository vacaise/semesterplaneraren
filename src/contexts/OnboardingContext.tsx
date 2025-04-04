'use client';

import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

// Constants for local storage
const ONBOARDING_COMPLETED_KEY = 'holiday-optimizer-onboarding-completed';

// Onboarding step identifiers
export type OnboardingStep =
  | 'intro'
  | 'days-input'
  | 'strategy-selection'
  | 'holidays-selection'
  | 'company-days'
  | 'complete';

// The order of onboarding steps
const STEPS_ORDER: OnboardingStep[] = [
  'intro',
  'days-input',
  'strategy-selection',
  'holidays-selection',
  'company-days',
  'complete',
];

interface OnboardingState {
  isOnboardingVisible: boolean;
  hasCompletedOnboarding: boolean;
  currentStep: OnboardingStep;
  totalSteps: number;
}

interface OnboardingContextType extends OnboardingState {
  startOnboarding: () => void;
  dismissOnboarding: () => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  isCurrentStep: (step: OnboardingStep) => boolean;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

type OnboardingAction =
  | { type: 'START_ONBOARDING' }
  | { type: 'DISMISS_ONBOARDING' }
  | { type: 'GO_TO_NEXT_STEP' }
  | { type: 'GO_TO_PREV_STEP' }
  | { type: 'SET_COMPLETED_STATUS'; isCompleted: boolean };

const initialState: OnboardingState = {
  isOnboardingVisible: false,
  hasCompletedOnboarding: false,
  currentStep: 'intro',
  totalSteps: STEPS_ORDER.length - 2, // exclude 'intro' and 'complete' from count
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'START_ONBOARDING':
      return {
        ...state,
        isOnboardingVisible: true,
        currentStep: 'intro',
      };
    case 'DISMISS_ONBOARDING':
      return {
        ...state,
        isOnboardingVisible: false,
        hasCompletedOnboarding: true,
      };
    case 'GO_TO_NEXT_STEP': {
      const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
      if (currentIndex < STEPS_ORDER.length - 1) {
        return {
          ...state,
          currentStep: STEPS_ORDER[currentIndex + 1],
        };
      }
      return state;
    }
    case 'GO_TO_PREV_STEP': {
      const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
      if (currentIndex > 0) {
        return {
          ...state,
          currentStep: STEPS_ORDER[currentIndex - 1],
        };
      }
      return state;
    }
    case 'SET_COMPLETED_STATUS':
      return {
        ...state,
        hasCompletedOnboarding: action.isCompleted,
      };
    default:
      return state;
  }
}

export const OnboardingContext = createContext<OnboardingContextType>({
  isOnboardingVisible: false,
  hasCompletedOnboarding: false,
  currentStep: 'intro',
  totalSteps: STEPS_ORDER.length - 2,
  startOnboarding: () => {},
  dismissOnboarding: () => {},
  goToNextStep: () => {},
  goToPrevStep: () => {},
  isCurrentStep: () => false,
  skipOnboarding: () => {},
  completeOnboarding: () => {},
});

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Check for completed status on mount
  useEffect(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    dispatch({ type: 'SET_COMPLETED_STATUS', isCompleted: hasCompleted });
    
    // Auto-start onboarding if not completed
    if (!hasCompleted) {
      dispatch({ type: 'START_ONBOARDING' });
    }
  }, []);

  // Save completion status to localStorage when changed
  useEffect(() => {
    if (state.hasCompletedOnboarding) {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    }
  }, [state.hasCompletedOnboarding]);

  const startOnboarding = () => dispatch({ type: 'START_ONBOARDING' });
  const dismissOnboarding = () => dispatch({ type: 'DISMISS_ONBOARDING' });
  const goToNextStep = () => dispatch({ type: 'GO_TO_NEXT_STEP' });
  const goToPrevStep = () => dispatch({ type: 'GO_TO_PREV_STEP' });
  const isCurrentStep = (step: OnboardingStep) => state.currentStep === step;

  const skipOnboarding = () => {
    dispatch({ type: 'DISMISS_ONBOARDING' });
  };

  const completeOnboarding = () => {
    dispatch({ type: 'DISMISS_ONBOARDING' });
  };

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        startOnboarding,
        dismissOnboarding,
        goToNextStep,
        goToPrevStep,
        isCurrentStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
