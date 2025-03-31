
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import MainContainer from "@/components/MainContainer";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import ArticleStructuredData from "@/components/StructuredData";

const Article2025 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Maxa din semester 2025 – Så utnyttjar du röda dagar bäst | vacai</title>
        <meta name="description" content="Få ut maximalt av din ledighet under 2025 med optimerad semesterplanering kring röda dagar med hjälp av Vacai.se." />
        <link rel="canonical" href="https://vacai.se/articles/maxa-semester-2025" />
      </Helmet>
      
      <ArticleStructuredData 
        title="Maxa din semester 2025 – Så utnyttjar du röda dagar bäst med Vacai.se"
        description="Få ut maximalt av din ledighet under 2025 med optimerad semesterplanering kring röda dagar med hjälp av Vacai.se."
        imageUrl="https://vacai.se/lovable-uploads/c4795cb2-1487-49ec-bb68-32c569b64d35.png"
        datePublished="2024-05-30"
        url="https://vacai.se/articles/maxa-semester-2025"
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
                  src="/lovable-uploads/c4795cb2-1487-49ec-bb68-32c569b64d35.png" 
                  alt="Strand och hav" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Maxa din semester 2025 – Så utnyttjar du röda dagar bäst med Vacai.se</h1>
              
              <div className="prose max-w-none">
                <p className="text-lg mb-6">
                  Att få långledigt utan att slösa för många semesterdagar är en konst. Med hjälp av Vacai.se, som hjälper dig att få ut mest av dina röda dagar, kan du enkelt planera för maximal ledighet. Här är en detaljerad guide för 2025.
                </p>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Påsken 2025 – 10 dagars ledighet med 4 semesterdagar</h2>
                <p>Påsken infaller under vecka 16:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Röda dagar: Långfredagen (18 april) och Annandag påsk (21 april).</li>
                  <li>Tips: Ta ledigt 15–18 april eller 22–25 april och få totalt 10 dagars ledighet (12–21 april eller 18–27 april).</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Kristi himmelsfärd och Nationaldagen – Kombinera för långledigt</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Kristi himmelsfärdsdag: Torsdag 29 maj.</li>
                  <li>Nationaldagen: Fredag 6 juni.</li>
                  <li>Tips: Ta ledigt mellan dessa datum (30 maj samt 2–5 juni) och få hela 11 dagars ledighet (29 maj–8 juni) med bara 5 semesterdagar.</li>
                </ul>
                
                <h2 className="text-2xl font-semibold mt-8 mb-4">Jul och nyår – Upp till 18 dagars ledigt</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Röda dagar: Julafton (24 december), Juldagen (25 december), Annandag jul (26 december), Nyårsdagen (1 januari).</li>
                  <li>Tips: Ta semester den 22, 23, 29 och 30 december samt den 2 och 5 januari för att få hela 18 dagars ledighet (20 december–6 januari).</li>
                </ul>
                
                <p className="text-lg mt-8 mb-6">
                  Använd Vacai.se för att enkelt planera dessa perioder och få ut det mesta av din semester!
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

export default Article2025;
