
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface StepOneProps {
  year: number;
  setYear: (year: number) => void;
  vacationDays: number;
  setVacationDays: (days: number) => void;
}

const StepOne = ({ year, setYear, vacationDays, setVacationDays }: StepOneProps) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="year">Välj år för semesterplanering</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                y === year
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vacationDays">Antal semesterdagar ({vacationDays})</Label>
        <div className="flex items-center space-x-4">
          <Slider
            id="vacationDays"
            defaultValue={[vacationDays]}
            max={40}
            min={1}
            step={1}
            onValueChange={(val) => setVacationDays(val[0])}
            className="flex-1"
          />
          <Input
            type="number"
            id="vacationDaysInput"
            value={vacationDays}
            onChange={(e) => setVacationDays(Number(e.target.value))}
            className="w-20"
            min={1}
            max={40}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          De flesta svenskar har rätt till 25 dagar lagstadgad semester per år
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="font-medium text-blue-800 mb-2">Tips</h3>
        <p className="text-sm text-gray-600">
          Genom att strategiskt planera dina semesterdagar runt röda dagar kan du få ut flera extra lediga dagar utan att använda semesterdagar.
        </p>
      </div>
    </div>
  );
};

export default StepOne;
