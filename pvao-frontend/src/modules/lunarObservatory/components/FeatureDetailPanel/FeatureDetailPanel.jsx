/**
 * Sidebar panel displaying detailed information about a selected lunar feature.
 * Renders telemetry, geologic legend, and a 3D locator thumbnail.
 * Props: selectedFeature (object), onClear (function).
 */
import React from 'react';

import VisibilityWidget from '../VisibilityWidget/VisibilityWidget';
import LocatorThumbnail from '../LocatorThumbnail/LocatorThumbnail';
import styles from './FeatureDetailPanel.module.css';

const FeatureDetailPanel = ({ feature, nearbyFeatures, onClose, onSelectFeature }) => {
  const isOpen = !!feature;

  return (
    <div className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOpen : ''}`}>
      {feature ? (
        <>
          <div className={styles.drawerHeader}>
            <div className={styles.titleGroup}>
              <h2 className={styles.title}>{feature.name}</h2>
              <span className={styles.categoryTag}>{feature.category}</span>
            </div>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close panel">
              <span>[X]</span>
            </button>
          </div>

          <div className={styles.drawerContent}>
            <p className={styles.description}>{feature.description}</p>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Coordinates & Size</h3>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Latitude</span>
                <span className={styles.dataValue}>{feature.latitude != null ? `${feature.latitude.toFixed(2)}°` : 'Unknown'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Longitude</span>
                <span className={styles.dataValue}>{feature.longitude != null ? `${feature.longitude.toFixed(2)}°` : 'Unknown'}</span>
              </div>
              <div className={styles.dataRow}>
                <span className={styles.dataLabel}>Diameter</span>
                <span className={styles.dataValue}>{feature.diameter != null ? `${feature.diameter.toFixed(1)} km` : 'Unknown'}</span>
              </div>
            </div>
            

            {feature.visibility && (
              <VisibilityWidget visibility={feature.visibility} />
            )}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Nearby Features</h3>
              {nearbyFeatures && nearbyFeatures.length > 0 ? (
                <div className={styles.nearbyList}>
                  {nearbyFeatures.slice(0, 2).map(nearby => (
                    <div 
                      key={nearby.id} 
                      className={styles.nearbyItem}
                      onClick={() => onSelectFeature(nearby.id)}
                    >
                      <span className={styles.nearbyName}>{nearby.name}</span>
                      <span className={styles.nearbyDist}>{nearby.distance_km} km</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.dataLabel}>No nearby features found.</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>Select a feature to view details</div>
      )}
    </div>
  );
};

export default FeatureDetailPanel;
