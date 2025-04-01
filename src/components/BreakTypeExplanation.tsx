
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BreakTypeExplanation = () => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Förklaring av ledighetstyper</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <div className="font-medium text-red-800 mb-1">Helgdagsledigheter</div>
            <p className="text-gray-600">Ledigheter kring stora högtider som jul, påsk och midsommar.</p>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-teal-800 mb-1">Bryggdagar</div>
            <p className="text-gray-600">Ledigheter som skapas genom att ta ledigt mellan helgdagar och helger.</p>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-yellow-800 mb-1">Långhelger</div>
            <p className="text-gray-600">Förlängda helger med en eller två extra lediga dagar.</p>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-blue-800 mb-1">Sommarsemester</div>
            <p className="text-gray-600">Längre ledigheter under sommarmånaderna.</p>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-indigo-800 mb-1">Vintersemester</div>
            <p className="text-gray-600">Ledigheter under vinterhalvåret, perfekt för sportlov.</p>
          </div>
          
          <div className="text-sm">
            <div className="font-medium text-orange-800 mb-1">Höstsemester</div>
            <p className="text-gray-600">Ledigheter under hösten, lämpliga för höstlov.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakTypeExplanation;
