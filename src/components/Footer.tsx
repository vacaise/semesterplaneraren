import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
const Footer = () => {
  const isMobile = useIsMobile();
  const year = new Date().getFullYear();
  return <footer className={`mt-8 py-8 ${isMobile ? 'px-4' : 'px-8'} bg-gray-50 border-t border-gray-200`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${isMobile ? 'flex flex-col gap-4' : 'flex justify-between'}`}>
          <div>
            <h2 className={`text-lg font-semibold mb-2 ${isMobile ? 'text-center' : ''}`}>
              <Link to="/" className="hover:text-teal-600 transition-colors">vacai</Link>
            </h2>
            <p className={`text-gray-600 text-sm max-w-md ${isMobile ? 'text-center' : ''}`}>Optimera din semester för att maximera din ledighet och röda dagar. vacai hjälper dig att få ut mest möjligt av dina semesterdagar.</p>
          </div>
          
          <div className={`flex ${isMobile ? 'flex-row justify-center mt-4' : 'flex-col items-end'}`}>
            <nav aria-label="Sidfot navigation">
              <ul className={`flex ${isMobile ? 'gap-6' : 'gap-4'}`}>
                <li>
                  <a href="mailto:vacai.se@yahoo.com" className="text-gray-600 hover:text-teal-600 transition-colors text-sm" aria-label="Kontakta oss via e-post">
                    Kontakt
                  </a>
                </li>
                <li>
                  <Link to="/sitemap" className="text-gray-600 hover:text-teal-600 transition-colors text-sm" aria-label="Visa sitemap">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </nav>
            {!isMobile && <p className="text-gray-500 text-xs mt-4">
                &copy; {year} vacai.se. Alla rättigheter förbehållna.
              </p>}
          </div>
        </div>
        
        {isMobile && <p className="text-gray-500 text-xs mt-6 text-center">
            &copy; {year} vacai.se. Alla rättigheter förbehållna.
          </p>}
      </div>
    </footer>;
};
export default Footer;