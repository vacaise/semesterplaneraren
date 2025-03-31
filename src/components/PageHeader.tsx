
import React from "react";
import { Link } from "react-router-dom";

const PageHeader = () => {
  return (
    <div className="text-center mb-10">
      <div className="flex items-center justify-center mb-4">
        <Link to="/" aria-label="Gå till startsidan">
          <img 
            src="/lovable-uploads/ba846d2b-4df7-4b0e-af89-5d0748a13e5d.png" 
            alt="vacai logo" 
            className="h-12" 
          />
        </Link>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar.
      </p>
    </div>
  );
};

export default PageHeader;
