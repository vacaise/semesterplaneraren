
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error boundary
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Create root and render app
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("App successfully rendered");
  } catch (error) {
    console.error("Failed to render the app:", error);
  }
}
