
import React, { useEffect } from 'react';

/**
 * En komponent som bekräftar att Google Analytics är korrekt laddat
 * och visar ett meddelande i konsolen.
 */
const AnalyticsVerifier = () => {
  useEffect(() => {
    // Kontrollera om Google Analytics är tillgängligt
    if (window.gtag) {
      console.log('Google Analytics är korrekt laddat');
    } else {
      console.warn('Google Analytics verkar inte vara laddat korrekt');
    }
  }, []);

  // Returnerar ingenting synligt
  return null;
};

export default AnalyticsVerifier;
