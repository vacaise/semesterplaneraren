
import React from "react";
import { CalendarDays } from "lucide-react";

const PageHeader = () => {
  return (
    <div className="text-center mb-10">
      <div className="flex items-center justify-center mb-4">
        <CalendarDays className="h-8 w-8 text-teal-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">
          Semesteroptimeraren
        </h1>
      </div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Maximera din ledighet genom att optimalt fördela semesterdagar runt helger och röda dagar.
      </p>
    </div>
  );
};

export default PageHeader;
