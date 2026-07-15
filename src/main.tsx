import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { initializeAnalytics } from './analytics';
import CookieConsent from './components/CookieConsent';
import "antd/dist/reset.css";
initializeAnalytics();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <CookieConsent />
  </React.StrictMode>
);
