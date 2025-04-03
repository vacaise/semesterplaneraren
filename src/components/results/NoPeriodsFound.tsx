
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const NoPeriodsFound = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center text-gray-500">
        Inga ledighetsperioder hittades för resten av året.
      </CardContent>
    </Card>
  );
};

export default NoPeriodsFound;
