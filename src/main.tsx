
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Kontrollera om sidan laddas i AMP-läge
const isAmpMode = window.location.pathname.includes('/amp') || 
                   window.location.search.includes('amp=1');

// Om det är AMP, lägg till AMP-specifika anpassningar
if (isAmpMode) {
  document.documentElement.setAttribute('amp', '');
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <App />
);
