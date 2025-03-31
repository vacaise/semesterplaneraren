
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
  // Display value formatting
  const displayValue = (() => {
    if (typeof value === 'number') {
      if (label === "Effektivitet") {
        // Add "x" suffix for efficiency
        return `${value}x`;
      } else if (Number.isInteger(value)) {
        // For integers, display without decimals
        return value.toString();
      } else {
        // For decimals, display with 1 decimal
        return value.toFixed(1);
      }
    } else if (value === null || value === undefined) {
      return "0";
    } else if (typeof value === 'string') {
      // Handle case where value is already a string
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
