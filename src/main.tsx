import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';

async function renderApplication() {
  const root = ReactDOM.createRoot(document.getElementById('root')!);

  if (window.location.pathname.startsWith('/admin')) {
    await import('antd/dist/reset.css');
    const { default: AdminApp } = await import('./admin/AdminApp');
    root.render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>,
    );
    return;
  }

  const [{ default: App }, { default: CookieConsent }] = await Promise.all([
    import('./App'),
    import('./components/CookieConsent'),
  ]);
  root.render(
    <React.StrictMode>
      <App />
      <CookieConsent />
    </React.StrictMode>,
  );
}

void renderApplication();
