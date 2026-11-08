/**
 * Renders a scrollable list of lunar surface features based on current filters and search.
 * Computes derived display properties like distance.
 * Props: features (array), selectedId (string), onSelect (function).
 */
import React, { memo } from 'react';

import styles from './FeatureList.module.css';

const FeatureList = ({ features, loading, selectedFeatureId, onSelectFeature }) => {
  if (loading) {
    return (
      <div className={styles.listContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.featureItem} style={{ opacity: 0.5 }}>
            <div className={styles.featureInfo}>
              <div style={{ width: '120px', height: '14px', backgroundColor: 'var(--slate-ui)', marginBottom: '4px' }}></div>
              <div style={{ width: '80px', height: '10px', backgroundColor: 'var(--slate-ui)', opacity: 0.5 }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (features.length === 0) {
    return <div className={styles.emptyState}>No features found.</div>;
  }

  return (
    <div className={styles.listContainer}>
      {features.map((feature) => (
        <div
          key={feature.id}
          className={`${styles.featureItem} ${selectedFeatureId === feature.id ? styles.featureItemActive : ''}`}
          onClick={() => {
            onSelectFeature(feature.id);
          }}
        >
          <div className={styles.featureInfo}>
            <span className={styles.featureName}>{feature.name}</span>
            <span className={styles.featureCategory}>{feature.category}</span>
          </div>
          <span style={{color: 'rgba(255,255,255,0.4)'}}>{'>'}</span>
        </div>
      ))}
    </div>
  );
};

export default memo(FeatureList);
