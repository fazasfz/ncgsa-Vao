/**
 * Root entry point for the Zenith Sky Portal module.
 * Integrates the Stellarium Web iframe for full-sky navigation and manages the interactive onboarding tour.
 */
import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

import OnboardingTour from './components/OnboardingTour/OnboardingTour';

const Zenith = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const toggleTour = () => {
    setIsTourOpen(!isTourOpen);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', paddingTop: '72px', boxSizing: 'border-box', overflow: 'hidden', backgroundColor: '#000' }}>
      <iframe 
        src="https://stellarium-web.org/" 
        title="Stellarium Web" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      ></iframe>
      
      <button 
        onClick={toggleTour}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '1.5rem',
          backgroundColor: 'var(--bg-obsidian, rgba(20, 20, 20, 0.9))',
          border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
          color: 'var(--starlight, #F4EFE6)',
          padding: '0.5rem',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.color = 'var(--brass)';
          e.currentTarget.style.borderColor = 'var(--brass)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.color = 'var(--starlight, #F4EFE6)';
          e.currentTarget.style.borderColor = 'var(--border-subtle, rgba(255,255,255,0.1))';
        }}
        title="Re-open Tutorial"
      >
        <HelpCircle size={20} />
      </button>

      <OnboardingTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </div>
  );
};

export default Zenith;
