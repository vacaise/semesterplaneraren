
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-6 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0 pr-8">
          <p className="text-sm text-gray-600">
            Vi använder cookies för att förbättra din upplevelse. Genom att fortsätta använda vår 
            webbplats godkänner du vår{" "}
            <Link to="/cookie-policy" className="text-blue-600 hover:underline">
              cookie policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="sm" onClick={acceptCookies}>
            Jag förstår
          </Button>
          <button
            onClick={acceptCookies}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Stäng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
