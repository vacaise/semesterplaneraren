
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();
  
  return (
    <footer className={`mt-8 py-8 ${isMobile ? 'px-4' : 'px-8'} bg-gray-50 border-t border-gray-200`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex justify-between'}`}>
          <div>
            <h2 className={`text-lg font-semibold mb-2 ${isMobile ? 'text-center' : ''}`}>vacai</h2>
            <p className={`text-gray-600 text-sm max-w-md ${isMobile ? 'text-center' : ''}`}>
              Optimera din semester för att maximera din ledighet. vacai hjälper dig att få ut mest möjligt av dina semesterdagar.
            </p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-row justify-center mt-4' : 'flex-col items-end'}`}>
            <div className={`flex ${isMobile ? 'gap-6' : 'gap-4'}`}>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Om oss</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Kontakt</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Hjälp</a>
            </div>
            {!isMobile && (
              <p className="text-gray-500 text-xs mt-4">
                &copy; {year} vacai. Alla rättigheter förbehållna.
              </p>
            )}
          </div>
        </div>
        
        {isMobile && (
          <p className="text-gray-500 text-xs mt-6 text-center">
            &copy; {year} vacai. Alla rättigheter förbehållna.
          </p>
        )}
      </div>
    </footer>
  );
};

export default Footer;
