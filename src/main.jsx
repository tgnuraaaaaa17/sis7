import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router';
import App from './App.jsx';
import './styles/index.css';
import './styles/pages.css';

// HashRouter keeps the route after "#", so direct links and page refresh work
// on GitHub Pages (a static host that knows nothing about /places/5).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      });
      registration.update().catch(() => {});
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}
