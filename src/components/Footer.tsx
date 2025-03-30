
import React from "react";
import { CalendarDays, Heart, Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Om vacai</h3>
            <p className="text-gray-600 text-sm">
              Optimera din semester med vacai. Vi hjälper dig maximera din lediga tid genom att strategiskt planera dina semesterdagar.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Kontakt</h3>
            <div className="flex items-center space-x-2 text-gray-600 text-sm mb-2">
              <Mail size={16} />
              <span>info@vacai.se</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Följ oss</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-6 pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} vacai. Alla rättigheter förbehållna.</p>
          <p className="mt-2 flex items-center justify-center">
            Skapad med <Heart size={14} className="mx-1 text-red-500" /> för bättre semesterplanering
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
