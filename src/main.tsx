import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize Lovable tagger
if (import.meta.env.DEV) {
  const { componentTagger } = await import('lovable-tagger');
  componentTagger();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
