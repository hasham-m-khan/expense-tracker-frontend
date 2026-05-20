import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.ts';
import { ToastProvider } from '@/contexts/ToastContext/ToastProvider';
import { ThemeProvider } from './contexts/ThemeContext/ThemeProvider.tsx';

import './index.css'

// Create a client
const queryClient = new QueryClient();
const router = createRouter({ 
  routeTree,
  context: {
    queryClient,
  },
 });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
