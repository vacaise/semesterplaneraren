
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preferences
    const cookiePreference = localStorage.getItem("cookiePreference");
    if (!cookiePreference) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookiePreference", "all");
    
    // Update Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
    
    setShowBanner(false);
  };

  const acceptEssentialCookies = () => {
    localStorage.setItem("cookiePreference", "essential");
    
    // Update Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    setShowBanner(false);
  };

  const rejectAllCookies = () => {
    localStorage.setItem("cookiePreference", "none");
    
    // Update Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:px-6 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0 pr-8">
          <p className="text-sm text-gray-600">
            Vi använder cookies för att analysera trafik och förbättra din upplevelse. Du kan välja vilka cookies du vill tillåta genom att klicka på motsvarande knapp. Läs mer i vår{" "}
            <Link to="/cookie-policy" className="text-blue-600 hover:underline">
              cookie policy
            </Link>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="outline" onClick={rejectAllCookies}>
            Neka alla
          </Button>
          <Button size="sm" variant="outline" onClick={acceptEssentialCookies}>
            Endast nödvändiga
          </Button>
          <Button size="sm" onClick={acceptAllCookies}>
            Godkänn alla
          </Button>
          <button
            onClick={rejectAllCookies}
            className="text-gray-400 hover:text-gray-600 ml-2"
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
