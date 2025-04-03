
import React from "react";
import { Sparkles } from "lucide-react";

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

  // Get mode description
  const getModeDescription = (mode: string): string => {
    switch (mode) {
      case "balanced": 
        return "en smart blandning av kortare ledigheter och längre semestrar";
      case "longweekends": 
        return "fokus på förlängda helger med 3-4 dagars ledighet";
      case "minibreaks": 
        return "kortare 5-6 dagars ledigheter utspridda över året";
      case "weeks": 
        return "kompletta veckoledigheter med 7-9 dagars sammanhängande ledighet";
      case "extended": 
        return "längre ledighetsperioder för maximal avkoppling";
      default: 
        return "en anpassad optimering";
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">
          <Sparkles className="h-4 w-4" />
        </div>
        <h2 className="text-xl font-medium ml-2 text-gray-800">Din optimerade semesterplan</h2>
      </div>
      
      <p className="text-gray-600 mb-2">
        Baserat på dina val har vi optimerat din ledighet för {year} med exakt <span className="font-medium text-blue-600">{vacationDaysUsed} semesterdagar</span> 
        i stilen "<span className="font-medium">{getModeDisplayText(mode)}</span>".
      </p>
      
      <p className="text-gray-600 mb-6">
        Planen är optimerad för att maximalt utnyttja röda dagar och helger med {getModeDescription(mode)}.
      </p>
    </div>
  );
};

export default ResultsHeader;
