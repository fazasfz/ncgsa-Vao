/**
 * Renders an SVG representation of the moon's current phase and illumination.
 * Computes SVG arc geometries based on illumination percentage.
 * Props: liveData (object), loading (boolean).
 */
import React from 'react';
import styles from './MoonPhaseSnapshot.module.css';

export default function MoonPhaseSnapshot({ liveData, loading }) {
  if (loading || !liveData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading Snapshot...</div>
      </div>
    );
  }

  const { phase_name, illumination_percentage } = liveData;
  const isWaning = phase_name.toLowerCase().includes('waning') || phase_name.toLowerCase().includes('third');
  const illum = illumination_percentage / 100;

  const rx = 98 * Math.abs(1 - 2 * illum);
  const sweepOuter = isWaning ? 0 : 1;
  
  let sweepInner;
  if (!isWaning) {
    sweepInner = illum <= 0.5 ? 0 : 1;
  } else {
    sweepInner = illum <= 0.5 ? 1 : 0;
  }

  return (
    <div className={styles.container}>
      <div className={styles.shotLabel}>2D IMAGE OF MOON</div>
      <svg viewBox="0 0 200 200" className={styles.moonSvg}>
        <circle cx="100" cy="100" r="98" className={styles.moonBg} />
        <path 
          d={`
            M 100, 2
            A 98,98 0 0,${sweepOuter} 100,198
            A ${rx},98 0 0,${sweepInner} 100,2
          `}
          className={styles.moonLit}
        />
      </svg>
    </div>
  );
}
