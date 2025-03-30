
import { 
  Calendar, 
  Coffee, 
  Star, 
  SunsetIcon, 
  Palmtree 
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StepTwoProps {
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
}

const StepTwo = ({ selectedMode, setSelectedMode }: StepTwoProps) => {
  const modes = [
    {
      id: "balanced",
      title: "Balanserad mix",
      description: "En smart blandning av kortare ledigheter och längre semestrar",
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      recommended: true
    },
    {
      id: "longweekends",
      title: "Långhelger",
      description: "Fler 3-4 dagars helger genom året",
      icon: <Coffee className="h-6 w-6 text-blue-600" />
    },
    {
      id: "minibreaks",
      title: "Miniledigheter",
      description: "Flera kortare 5-6 dagars ledigheter utspridda över året",
      icon: <Star className="h-6 w-6 text-blue-600" />
    },
    {
      id: "weeks",
      title: "Veckor",
      description: "Fokuserar på 7-9 dagars ledighet för längre perioder",
      icon: <SunsetIcon className="h-6 w-6 text-blue-600" />
    },
    {
      id: "extended",
      title: "Långa semestrar",
      description: "Längre 10-15 dagars ledigheter för djupare avkoppling",
      icon: <Palmtree className="h-6 w-6 text-blue-600" />
    }
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Välj hur du vill fördela din ledighet. Detta påverkar längden och frekvensen av dina ledigheter under året.
      </p>
      
      <RadioGroup
        value={selectedMode}
        onValueChange={setSelectedMode}
        className="space-y-4"
      >
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
              selectedMode === mode.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
            }`}
          >
            <RadioGroupItem
              value={mode.id}
              id={mode.id}
              className="h-5 w-5"
            />
            <div className="min-w-12">
              {mode.icon}
            </div>
            <div className="flex-1">
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
              <p className="text-sm text-gray-600 mt-1">{mode.description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default StepTwo;
