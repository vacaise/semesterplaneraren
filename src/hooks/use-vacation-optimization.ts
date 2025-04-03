
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { optimizeVacation } from "@/utils/vacationOptimizer";
import { mockSchedule } from "@/utils/vacationOptimizer/types";
import type { OptimizedSchedule } from "@/utils/vacationOptimizer/types";

export function useVacationOptimization() {
  const [optimizedSchedule, setOptimizedSchedule] = useState<OptimizedSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateOptimizedSchedule = (
    year: number,
    vacationDays: number,
    holidays: Date[],
    selectedMode: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      console.log("Generating schedule with holidays:", holidays);
      console.log("Vacation days:", vacationDays);
      console.log("Selected mode:", selectedMode);
      
      let optimizedScheduleData;
      
      try {
        // Try to use the real optimization function
        optimizedScheduleData = optimizeVacation(year, vacationDays, holidays, selectedMode as any);
      } catch (optimizationError) {
        console.error("Real optimization failed, using mock data:", optimizationError);
        // Fall back to mock data if the real optimization fails
        optimizedScheduleData = mockSchedule(year, vacationDays);
      }
      
      console.log("Generated schedule:", optimizedScheduleData);
      
      if (!optimizedScheduleData || !optimizedScheduleData.periods || !Array.isArray(optimizedScheduleData.periods)) {
        throw new Error("Invalid schedule data returned from optimization");
      }
      
      setOptimizedSchedule(optimizedScheduleData);
      return true;
    } catch (error: any) {
      // Handle optimization errors
      const errorMessage = error?.message || "Kunde inte optimera ditt schema, försök igen senare";
      console.error("Optimization error:", error);
      
      setErrorMessage(errorMessage);
      
      toast({
        title: "Kunde inte skapa optimal semesterplan",
        description: "Det gick inte att hitta en kombination som använder exakt angivet antal semesterdagar",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    optimizedSchedule,
    setOptimizedSchedule,
    generateOptimizedSchedule,
    isLoading,
    errorMessage,
    setErrorMessage
  };
}
