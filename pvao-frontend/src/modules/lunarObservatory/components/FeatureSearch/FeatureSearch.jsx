/**
 * Search input component for filtering the lunar feature catalogue by name.
 * Props: searchTerm (string), onSearchChange (function).
 */
import React, { useState, useEffect } from 'react';

import styles from './FeatureSearch.module.css';

const FeatureSearch = ({ searchTerm, setSearchTerm }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(localSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, setSearchTerm]);

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search lunar features..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
      />
    </div>
  );
};

export default FeatureSearch;
