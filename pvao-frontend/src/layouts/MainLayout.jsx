import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar/Navbar';
import Footer from '../components/common/Footer/Footer';
import AstroCopilotTrigger from '../components/common/AstroCopilot/AstroCopilotTrigger';
import { AstroCopilotProvider } from '../context/AstroCopilotContext';

const MainLayout = () => {
  const location = useLocation();
  const isWorkspace =
    location.pathname.startsWith('/astrocopilot') ||
    location.pathname.startsWith('/astro-copilot');

  return (
    <AstroCopilotProvider>
      <Navbar />
      <main style={{ minHeight: '100vh', width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
      {!isWorkspace && <AstroCopilotTrigger />}
    </AstroCopilotProvider>
  );
};

export default MainLayout;
