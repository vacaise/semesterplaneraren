
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useWizard(initialStep = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { toast } = useToast();

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const validateStep = (step: number, validationData: any): boolean => {
    switch (step) {
      case 1:
        if (validationData.vacationDays <= 0) {
          toast({
            title: "Ogiltigt antal semesterdagar",
            description: "Vänligen ange minst 1 semesterdag",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = (currentStep: number, validationData: any): boolean => {
    if (!validateStep(currentStep, validationData)) {
      return false;
    }
    
    setCurrentStep(currentStep + 1);
    return true;
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetToStart = () => {
    setCurrentStep(1);
    window.scrollTo(0, 0);
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    resetToStart
  };
}
