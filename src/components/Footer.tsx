
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { FileText } from "lucide-react";

const Footer = () => {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 py-8 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
          <div className="flex flex-col items-start gap-2">
            <Link to="/" className="inline-block">
              <img 
                src="/lovable-uploads/ef09cd5d-3465-4f0e-9e46-40a2da0cf965.png" 
                alt="vacai logo" 
                className="h-8"
              />
            </Link>
            <p className="text-sm text-gray-500">
              © {currentYear} vacai • Maximera din ledighet
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/articles"
              className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
            >
              <FileText size={16} />
              Artiklar
            </Link>
            <a
              href="mailto:vacai.se@yahoo.com"
              className="text-sm text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
            >
              <Mail size={16} />
              Kontakt
            </a>
            <a
              href="/sitemap"
              className="text-sm text-gray-500 hover:text-gray-800 transition"
            >
              Sitemap
            </a>
            <a
              href="/cookie-policy"
              className="text-sm text-gray-500 hover:text-gray-800 transition"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
