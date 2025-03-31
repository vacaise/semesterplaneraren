
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAllCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const acceptNecessaryCookies = () => {
    // Set Google Analytics to respect Do Not Track
    window.gtag?.("consent", "update", {
      analytics_storage: "denied",
    });
    localStorage.setItem("cookie-consent", "necessary");
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold mb-2">Cookies på vår webbplats</h2>
            <p className="text-sm text-gray-600 mb-2">
              Vi använder cookies för att förbättra din upplevelse på vår webbplats. Genom att klicka "Acceptera alla" 
              samtycker du till vår användning av cookies. Du kan också välja att endast acceptera nödvändiga cookies.
            </p>
            <p className="text-sm text-gray-600">
              Läs mer om hur vi använder cookies i vår{" "}
              <Link to="/cookie-policy" className="text-teal-600 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          <button 
            onClick={closeBanner}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Stäng cookie-meddelande"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex gap-3 mt-4 justify-end">
          <Button 
            variant="outline" 
            onClick={acceptNecessaryCookies}
          >
            Endast nödvändiga
          </Button>
          <Button 
            onClick={acceptAllCookies}
          >
            Acceptera alla
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
