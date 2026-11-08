/**
 * Displays a color-coded legend of geologic periods (e.g., Copernican, Imbrian) for lunar features.
 * Computes color mappings based on the feature's era.
 * Props: feature (object).
 */
import React, { useState } from 'react';

import styles from './GeologicLegend.module.css';

const GEOLOGIC_PERIODS = [
  { name: 'Copernican', color: '#fff700' },
  { name: 'Eratosthenian', color: '#14c800' },
  { name: 'Imbrian', color: '#0078ff' },
  { name: 'Nectarian', color: '#ff9600' },
  { name: 'Pre-Nectarian', color: '#a05000' },
  { name: 'Undivided Materials', color: '#cccccc' },
];

const GeologicLegend = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.legendContainer}>
      <button className={styles.toggleButton} onClick={() => setIsOpen(!isOpen)}>
        <span>[ L ]</span>
        Legend
        {isOpen ? <span>^</span> : <span>v</span>}
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.legendTitle}>Geologic Periods</div>
          <div className={styles.legendList}>
            {GEOLOGIC_PERIODS.map((period) => (
              <div key={period.name} className={styles.legendItem}>
                <div 
                  className={styles.colorSwatch} 
                  style={{ backgroundColor: period.color }} 
                />
                <span className={styles.itemLabel}>{period.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeologicLegend;
