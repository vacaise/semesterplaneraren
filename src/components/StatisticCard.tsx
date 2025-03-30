
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
  // Make sure the value is valid (not NaN or undefined)
  const displayValue = typeof value === 'number' && isNaN(value) ? "0" : value;

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
