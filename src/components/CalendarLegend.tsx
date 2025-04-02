
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarLegendProps {
  showCompanyDays?: boolean;
}

export const CalendarLegend = ({ showCompanyDays = false }: CalendarLegendProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`mb-4 flex flex-wrap ${isMobile ? 'gap-2 justify-between' : 'gap-4'}`}>
      <div className="flex items-center">
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-red-200 mr-1 sm:mr-2"></div>
        <span className="text-xs sm:text-sm text-gray-600">Röd dag</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-orange-100 mr-1 sm:mr-2"></div>
        <span className="text-xs sm:text-sm text-gray-600">Helg</span>
      </div>
      {showCompanyDays && (
        <div className="flex items-center">
          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-purple-200 border border-purple-300 mr-1 sm:mr-2"></div>
          <span className="text-xs sm:text-sm text-gray-600">Klämdag</span>
        </div>
      )}
      <div className="flex items-center">
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-green-200 border border-green-300 mr-1 sm:mr-2"></div>
        <span className="text-xs sm:text-sm text-gray-600">Semesterdag</span>
      </div>
      <div className="flex items-center">
        <div className="h-3 w-3 sm:h-4 sm:w-4 rounded bg-white border border-gray-200 mr-1 sm:mr-2"></div>
        <span className="text-xs sm:text-sm text-gray-600">Vardag</span>
      </div>
    </div>
  );
};
