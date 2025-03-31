
import React from "react";
import { 
  Coffee, 
  Star, 
  SunsetIcon, 
  Palmtree
} from "lucide-react";

export const BreakTypeExplanation = () => {
  return (
    <div className="p-4 border border-purple-100 rounded-lg bg-purple-50/50">
      <h4 className="text-gray-800 font-medium mb-3">Förstå dina ledighetstyper</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-white rounded-md">
              <Coffee className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h5 className="font-medium text-green-800">Långhelg</h5>
              <p className="text-sm text-gray-600">3-4 dagar ledigt runt en helg</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-white rounded-md">
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h5 className="font-medium text-amber-800">Miniledighet</h5>
              <p className="text-sm text-gray-600">5-6 dagar för en snabb getaway</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-white rounded-md">
              <SunsetIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h5 className="font-medium text-blue-800">Veckoledighet</h5>
              <p className="text-sm text-gray-600">7-9 dagar för en ordentlig semester</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="p-2 bg-white rounded-md">
              <Palmtree className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h5 className="font-medium text-purple-800">Längre ledighet</h5>
              <p className="text-sm text-gray-600">10-15 dagar för en utökad semester</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
