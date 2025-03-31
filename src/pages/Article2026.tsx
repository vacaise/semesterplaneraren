
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import MainContainer from "@/components/MainContainer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ArticleStructuredData from "@/components/StructuredData";

const Article2026 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Optimera din ledighet 2026 med Vacai.se | vacai</title>
        <meta name="description" content="Maximera din ledighet 2026 - planera smart kring röda dagar med hjälp av Vacai.se för att få längre sammanhängande semesterperioder." />
        <link rel="canonical" href="https://vacai.se/articles/optimera-ledighet-2026" />
      </Helmet>
      
      <ArticleStructuredData 
        title="Optimera din ledighet 2026 med Vacai.se"
        description="Maximera din ledighet 2026 - planera smart kring röda dagar med hjälp av Vacai.se för att få längre sammanhängande semesterperioder."
        imageUrl="https://vacai.se/lovable-uploads/495120c8-c6de-417b-b374-799cea773fb9.png"
        datePublished="2024-05-30"
        url="https://vacai.se/articles/optimera-ledighet-2026"
      />
      
      <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader />
          
          <MainContainer currentStep={0}>
            <div className="mb-6">
              <Link to="/articles" className="text-teal-600 hover:underline">&larr; Tillbaka till artiklar</Link>
            </div>
            
            <div className="mb-8">
              <div className="h-64 md:h-80 w-full overflow-hidden rounded-lg mb-6">
                <img 
                  src="/lovable-uploads/495120c8-c6de-417b-b374-799cea773fb9.png" 
                  alt="Flytring i pool" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Optimera din ledighet 2026 med Vacai.se</h1>
              
              <div className="prose max-w-none">
                <p className="text-lg mb-6">
                  2026 erbjuder flera möjligheter till långledighet. Här är de bästa tipsen baserade på årets röda dagar, maximerade med hjälp av Vacai.se.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Påsken – Perfekt start på våren</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Röda dagar: Långfredagen (3 april), Påskdagen (5 april), Annandag påsk (6 april).</li>
                  <li>Tips: Ta fyra dagar ledigt före eller efter helgen (31 mars–3 april eller 7–10 april) och få tio dagars sammanhängande vila.</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Kristi himmelsfärd – Smidig långhelg i maj</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Infaller torsdagen den 14 maj.</li>
                  <li>Ta ledigt fredagen den 15 maj för en fyradagarshelg. Kombinera detta med Pingstdagen den 24 maj genom att ta ytterligare fyra semesterdagar veckan efter, vilket ger elva dagars sammanhängande ledighet.</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Midsommar – Sommaren börjar här</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Midsommarafton infaller fredagen den 19 juni.</li>
                  <li>Ta fyra semesterdagar veckan innan midsommar (15–18 juni) så får du nio dagars sammanhängande vila.</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Julen – Maximera årets slut</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Julafton infaller torsdagen den 24 december, följt av Juldagen på fredagen.</li>
                  <li>Tips: Ta tre semesterdagar före jul (21–23 december) och ytterligare tre efter nyår för totalt sexton dagars vila mellan den 19 december och den 3 januari.</li>
                </ul>
                
                <p className="text-lg mt-8 mb-6">
                  Med Vacai.se blir det enkelt att hitta de bästa dagarna för långledighet.
                </p>
                
                <div className="mt-8">
                  <Link to="/">
                    <Button size="lg">Maxa din ledighet!</Button>
                  </Link>
                </div>
              </div>
            </div>
          </MainContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Article2026;
