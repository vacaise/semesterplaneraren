
import React from "react";

export const CalendarLegend = () => {
  return (
    <div className="flex items-center gap-3 mb-4" role="legend" aria-label="Kalenderförklaring">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-green-200 rounded" aria-hidden="true"></div>
        <span className="text-sm text-gray-600">Semesterdagar</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-red-200 rounded" aria-hidden="true"></div>
        <span className="text-sm text-gray-600">Röda dagar</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-orange-100 rounded" aria-hidden="true"></div>
        <span className="text-sm text-gray-600">Helg</span>
      </div>
    </div>
  );
};
