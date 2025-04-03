
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sidan hittades inte</h2>
        <p className="text-gray-500 mb-8">
          Sidan du söker verkar inte finnas. Den kan ha tagits bort eller flyttats.
        </p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Tillbaka till startsidan
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
