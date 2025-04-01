
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepNavigationButtonsProps {
  currentStep: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  isLoading: boolean;
}

const StepNavigationButtons = ({
  currentStep,
  handleNextStep,
  handlePrevStep,
  isLoading,
}: StepNavigationButtonsProps) => {
  const isMobile = useIsMobile();
  
  const getFinalButtonText = () => {
    if (currentStep === 3) {
      return isLoading ? "Optimerar..." : "Generera optimerad semesterplan";
    }
    return "Nästa steg";
  };

  const getFinalButtonIcon = () => {
    if (currentStep === 3) {
      return <Sparkles className="h-4 w-4 ml-2" />;
    }
    return <ChevronRight className="h-4 w-4 ml-2" />;
  };

  // Don't show navigation on the results page
  if (currentStep === 4) return null;

  return (
    <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex justify-between'} mt-8`}>
      {currentStep > 1 ? (
        <Button
          onClick={handlePrevStep}
          variant="outline"
          className={`${isMobile ? 'w-full' : ''}`}
          disabled={isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Föregående steg
        </Button>
      ) : (
        <div />
      )}

      <Button
        onClick={handleNextStep}
        className={`${isMobile ? 'w-full' : ''} ${
          currentStep === 3 ? "bg-green-600 hover:bg-green-700" : ""
        }`}
        disabled={isLoading}
      >
        {getFinalButtonText()}
        {getFinalButtonIcon()}
      </Button>
    </div>
  );
};

export default StepNavigationButtons;
