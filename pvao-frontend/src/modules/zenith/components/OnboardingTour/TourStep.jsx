import React from 'react';
import styles from './OnboardingTour.module.css';

const TourStep = ({ step, onNext, onPrev, onSkip, isLast, totalSteps, currentStepIndex }) => {
  return (
    <div className={styles.tourCard}>
      <div className={styles.tourImageContainer}>
        <img src={step.image} alt={step.title} className={styles.tourImage} />
        <div className={styles.imageGlowRing} />
      </div>

      {/* Progress Line */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }} 
        />
      </div>

      <div className={styles.tourContent}>
        <div className={styles.tourHeader}>
          <h3 className={styles.tourTitle}>{step.title}</h3>
          <span className={styles.stepCounter}>{currentStepIndex + 1} / {totalSteps}</span>
        </div>

        <p className={styles.tourDescription}>{step.description}</p>

        <div className={styles.tourActions}>
          <button onClick={onSkip} className={styles.skipButton} type="button">
            Skip
          </button>

          <div className={styles.navGroup}>
            {currentStepIndex > 0 && (
              <button onClick={onPrev} className={styles.prevButton} type="button">
                ← Back
              </button>
            )}
            <button onClick={onNext} className={styles.nextButton} type="button">
              {isLast ? "Got it ✓" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourStep;

