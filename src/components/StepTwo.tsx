
import { 
  Calendar, 
  Coffee, 
  Star, 
  SunsetIcon, 
  Palmtree,
  Info, 
  Zap
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { OptimizationStrategy } from "@/utils/vacationOptimizer/types";

interface StepTwoProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

const StepTwo = ({ selectedMode, setSelectedMode }: StepTwoProps) => {
  const isMobile = useIsMobile();
  
  // Update modes to match new optimizer strategies
  const modes = [
    {
      id: "balanced",
      title: "Balanserad mix",
      description: "En smart blandning av kortare ledigheter och längre semestrar",
      icon: <Zap className="h-6 w-6 text-blue-600" />,
      recommended: true
    },
    {
      id: "longWeekends",
      title: "Långhelger",
      description: "Fler 3-4 dagars helger genom året",
      icon: <Coffee className="h-6 w-6 text-blue-600" />
    },
    {
      id: "miniBreaks",
      title: "Miniledigheter",
      description: "Flera kortare 5-6 dagars ledigheter utspridda över året",
      icon: <Star className="h-6 w-6 text-blue-600" />
    },
    {
      id: "weekLongBreaks",
      title: "Veckor",
      description: "Fokuserar på 7-9 dagars ledighet för längre perioder",
      icon: <SunsetIcon className="h-6 w-6 text-blue-600" />
    },
    {
      id: "extendedVacations",
      title: "Långa semestrar",
      description: "Längre 10-15 dagars ledigheter för djupare avkoppling",
      icon: <Palmtree className="h-6 w-6 text-blue-600" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-50 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center font-medium">2</div>
        <h3 className="text-xl font-medium text-gray-800">Välj din stil</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <Info className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Välj hur du vill fördela din tid. Detta påverkar längden och frekvensen på dina ledigheter under året.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-gray-600">
        Välj hur du vill fördela din ledighet. Detta påverkar längden och frekvensen av dina ledigheter under året.
      </p>
      
      <RadioGroup
        value={selectedMode}
        onValueChange={setSelectedMode}
        className="space-y-3"
      >
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`flex ${isMobile ? 'flex-col' : 'items-center'} space-x-0 ${isMobile ? 'space-y-2' : 'space-x-4'} p-4 rounded-lg border transition-all ${
              selectedMode === mode.id
                ? "border-blue-300 bg-blue-50"
                : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
            }`}
          >
            <div className={`flex ${isMobile ? 'w-full' : ''} items-center gap-3`}>
              <RadioGroupItem
                value={mode.id}
                id={mode.id}
                className="h-5 w-5"
              />
              <div className="flex items-center justify-center h-12 w-12 bg-blue-100 rounded-md">
                {mode.icon}
              </div>
              <div className={`${isMobile ? 'flex-1' : ''}`}>
                <div className="flex items-center">
                  <Label
                    htmlFor={mode.id}
                    className="text-base font-medium cursor-pointer"
                  >
                    {mode.title}
                  </Label>
                  {mode.recommended && (
                    <span className="ml-2 text-xs rounded-full bg-blue-100 text-blue-800 px-2 py-1">
                      Rekommenderad
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className={`text-sm text-gray-600 ${isMobile ? 'pl-8' : 'mt-1'}`}>{mode.description}</p>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default StepTwo;
