import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowWidth <= 640,
    isTablet: windowWidth <= 1024 && windowWidth > 640,
    isDesktop: windowWidth > 1024,
    width: windowWidth,
  };
};
