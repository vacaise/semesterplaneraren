
import React from "react";
import StatisticCard from "@/components/StatisticCard";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Home, Calendar, Download, AlarmClock } from "lucide-react";
import { calculateEfficiency } from "@/utils/vacationOptimizer/calculators";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsHeaderProps {
  schedule: {
    totalDaysOff: number;
    vacationDaysUsed: number;
    mode: string;
  };
  year: number;
  resetToStart: () => void;
  onExportCalendar: () => void;
}

export const ResultsHeader = ({ 
  schedule, 
  year, 
  resetToStart,
  onExportCalendar
}: ResultsHeaderProps) => {
  const isMobile = useIsMobile();
  
  // Calculate efficiency
  const efficiency = calculateEfficiency(schedule.totalDaysOff, schedule.vacationDaysUsed);
  
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
        Baserat på dina val har vi optimerat din ledighet för {year} med {schedule.vacationDaysUsed} semesterdagar 
        i stil "{getModeDisplayText(schedule.mode)}".
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatisticCard
          title="Total ledighet"
          value={`${schedule.totalDaysOff} dagar`}
          description="Antal dagar du kommer vara ledig totalt"
          color="purple"
          icon={<Sparkles />}
        />
        
        <StatisticCard
          title="Semesterdagar"
          value={`${schedule.vacationDaysUsed}`}
          description="Antal semesterdagar som används"
          color="blue"
          icon={<Calendar />}
        />
        
        <StatisticCard
          title="Effektivitet"
          value={`${efficiency}x`}
          description="Lediga dagar per använd semesterdag"
          color="teal"
          icon={<AlarmClock />}
        />
      </div>
      
      <div className={`flex flex-wrap gap-3 mb-6 ${isMobile ? 'justify-between' : ''}`}>
        <Button onClick={resetToStart} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Börja om
        </Button>
        
        {!isMobile && (
          <Button variant="outline" onClick={resetToStart} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Tillbaka till start
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={onExportCalendar} 
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isMobile ? 'Exportera' : 'Exportera kalender'}
        </Button>
      </div>
    </div>
  );
};
