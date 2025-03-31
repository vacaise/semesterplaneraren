
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticCardProps {
  value: number | string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const StatisticCard = ({ 
  value, 
  label, 
  bgColor, 
  borderColor, 
  textColor 
}: StatisticCardProps) => {
  // Förbättrad logik för att hantera och visa värden
  const displayValue = (() => {
    if (typeof value === 'number') {
      if (label === "Effektivitet") {
        // Garantera 2 decimaler för effektivitet och lägg till "x" som suffix
        return `${value.toFixed(2)}x`;
      } else if (Number.isInteger(value)) {
        // För heltal, visa utan decimaler
        return value.toString();
      } else {
        // För decimaltal, visa med 1 decimal
        return value.toFixed(1);
      }
    } else if (value === null || value === undefined) {
      return "0";
    } else if (typeof value === 'string') {
      // Hantera fall där värdet redan är en sträng
      if (value.includes('NaN')) {
        return "0";
      }
      return value;
    }
    return value;
  })();

  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardContent className="pt-6">
        <div className="text-center">
          <h3 className={`text-xl font-semibold ${textColor}`}>{displayValue}</h3>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};
