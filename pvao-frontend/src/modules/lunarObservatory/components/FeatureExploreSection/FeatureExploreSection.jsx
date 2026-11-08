/**
 * Main exploration layout combining the lunar map viewer and feature list.
 * Manages category filtering, search, and active feature selection.
 * Props: catalogue, viewMode.
 */
import React from 'react';
import styles from './FeatureExploreSection.module.css';
import SectionHeading from '../../../../components/common/SectionHeading/SectionHeading';
import FeatureSearch from '../FeatureSearch/FeatureSearch';
import CategoryFilters from '../CategoryFilters/CategoryFilters';
import FeatureList from '../FeatureList/FeatureList';

const FeatureExploreSection = ({ 
    searchTerm, setSearchTerm, 
    activeCategory, setActiveCategory, 
    features, catalogLoading, 
    selectedFeatureId, onSelectFeature 
}) => {
    return (
        <section className={styles.exploreSection}>
            <div className={styles.exploreCard}>
                <div className={styles.controlsRow}>
                    <div className={styles.searchContainer}>
                        <FeatureSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    </div>
                    <div className={styles.filtersContainer}>
                        <CategoryFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                    </div>
                </div>
                <div className={styles.listContainer}>
                    <FeatureList 
                        features={features} 
                        loading={catalogLoading} 
                        selectedFeatureId={selectedFeatureId}
                        onSelectFeature={onSelectFeature} 
                    />
                </div>
            </div>
        </section>
    );
};

export default FeatureExploreSection;
