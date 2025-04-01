
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const PageHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-6 mb-8 text-center">
      <Link to="/" className="inline-block mb-4">
        <img 
          src="/lovable-uploads/ef09cd5d-3465-4f0e-9e46-40a2da0cf965.png" 
          alt="vacai logo" 
          className={`${isMobile ? 'h-12' : 'h-16'} mx-auto`}
        />
      </Link>
      <p className="text-gray-600 max-w-2xl mx-auto px-4">
        Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar
      </p>
    </div>
  );
};

export default PageHeader;
