/**
 * Reusable stylized label component resembling a sci-fi Head-Up Display (HUD) element.
 * Props: text (string).
 */
//HUD stands for Heads-Up Display,This component is a styling tool used to give your Virtual Observatory a highly technical, sci-fi aesthetic. it's meant to be visible all the time as part of the interface design.
import React from 'react';
import styles from './HUDLabel.module.css';

const HUDLabel = ({ text, className = '' }) => {
  return (
    <div className={`${styles.hudLabel} ${className}`}>
      <span className={styles.text}>{text}</span>
    </div>
  );
};

export default HUDLabel;
