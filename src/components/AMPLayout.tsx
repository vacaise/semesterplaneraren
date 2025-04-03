
import React from 'react';

interface AMPLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const AMPLayout: React.FC<AMPLayoutProps> = ({ 
  children, 
  title = "vacai | Maxa din ledighet",
  description = "Maximera din ledighet med smart semesterplanering. Planera dina semesterdagar optimalt för att få ut mest möjliga ledighet."
}) => {
  return (
    <div className="amp-container">
      <div className="amp-content">
        {children}
      </div>
      
      <footer className="amp-footer">
        <p>© {new Date().getFullYear()} vacai</p>
        <div className="amp-footer-links">
          <a href="/sitemap">Sitemap</a>
          <a href="/cookie-policy">Cookie Policy</a>
          <a href="/articles">Artiklar</a>
        </div>
      </footer>
    </div>
  );
};

export default AMPLayout;
