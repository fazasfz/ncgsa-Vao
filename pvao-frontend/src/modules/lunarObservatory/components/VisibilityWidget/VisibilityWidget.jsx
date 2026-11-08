/**
 * Displays badges indicating what optical equipment is needed to view a lunar feature.
 * Props: visibility (object).
 */
import React from 'react';

import styles from './VisibilityWidget.module.css';

const VISIBILITY_LABELS = { 
  naked_eye: { label: 'Naked Eye' },
  binoculars: { label: 'Binoculars' },
  telescope: { label: 'Telescope' }
};

export default function VisibilityWidget({ visibility }) {
  if (!visibility) return null;
  
  return (
    <div className={styles.widgetWrapper}>
      <div className={styles.header}>Can it be seen?</div>
      <div className={styles.badges}>
        {Object.entries(VISIBILITY_LABELS).map(([key, config]) => {
          const isVisible = visibility[key];
          
          return (
            <div 
              key={key} 
              className={`${styles.badge} ${isVisible ? styles.visible : styles.notVisible}`}
              title={isVisible ? `Visible with ${config.label}` : `Difficult/Not visible with ${config.label}`}
            >
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
