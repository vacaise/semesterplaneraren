
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import App from './app/page';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <App />
    </AppRouterCacheProvider>
  </React.StrictMode>,
);
