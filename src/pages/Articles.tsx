
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import MainContainer from "@/components/MainContainer";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Articles = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Artiklar - vacai | Optimera din semester</title>
        <meta name="description" content="Läs våra artiklar om hur du maximerar din semesterledighet och får ut mest av röda dagar." />
        <link rel="canonical" href="https://vacai.se/articles" />
      </Helmet>
      
      <div className="py-6 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader />
          
          <MainContainer currentStep={0}>
            <h1 className="text-2xl font-bold mb-6">Artiklar</h1>
            <p className="text-gray-600 mb-8">
              Här hittar du artiklar med tips och tricks för att optimera din semester och maximera din ledighet.
            </p>
            
            <div className="space-y-8">
              <Card className="overflow-hidden">
                <div className="h-48 md:h-64 overflow-hidden">
                  <img 
                    src="/lovable-uploads/c4795cb2-1487-49ec-bb68-32c569b64d35.png" 
                    alt="Strand och hav" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Maxa din semester 2025 – Så utnyttjar du röda dagar bäst med Vacai.se</CardTitle>
                  <CardDescription>Få långledigt utan att slösa för många semesterdagar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Att få långledigt utan att slösa för många semesterdagar är en konst. Med hjälp av Vacai.se, som hjälper dig att få ut mest av dina röda dagar, kan du enkelt planera för maximal ledighet. Här är en detaljerad guide för 2025.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/articles/maxa-semester-2025" className="w-full">
                    <Button className="w-full">Läs mer</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-48 md:h-64 overflow-hidden">
                  <img 
                    src="/lovable-uploads/495120c8-c6de-417b-b374-799cea773fb9.png" 
                    alt="Flytring i pool" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Optimera din ledighet 2026 med Vacai.se</CardTitle>
                  <CardDescription>De bästa tipsen för långledighet 2026</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    2026 erbjuder flera möjligheter till långledighet. Här är de bästa tipsen baserade på årets röda dagar, maximerade med hjälp av Vacai.se.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/articles/optimera-ledighet-2026" className="w-full">
                    <Button className="w-full">Läs mer</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </MainContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Articles;
