
import { useState } from "react";
import { getHolidays } from "@/utils/holidays";
import { useToast } from "@/hooks/use-toast";

export function useHolidays(initialYear: number) {
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchHolidays = () => {
    setIsLoading(true);
    try {
      console.log("Fetching holidays for year:", initialYear);
      const fetchedHolidays = getHolidays(initialYear);
      console.log("Fetched holidays:", fetchedHolidays);
      setHolidays(fetchedHolidays);
      
      setTimeout(() => {
        toast({
          title: "Röda dagar hämtade",
          description: `${fetchedHolidays.length} helgdagar laddades för ${initialYear}`,
          className: "left-toast",
        });
      }, 100);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      toast({
        title: "Fel vid hämtning av röda dagar",
        description: "Kunde inte hämta röda dagar, försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset holidays when year changes
  const resetHolidays = () => {
    setHolidays([]);
  };

  return {
    holidays,
    setHolidays,
    fetchHolidays,
    resetHolidays,
    isLoading
  };
}
