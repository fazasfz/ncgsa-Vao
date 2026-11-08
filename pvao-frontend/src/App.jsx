/**
 * Root application component.
 * Configures the router provider and wraps the app in global contexts.
 */
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { useBreakpoint } from './hooks/useBreakpoint';

function App() {
  const { width } = useBreakpoint();

  useEffect(() => {
    if (width <= 1024) {
      document.documentElement.classList.add('mobile-layout');
    } else {
      document.documentElement.classList.remove('mobile-layout');
    }
  }, [width]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
