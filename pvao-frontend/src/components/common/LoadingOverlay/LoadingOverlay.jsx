import React, { useState, useEffect } from 'react';
import styles from './LoadingOverlay.module.css';

const DEFAULT_STATUS_MESSAGES = [
  'INITIALIZING TELEMETRY',
  'ESTABLISHING LINK TO OBSERVATORY',
  'CALIBRATING INSTRUMENTS',
  'FETCHING LIVE DATA'
];

const LoadingOverlay = ({ 
  funFacts = [], 
  statusMessages = DEFAULT_STATUS_MESSAGES,
  intervalMs = 3000,
  themeColor = 'var(--brass)'
}) => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statusMessages.length);
      if (funFacts && funFacts.length > 0) {
        setFactIndex(prev => (prev + 1) % funFacts.length);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [statusMessages, funFacts, intervalMs]);

  // If no funFacts array is provided, or it's empty, we just don't render that section
  const currentFact = (funFacts && funFacts.length > 0) ? funFacts[factIndex] : null;

  return (
    <div className={styles.overlay} style={{ '--theme-color': themeColor }}>
      <div className={styles.spinnerContainer}>
        <div className={styles.ringOuter}></div>
        <div className={styles.ringInner}></div>
        <div className={styles.core}></div>
      </div>
      
      <div className={styles.statusText}>
        {statusMessages[statusIndex]}
      </div>

      {currentFact && (
        <div className={styles.funFactContainer} key={factIndex}>
          <div className={styles.funFactLabel}>DID YOU KNOW?</div>
          <div className={styles.funFactText}>{currentFact}</div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
