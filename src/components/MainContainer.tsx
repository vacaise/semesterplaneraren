
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MainContainerProps {
  currentStep: number;
  children: React.ReactNode;
}

const MainContainer = ({ currentStep, children }: MainContainerProps) => {
  const getStepTitle = () => {
    if (currentStep === 1) return "Steg 1: Välj år och antal semesterdagar";
    if (currentStep === 2) return "Steg 2: Välj din önskade ledighetsfördelning";
    if (currentStep === 3) return "Steg 3: Hantera röda dagar";
    return "";
  };

  return (
    <Card className="mb-8 shadow-sm border border-gray-200 bg-white">
      <CardHeader className={currentStep === 4 ? "pb-0" : ""}>
        {currentStep < 4 && (
          <CardTitle className="text-xl text-gray-800">
            {getStepTitle()}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default MainContainer;
