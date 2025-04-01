
import React from 'react';
import { Helmet } from "react-helmet";

const AMP = () => {
  return (
    <div className="container">
      <Helmet>
        <title>vacai | Optimera din semester för maximal ledighet</title>
        <meta name="description" content="Maximera din ledighet med smart semesterplanering. Planera dina semesterdagar optimalt för att få ut mest möjliga ledighet." />
      </Helmet>

      <header className="header">
        <h1>vacai</h1>
        <p>Optimera din semester för maximal ledighet</p>
      </header>

      <div className="card">
        <h2>Planera din semester smartare</h2>
        <p>
          Med vacai kan du planera dina semesterdagar optimalt för att få ut så mycket ledighet som möjligt. 
          Vår algoritm tar hänsyn till röda dagar, helger och optimerar dina semesterdagar.
        </p>
        
        <div style={{ margin: '1.5rem 0' }}>
          <a href="/" className="btn btn-primary">
            Testa vår semesterplanerare
          </a>
        </div>
        
        <h3>Fördelar med vacai:</h3>
        <ul>
          <li>Maximera din lediga tid</li>
          <li>Smarta förslag baserade på röda dagar</li>
          <li>Enkel och användarvänlig</li>
          <li>Helt gratis att använda</li>
        </ul>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} vacai. Alla rättigheter förbehållna.</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/sitemap" style={{ margin: '0 0.5rem', color: '#6B7280' }}>Sitemap</a>
          <a href="/cookie-policy" style={{ margin: '0 0.5rem', color: '#6B7280' }}>Cookie Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default AMP;
