
import React from "react";

interface ResultsHeaderProps {
  vacationDaysUsed: number;
  year: number;
  modeName: string;
}

const ResultsHeader = ({ vacationDaysUsed, year, modeName }: ResultsHeaderProps) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-blue-50 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">
          ✓
        </div>
        <h2 className="text-xl font-medium ml-2 text-gray-800">Din optimerade semesterplan</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Baserat på dina val har vi optimerat din ledighet för {year} med {vacationDaysUsed} semesterdagar 
        i stil "{modeName}".
      </p>
    </div>
  );
};

export default ResultsHeader;
