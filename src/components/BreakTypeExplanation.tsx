
import React from "react";

const BreakTypeExplanation = () => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
        Långhelg
      </div>
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
        Klämdag
      </div>
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
        Sommarsemester
      </div>
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
        Runt helgdag
      </div>
      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
        Veckoledighet
      </div>
    </div>
  );
};

export default BreakTypeExplanation;
