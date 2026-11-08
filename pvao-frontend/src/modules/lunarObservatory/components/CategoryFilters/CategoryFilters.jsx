/**
 * Renders a row of filter buttons to select lunar feature categories (e.g., Crater, Mare).
 * Props: categories (array), activeCategory (string), onSelectCategory (function).
 */
import React from 'react';
import styles from './CategoryFilters.module.css';

const CATEGORIES = ['All', 'Crater', 'Mare', 'Satellite Feature', 'Statio', 'Oceanus', 'Mons', 'Vallis', 'Rupes'];

const CategoryFilters = ({ activeCategory, setActiveCategory }) => {
  return (
    <div className={styles.filterContainer}>
      {CATEGORIES.map(category => (
        <button
          type="button"
          key={category}
          className={`${styles.chip} ${activeCategory === category ? styles.chipActive : ''}`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
