
import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Home, Download } from "lucide-react";

interface ActionButtonsProps {
  resetToStart: () => void;
  exportToICal: () => void;
  isMobile: boolean;
}

const ActionButtons = ({ resetToStart, exportToICal, isMobile }: ActionButtonsProps) => {
  return (
    <div className={`flex flex-wrap gap-3 mb-6 ${isMobile ? 'justify-between' : ''}`}>
      <Button onClick={resetToStart} className="flex items-center gap-2">
        <RotateCcw className="h-4 w-4" />
        Börja om
      </Button>
      
      {!isMobile && (
        <Button variant="outline" onClick={resetToStart} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Tillbaka till start
        </Button>
      )}
      
      <Button 
        variant="outline" 
        onClick={exportToICal} 
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {isMobile ? 'Exportera' : 'Exportera kalender'}
      </Button>
    </div>
  );
};

export default ActionButtons;
