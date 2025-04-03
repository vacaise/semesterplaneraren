
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if the page is loading in AMP mode
const isAmpMode = window.location.pathname.includes('/amp') || 
                   window.location.search.includes('amp=1');

// If it's AMP, add AMP-specific adaptations
if (isAmpMode) {
  document.documentElement.setAttribute('amp', '');
}

// Create root and render app
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  root.render(<App />);
}
