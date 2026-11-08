/**
 * SVG-based moon phase icon.
 * Dynamically computes and renders the illumination phase.
 */
import React from 'react';
import styles from './LunarPhasePanel.module.css';

export default function MoonPhaseIcon({ phase }) {
  // phase goes from 0 (new) to 0.5 (full) to 1.0 (new)
  const isWaning = phase > 0.5;
  const illum = isWaning ? (1.0 - phase) * 2 : phase * 2; // 0 to 1
  
  const rx = 10 * Math.abs(1 - 2 * illum);
  const sweepOuter = isWaning ? 0 : 1;
  
  let sweepInner;
  if (!isWaning) {
    sweepInner = illum <= 0.5 ? 0 : 1;
  } else {
    sweepInner = illum <= 0.5 ? 1 : 0;
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.moonIcon}>
      <circle cx="12" cy="12" r="10" className={styles.moonBg} />
      <path 
        d={`
          M 12, 2
          A 10,10 0 0,${sweepOuter} 12,22
          A ${rx},10 0 0,${sweepInner} 12,2
        `}
        className={styles.moonLit}
      />
    </svg>
  );
}
