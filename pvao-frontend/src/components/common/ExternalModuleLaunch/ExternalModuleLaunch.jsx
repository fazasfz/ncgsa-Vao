/**
 * Wrapper component for redirecting users to external module applications.
 * Displays a splash screen before navigating to external URLs.
 */
import React, { useState } from 'react';
import styles from './ExternalModuleLaunch.module.css';

const FALLBACK_IMG = 'https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg';

export default function ExternalModuleLaunch({ name, description, bgImage, externalUrl, sourceTag }) {
  const [currentBg, setCurrentBg] = useState(bgImage);

  const handleImageError = () => {
    setCurrentBg(FALLBACK_IMG);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.imageContainer}>
        <img 
          src={currentBg} 
          alt={name} 
          className={styles.backgroundImage}
          onError={handleImageError}
        />
        <div className={styles.gradientOverlay}></div>
      </div>
      
      {/* HUD Framing Overlay */}
      <div className={styles.hudOverlay}>
        <div className={styles.cornerTopLeft}></div>
        <div className={styles.cornerTopRight}></div>
        <div className={styles.cornerBottomLeft}></div>
        <div className={styles.cornerBottomRight}></div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.description}>{description}</p>
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.launchButton}
        >
          LAUNCH MODULE ↗
        </a>
        {sourceTag && <p className={styles.sourceTag}>{sourceTag}</p>}
      </div>
    </div>
  );
}
