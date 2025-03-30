
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${
                currentStep >= step
                  ? step === 1 
                    ? "bg-teal-600" 
                    : step === 2 
                      ? "bg-blue-600" 
                      : "bg-amber-600"
                  : "bg-gray-300"
              }`}
            >
              {step}
            </div>
            <span className="text-sm mt-2 text-gray-600">
              {step === 1
                ? "År & Dagar"
                : step === 2
                ? "Ledighetstyp"
                : "Röda dagar"}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full max-w-3xl mx-auto h-1 bg-gray-200 relative">
        <div
          className={`h-full transition-all duration-300 ${
            currentStep === 1 
              ? "bg-teal-600 w-[0%]" 
              : currentStep === 2 
                ? "bg-blue-600 w-[50%]" 
                : "bg-amber-600 w-[100%]"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default StepIndicator;
