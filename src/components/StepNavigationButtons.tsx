
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StepNavigationButtonsProps {
  currentStep: number;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  isLoading: boolean;
}

const StepNavigationButtons = ({ 
  currentStep, 
  handlePrevStep, 
  handleNextStep, 
  isLoading 
}: StepNavigationButtonsProps) => {
  return (
    <div className="flex justify-between">
      {currentStep > 1 && (
        <Button 
          onClick={handlePrevStep} 
          variant="outline"
          disabled={isLoading}
          className="border-gray-300"
        >
          Tillbaka
        </Button>
      )}
      {currentStep < 4 && (
        <Button 
          onClick={handleNextStep} 
          className={`ml-auto ${
            currentStep === 1 
              ? "bg-teal-600 hover:bg-teal-700" 
              : currentStep === 2 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-amber-600 hover:bg-amber-700"
          }`}
          disabled={isLoading}
        >
          {currentStep === 3 ? "Generera schema" : (
            <>
              Nästa steg <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      )}
      {currentStep === 4 && (
        <Button 
          onClick={() => window.location.reload()} 
          className="ml-auto bg-gray-700 hover:bg-gray-800"
        >
          Börja om
        </Button>
      )}
    </div>
  );
};

export default StepNavigationButtons;
