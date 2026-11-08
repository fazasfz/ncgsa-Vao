/**
 * Layout wrapper for the lunar feature details view.
 * Computes nearby features and renders the FeatureDetailPanel.
 * Props: selectedFeature, nearbyFeatures, onClear.
 */
import React from 'react';
import styles from './FeatureDetailsSection.module.css';
import FeatureDetailPanel from '../FeatureDetailPanel/FeatureDetailPanel';

const FeatureDetailsSection = ({ 
    selectedFeature, 
    nearbyFeatures, 
    onCloseFeature, 
    onSelectFeature
}) => {
    return (
        <section className={styles.detailsSection}>

            
            <div className={styles.singleColumnLayout}>
                {selectedFeature ? (
                    <div className={styles.featurePanelWrapper}>
                        <FeatureDetailPanel 
                            feature={selectedFeature} 
                            nearbyFeatures={nearbyFeatures} 
                            onClose={onCloseFeature}
                            onSelectFeature={onSelectFeature}
                        />
                    </div>
                ) : (
                    <div className={styles.emptyStateCard}>
                        <p>Select a feature from the Explore section or map to see details.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeatureDetailsSection;
