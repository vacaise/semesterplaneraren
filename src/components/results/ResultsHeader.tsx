
import React from "react";

interface ResultsHeaderProps {
  mode: string;
  year: number;
  vacationDaysUsed: number;
}

const ResultsHeader = ({ mode, year, vacationDaysUsed }: ResultsHeaderProps) => {
  // Get mode display text
  const getModeDisplayText = (mode: string): string => {
    switch (mode) {
      case "balanced": return "Balanserad mix";
      case "longweekends": return "Långhelger";
      case "minibreaks": return "Miniledigheter";
      case "weeks": return "Veckor";
      case "extended": return "Långa semestrar";
      default: return "Anpassad";
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-blue-50 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">
          ✓
        </div>
        <h2 className="text-xl font-medium ml-2 text-gray-800">Din optimerade semesterplan</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Baserat på dina val har vi optimerat din ledighet för {year} med exakt {vacationDaysUsed} semesterdagar 
        i stil "{getModeDisplayText(mode)}".
      </p>
    </div>
  );
};

export default ResultsHeader;
