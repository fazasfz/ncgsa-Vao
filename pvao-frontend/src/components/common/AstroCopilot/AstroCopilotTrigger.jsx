import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';
import styles from './AstroCopilotTrigger.module.css';

const AstroCopilotTrigger = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasClicked, setHasClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasClicked) {
      setShowTooltip(false);
      return;
    }

    const timer = setInterval(() => {
      setShowTooltip((prev) => !prev);
    }, 3000);

    return () => clearInterval(timer);
  }, [hasClicked]);

  const handleClick = (e) => {
    e.preventDefault();
    setHasClicked(true);
    navigate('/astrocopilot');
  };

  return (
    <button className={styles.triggerButton} onClick={handleClick} aria-label="Open Astro-Copilot">
      <div className={styles.pulseRing}></div>
      <div className={styles.pulseRingDelayed}></div>
      <div className={styles.iconContainer}>
        <Bot size={28} className={styles.icon} />
      </div>
      <div className={`${styles.popup} ${!showTooltip ? styles.popupHidden : ''}`}>Ask away stargazer</div>
    </button>
  );
};

export default AstroCopilotTrigger;

