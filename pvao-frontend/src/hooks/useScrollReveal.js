// This watches how far down the user has scrolled. It's used to trigger animations (like making an image fade in or slide up) only when the user actually scrolls down far enough to see it.// pvao-frontend/src/hooks/useScrollReveal.js
import { useEffect, useRef } from 'react';

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already revealed, don't hide again
    if (element.classList.contains('reveal-visible')) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            entry.target.classList.remove('reveal-hidden');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    // Initial state
    element.classList.add('reveal-hidden');
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [optionsKey]);

  return ref;
};
