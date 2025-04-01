
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Footer = () => {
  const isMobile = useIsMobile();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 py-8 mt-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
          <div>
            <p className="text-sm text-gray-500">
              © {currentYear} vacai • Maximera din ledighet
            </p>
          </div>
          <div className="flex gap-4">
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
