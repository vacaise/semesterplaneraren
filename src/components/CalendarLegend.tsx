
import React from "react";

export const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex items-center">
        <div className="h-4 w-4 bg-purple-400 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Semester</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-amber-300 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Röd dag</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-blue-200 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Helg</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 bg-gray-100 border border-gray-200 rounded-sm mr-1"></div>
        <span className="text-xs text-gray-600">Arbetsdag</span>
      </div>
    </div>
  );
};
