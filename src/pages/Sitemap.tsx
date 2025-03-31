
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import MainContainer from "@/components/MainContainer";
import PageHeader from "@/components/PageHeader";
import Footer from "@/components/Footer";

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Sitemap - vacai | Optimera din semester</title>
        <meta name="description" content="Sitemap för vacai semesteroptimeringsverktyget." />
        <link rel="canonical" href="https://vacai.se/sitemap" />
      </Helmet>
      
      <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader />
          
          <MainContainer currentStep={0}>
            <h1 className="text-2xl font-bold mb-6">Sitemap</h1>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-4">Huvudsida</h2>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <Link to="/" className="text-teal-600 hover:underline">
                      Startsida - Semesteroptimering
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimera din semester för att maximera din ledighet.
                    </p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Verktyg</h2>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <p className="text-gray-800">
                      Semesteroptimering (på startsidan)
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Verktyg för att optimera din semester baserat på dina tillgängliga dagar.
                    </p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Artiklar</h2>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <Link to="/articles" className="text-teal-600 hover:underline">
                      Alla artiklar
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Översikt över alla våra semestertips och guider.
                    </p>
                  </li>
                  <li>
                    <Link to="/articles/maxa-semester-2025" className="text-teal-600 hover:underline">
                      Maxa din semester 2025
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Få ut mest av röda dagar under 2025.
                    </p>
                  </li>
                  <li>
                    <Link to="/articles/optimera-ledighet-2026" className="text-teal-600 hover:underline">
                      Optimera din ledighet 2026
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Planera för långledighet under 2026.
                    </p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Stödsidor</h2>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <Link to="/sitemap" className="text-teal-600 hover:underline">
                      Sitemap
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Översikt över alla sidor på webbplatsen.
                    </p>
                  </li>
                  <li>
                    <Link to="/cookie-policy" className="text-teal-600 hover:underline">
                      Cookie Policy
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      Information om hur vi använder cookies på webbplatsen.
                    </p>
                  </li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4">Kontakt</h2>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <a href="mailto:vacai.se@yahoo.com" className="text-teal-600 hover:underline">
                      Kontakta oss
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Skicka ett e-postmeddelande till vårt team.
                    </p>
                  </li>
                </ul>
              </section>
            </div>
          </MainContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sitemap;
