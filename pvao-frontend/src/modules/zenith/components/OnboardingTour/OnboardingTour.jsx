/**
 * Manages the state and flow of the Zenith onboarding tutorial.
 * Renders sequential tour steps to introduce users to the Sky Portal features.
 * Props: isOpen (boolean), onClose (function).
 */
import React, { useState, useEffect } from 'react';
import styles from './OnboardingTour.module.css';
import { tourSteps } from './tourSteps.data';
import TourStep from './TourStep';

const OnboardingTour = ({ isOpen, onClose }) => {
  const [stepIndex, setStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false); // Default to false so it opens

  useEffect(() => {
    if (isOpen) {
      setIsCompleted(false);
      setStepIndex(-1); // Start from welcome screen when manually opened
    }
  }, [isOpen]);

  const handleStart = () => setStepIndex(0);
  
  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleNext = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    if (onClose) onClose();
  };

  if (isCompleted && !isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      {stepIndex === -1 ? (
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeBadge}>SKY PORTAL GUIDE</div>
          <h2 className={styles.welcomeTitle}>Zenith Toolbar & Controls</h2>
          <p className={styles.welcomeText}>
            Quick 11-step tour covering all bottom toolbar icons, deep space viewing modes, location setup, and time simulation.
          </p>
          <div className={styles.welcomeActions}>
            <button onClick={handleComplete} className={styles.secondaryButton}>Skip</button>
            <button onClick={handleStart} className={styles.primaryButton}>Start Tutorial</button>
          </div>
        </div>
      ) : (
        <TourStep 
          step={tourSteps[stepIndex]}
          currentStepIndex={stepIndex}
          totalSteps={tourSteps.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleComplete}
          isLast={stepIndex === tourSteps.length - 1}
        />
      )}
    </div>
  );
};

export default OnboardingTour;
