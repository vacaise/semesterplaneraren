
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Calendar, CalendarDays, Sun, Snowflake, Leaf } from "lucide-react";

const BreakTypeExplanation = () => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Ledighetstyper</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 text-purple-800 p-2 rounded-full">
              <Scale className="h-4 w-4" />
            </div>
            <div className="text-sm">Balanserad mix</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-sm">Långhelger</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-teal-100 text-teal-800 p-2 rounded-full">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="text-sm">Miniledigheter</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
              <Sun className="h-4 w-4" />
            </div>
            <div className="text-sm">Veckor</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-green-100 text-green-800 p-2 rounded-full">
              <Leaf className="h-4 w-4" />
            </div>
            <div className="text-sm">Långa semestrar</div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-indigo-100 text-indigo-800 p-2 rounded-full">
              <Snowflake className="h-4 w-4" />
            </div>
            <div className="text-sm">Specialledigheter</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreakTypeExplanation;
