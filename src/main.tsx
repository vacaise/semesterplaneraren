
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize Google Analytics event tracking
if (window.gtag) {
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <App />
);
