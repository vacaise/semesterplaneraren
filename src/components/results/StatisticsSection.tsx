
import React from "react";
import StatisticCard from "@/components/StatisticCard";
import { Sparkles, Calendar, AlarmClock } from "lucide-react";
import { calculateEfficiency } from "@/utils/vacationOptimizer/optimizer";

interface StatisticsSectionProps {
  totalDaysOff: number;
  vacationDaysUsed: number;
}

const StatisticsSection = ({ totalDaysOff, vacationDaysUsed }: StatisticsSectionProps) => {
  // Calculate efficiency
  const efficiency = calculateEfficiency(totalDaysOff, vacationDaysUsed);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatisticCard
        title="Total ledighet"
        value={`${totalDaysOff} dagar`}
        description="Antal dagar du kommer vara ledig totalt"
        color="purple"
        icon={<Sparkles />}
      />
      
      <StatisticCard
        title="Semesterdagar"
        value={`${vacationDaysUsed}`}
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
  );
};

export default StatisticsSection;
