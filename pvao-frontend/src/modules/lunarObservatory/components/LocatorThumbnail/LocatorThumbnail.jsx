/**
 * Renders a mini 3D globe indicating the global coordinates of the selected feature.
 * Props: feature (object).
 */
import React from 'react';
import styles from './LocatorThumbnail.module.css';

const LocatorThumbnail = ({ feature }) => {
  if (!feature || feature.longitude == null || feature.latitude == null) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.locator}>
        <div
          className={styles.locatorDot}
          style={{
            left: `${((feature.longitude + 180) / 360) * 100}%`,
            top: `${((90 - feature.latitude) / 180) * 100}%`,
          }}
        />
      </div>
      <div className={styles.caption}>The Earth-facing side of the Moon is shown</div>
    </div>
  );
};

export default LocatorThumbnail;
