import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AstroCopilotContext = createContext(null);

export const AstroCopilotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openCopilot = () => {
    navigate('/astrocopilot');
  };
  const closeCopilot = () => setIsOpen(false);

  return (
    <AstroCopilotContext.Provider value={{ isOpen, openCopilot, closeCopilot, setIsOpen }}>
      {children}
    </AstroCopilotContext.Provider>
  );
};

export const useAstroCopilotContext = () => {
  const context = useContext(AstroCopilotContext);
  if (!context) {
    throw new Error('useAstroCopilotContext must be used within an AstroCopilotProvider');
  }
  return context;
};
