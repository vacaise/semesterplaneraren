
import { useIsMobile } from "@/hooks/use-mobile";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { Helmet } from "react-helmet";

const CookiePolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cookie Policy | vacai</title>
        <meta name="description" content="Cookie policy för vacai - information om hur vi använder cookies." />
      </Helmet>
      <PageHeader />

      <main className={`flex-1 ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="max-w-4xl mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Vad är cookies?</h2>
            <p className="mb-4">
              Cookies är små textfiler som lagras på din enhet (dator, surfplatta eller mobil) när du besöker en webbplats. 
              Cookies hjälper webbplatsen att komma ihåg dina inställningar och preferenser för att förbättra din upplevelse.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Vilka cookies använder vi?</h2>
            <p className="mb-3">
              På vacai.se använder vi följande typer av cookies:
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2">Nödvändiga cookies</h3>
            <p className="mb-3">
              Dessa cookies är nödvändiga för att webbplatsen ska fungera korrekt och kan inte stängas av i våra system.
              De lagrar vanligtvis bara information som svarar på dina handlingar, såsom att ställa in sekretesspreferenser, 
              fylla i formulär eller tillhandahålla säkra inloggningar.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Analytiska cookies (Google Analytics)</h3>
            <p className="mb-3">
              Vi använder Google Analytics för att samla information om hur besökare använder vår webbplats. Dessa cookies 
              hjälper oss att förbättra vår webbplats genom att spåra information som antalet besökare, varifrån besökare 
              har kommit till webbplatsen och vilka sidor de besöker.
            </p>
            <p className="mb-3">
              Google Analytics använder följande primära cookies:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>_ga</strong> - Används för att skilja på användare och har en giltighetstid på 2 år</li>
              <li><strong>_gid</strong> - Används för att skilja på användare och har en giltighetstid på 24 timmar</li>
              <li><strong>_gat</strong> - Används för att begränsa antalet förfrågningar och har en giltighetstid på 1 minut</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Hur länge lagras cookies?</h2>
            <p className="mb-4">
              Hur länge cookies lagras på din enhet beror på om det är en "permanent" eller "sessionscookie". 
              Permanenta cookies kommer att vara kvar på din enhet tills de går ut eller tills du tar bort dem. 
              Sessionscookies tas bort när du stänger din webbläsare.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Hur du hanterar cookies</h2>
            <p className="mb-3">
              De flesta webbläsare tillåter dig att hantera dina cookie-inställningar genom att:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Blockera alla cookies</li>
              <li>Ta bort cookies från din enhet</li>
              <li>Blockera cookies från särskilda webbplatser</li>
              <li>Blockera cookies från tredje part</li>
              <li>Rensa all browserdata när webbläsaren stängs</li>
            </ul>
            <p>
              Om du väljer att blockera cookies kan det påverka din upplevelse av vår webbplats, 
              eftersom vissa funktioner kanske inte fungerar korrekt.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Ändringar i vår cookie policy</h2>
            <p className="mb-4">
              Vi kan uppdatera vår cookie policy från tid till annan. Vi rekommenderar att du regelbundet besöker den här 
              sidan för att hålla dig informerad om eventuella ändringar.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Kontakta oss</h2>
            <p>
              Om du har några frågor angående vår cookie policy, vänligen kontakta oss på: 
              <a href="mailto:vacai.se@yahoo.com" className="text-teal-600 hover:underline ml-1">
                vacai.se@yahoo.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
