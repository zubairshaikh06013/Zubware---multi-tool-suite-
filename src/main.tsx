import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Keep browser error reporting intact. Suppressing every uncaught error hides
// broken tool scripts and prevents monitoring from detecting real failures.
window.addEventListener('error', (event) => {
  console.error('Uncaught application error:', event.message, event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled application promise rejection:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

