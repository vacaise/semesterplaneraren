
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const PageHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-6 mb-8 text-center">
      <h1 className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-gray-800 mb-2`}>
        vacai
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar
      </p>
    </div>
  );
};

export default PageHeader;
