import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary.jsx';
import { queryClient } from './lib/queryClient';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
);
