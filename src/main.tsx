import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import CookieConsent from './components/CookieConsent';
import "antd/dist/reset.css";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <CookieConsent />
  </React.StrictMode>
);
