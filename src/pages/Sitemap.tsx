
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sitemap = () => {
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
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Sitemap</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-3">Huvudsidor</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-600 hover:underline">
                    Startsida - Optimera din semester
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="text-blue-600 hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium text-gray-800 mb-3">Funktioner</h2>
              <ul className="space-y-2 text-gray-600">
                <li>Steg 1: Välj år och semesterdagar</li>
                <li>Steg 2: Välj semesterstil (längd och fördelning)</li>
                <li>Steg 3: Hantera röda dagar</li>
                <li>Resultat: Optimerade semesterperioder</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
