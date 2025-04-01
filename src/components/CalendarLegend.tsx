
import React from "react";

export const CalendarLegend = () => {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <div className="flex items-center">
        <div className="h-4 w-4 rounded bg-red-200 mr-2"></div>
        <span className="text-sm text-gray-600">Röd dag</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 rounded bg-orange-100 mr-2"></div>
        <span className="text-sm text-gray-600">Helg</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 rounded bg-green-200 border border-green-300 mr-2"></div>
        <span className="text-sm text-gray-600">Semesterdag</span>
      </div>
      <div className="flex items-center">
        <div className="h-4 w-4 rounded bg-white border border-gray-200 mr-2"></div>
        <span className="text-sm text-gray-600">Vardag</span>
      </div>
    </div>
  );
};
