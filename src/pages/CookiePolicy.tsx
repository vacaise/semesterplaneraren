
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
              Vår webbplats använder cookies för att förbättra din upplevelse och för att ge oss insikter om hur vår webbplats används. Cookies är små textfiler som placeras på din enhet när du besöker vår webbplats.
            </p>
            
            <h3>Vilka cookies använder vi?</h3>
            <ul>
              <li>
                <strong>Nödvändiga cookies:</strong> Dessa krävs för att webbplatsen ska fungera korrekt. De låter dig navigera på webbplatsen och använda dess funktioner. Dessa cookies kan inte stängas av.
              </li>
              <li>
                <strong>Analytiska cookies (Google Analytics):</strong> Vi använder Google Analytics för att samla in anonym information om hur besökare använder vår webbplats. Dessa cookies hjälper oss att förbättra vår webbplats genom att spåra information som antal besökare, vilka sidor som besökts och hur lång tid besökare spenderar på webbplatsen.
              </li>
            </ul>
            
            <h3>Google Analytics cookies</h3>
            <p>
              Google Analytics använder följande cookies:
            </p>
            <ul>
              <li>
                <strong>_ga:</strong> Används för att skilja mellan användare. Varaktighet: 2 år.
              </li>
              <li>
                <strong>_gid:</strong> Används för att skilja mellan användare. Varaktighet: 24 timmar.
              </li>
              <li>
                <strong>_gat:</strong> Används för att begränsa antalet förfrågningar. Varaktighet: 1 minut.
              </li>
            </ul>
            
            <p>
              Google Analytics samlar in information anonymt. Den lagrar information som:
            </p>
            <ul>
              <li>Antalet besökare på webbplatsen</li>
              <li>Vilka sidor besökare ser på vår webbplats</li>
              <li>Hur lång tid besökare stannar på våra sidor</li>
              <li>Webbläsare och enhetstyper som används</li>
              <li>Var besökare kommer ifrån (geografiskt och från vilka webbplatser)</li>
            </ul>
            
            <h3>Dina val gällande cookies</h3>
            <p>
              Du kan välja vilka typer av cookies du vill acceptera:
            </p>
            <ul>
              <li><strong>Neka alla cookies:</strong> Inga cookies förutom de som är absolut nödvändiga för webbplatsens funktion kommer att användas.</li>
              <li><strong>Endast nödvändiga cookies:</strong> Endast cookies som är nödvändiga för webbplatsens grundläggande funktioner kommer att användas.</li>
              <li><strong>Godkänn alla cookies:</strong> Alla cookies, inklusive analytiska cookies, kommer att användas.</li>
            </ul>
            
            <h3>Hantera cookies i din webbläsare</h3>
            <p>
              Du kan även hantera cookies direkt i din webbläsare. De flesta webbläsare låter dig:
            </p>
            <ul>
              <li>Se vilka cookies du har och radera dem individuellt</li>
              <li>Blockera cookies från tredje part</li>
              <li>Blockera cookies från specifika webbplatser</li>
              <li>Blockera alla cookies</li>
              <li>Radera alla cookies när du stänger din webbläsare</li>
            </ul>
            
            <p>
              Observera att om du väljer att blockera cookies kan det påverka din upplevelse på vår webbplats, eftersom vissa funktioner kanske inte fungerar som de ska.
            </p>
            
            <h3>Ändra dina cookie-inställningar</h3>
            <p>
              Om du vill ändra dina cookie-inställningar senare kan du göra det genom att rensa cookies för vår webbplats i din webbläsare och besöka oss igen. Då kommer du att få möjlighet att göra ett nytt val.
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
