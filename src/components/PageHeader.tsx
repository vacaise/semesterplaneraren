
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

const PageHeader = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-6 mb-8 text-center">
      <Link to="/" className="inline-block mb-4">
        <img 
          src="/lovable-uploads/f65dbaf4-022d-4879-8f21-c099cac057f5.png" 
          alt="vacai logo" 
          className={`${isMobile ? 'h-12' : 'h-16'} mx-auto`}
        />
      </Link>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar
      </p>
    </div>
  );
};

export default PageHeader;
