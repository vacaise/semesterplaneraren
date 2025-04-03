
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const isMobile = useIsMobile();
  
  const steps = [
    {
      number: 1,
      title: "Semesterdagar",
      color: "bg-teal-50 text-teal-800 border-teal-200",
      lineColor: "border-teal-200",
    },
    {
      number: 2,
      title: "Välj stil",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      lineColor: "border-blue-200",
    },
    {
      number: 3,
      title: "Röda dagar",
      color: "bg-amber-50 text-amber-800 border-amber-200",
      lineColor: "border-amber-200",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between relative">
        {/* Line connecting the steps */}
        <div className="absolute top-4 left-0 right-0 h-px bg-gray-200"></div>
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          
          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted
                    ? "bg-green-50 text-green-800 border-green-500"
                    : isActive
                    ? step.color
                    : "bg-gray-50 text-gray-400 border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div
                className={`mt-2 text-xs font-medium ${
                  isCompleted
                    ? "text-green-800"
                    : isActive
                    ? "text-gray-800"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
