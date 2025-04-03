
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainContainerProps {
  currentStep: number;
  children: React.ReactNode;
}

const MainContainer = ({ currentStep, children }: MainContainerProps) => {
  const isMobile = useIsMobile();
  
  const getStepTitle = () => {
    if (currentStep === 1) return "Steg 1: Välj år och antal semesterdagar";
    if (currentStep === 2) return "Steg 2: Välj din önskade ledighetsfördelning";
    if (currentStep === 3) return "Steg 3: Hantera röda dagar";
    return "";
  };

  return (
    <Card className={`mb-8 shadow-sm border border-gray-200 bg-white ${isMobile ? 'p-0' : ''}`} id="main-container">
      <CardHeader className={`${currentStep === 4 ? "pb-0" : ""} ${isMobile ? 'px-4 py-3' : ''}`}>
        {currentStep < 4 && (
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-800`}>
            {getStepTitle()}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className={`${currentStep === 4 ? "overflow-visible" : ""} ${isMobile ? 'px-4 py-4' : ''}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default MainContainer;
