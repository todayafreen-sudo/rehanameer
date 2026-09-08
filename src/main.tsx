// Global fetch setter safety & error suppression
if (typeof window !== 'undefined') {
  try {
    window.addEventListener('error', (event) => {
      if (event?.message?.includes('fetch') && (event?.message?.includes('only a getter') || event?.message?.includes('Cannot set property'))) {
        event.preventDefault();
      }
    });
  } catch (e) {}
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
