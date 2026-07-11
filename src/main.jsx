import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </ErrorBoundary>
  </StrictMode>,
);
