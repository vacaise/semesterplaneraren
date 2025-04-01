
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link to="/" className="inline-flex items-center">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Tillbaka till startsidan
            </Link>
          </Button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Cookie Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <h2>Information om cookies</h2>
            <p>
              Vår webbplats använder cookies för att förbättra din upplevelse. Cookies är små textfiler som placeras på din enhet när du besöker vår webbplats.
            </p>
            
            <h3>Vilka cookies använder vi?</h3>
            <ul>
              <li>
                <strong>Nödvändiga cookies:</strong> Dessa krävs för att webbplatsen ska fungera korrekt. De låter dig navigera på webbplatsen och använda dess funktioner.
              </li>
              <li>
                <strong>Preferenscookies:</strong> Dessa cookies hjälper oss att komma ihåg dina inställningar och preferenser, såsom språkval och andra anpassningsalternativ.
              </li>
              <li>
                <strong>Analytiska cookies:</strong> Vi använder analytiska cookies för att förstå hur besökare interagerar med vår webbplats. Dessa hjälper oss att förbättra vår webbplats och dess innehåll.
              </li>
            </ul>
            
            <h3>Hur länge sparas cookies?</h3>
            <p>
              Cookies kan vara antingen "permanenta" eller "sessionscookies". En permanent cookie finns kvar på din enhet under den period som anges i cookien, medan en sessionscookie försvinner när du stänger din webbläsare.
            </p>
            
            <h3>Hantera cookies</h3>
            <p>
              De flesta webbläsare låter dig kontrollera cookies genom dina inställningar. Du kan vanligtvis:
            </p>
            <ul>
              <li>Se vilka cookies du har och radera dem individuellt</li>
              <li>Blockera cookies från tredje part</li>
              <li>Blockera cookies från specifika webbplatser</li>
              <li>Blockera alla cookies</li>
              <li>Radera alla cookies när du stänger din webbläsare</li>
            </ul>
            
            <p>
              Om du väljer att blockera cookies kan det påverka din upplevelse på vår webbplats, eftersom vissa funktioner kanske inte fungerar som de ska.
            </p>
            
            <h3>Ändringar i vår cookie policy</h3>
            <p>
              Vi kan uppdatera vår cookie policy då och då. Om vi gör det, kommer vi att meddela dig genom att publicera den nya policyn på denna sida.
            </p>
            
            <h3>Kontakta oss</h3>
            <p>
              Om du har några frågor om våra cookies eller denna policy, kontakta oss gärna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
