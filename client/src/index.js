import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { APP_VERSION } from './cache-bust';

// Clear any existing service workers and cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

// Clear cache storage
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (let name of names) {
      caches.delete(name);
    }
  });
}

// Version check and force refresh if needed
const STORAGE_KEY = 'pawrx_app_version';
const currentVersion = localStorage.getItem(STORAGE_KEY);
if (currentVersion && currentVersion !== APP_VERSION) {
  // Clear all storage and reload
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload(true);
} else {
  localStorage.setItem(STORAGE_KEY, APP_VERSION);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 