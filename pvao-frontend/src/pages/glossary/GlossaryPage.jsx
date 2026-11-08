/**
 * Glossary page for the Virtual Astronomical Observatory.
 * Defines domain-specific terms used throughout all observatory modules and astronomical tools.
 */
import React, { useState, useMemo } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import glossaryData from '../../data/glossaryData.json';
import styles from './GlossaryPage.module.css';

const GlossaryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    return ['ALL', ...glossaryData.map(c => c.category)];
  }, []);

  const totalTermsCount = useMemo(() => {
    return glossaryData.reduce((acc, cat) => acc + cat.terms.length, 0);
  }, []);

  const filteredData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return glossaryData
      .filter(categoryGroup => {
        if (selectedCategory !== 'ALL' && categoryGroup.category !== selectedCategory) {
          return false;
        }
        return true;
      })
      .map(categoryGroup => {
        const matchingTerms = categoryGroup.terms.filter(term => {
          if (!q) return true;
          return (
            term.name.toLowerCase().includes(q) ||
            term.desc.toLowerCase().includes(q) ||
            categoryGroup.category.toLowerCase().includes(q)
          );
        });

        return {
          ...categoryGroup,
          terms: matchingTerms
        };
      })
      .filter(categoryGroup => categoryGroup.terms.length > 0);
  }, [searchQuery, selectedCategory]);

  const matchedTermsCount = useMemo(() => {
    return filteredData.reduce((acc, cat) => acc + cat.terms.length, 0);
  }, [filteredData]);

  return (
    <SectionWrapper id="glossary" className={styles.glossarySection} overlay={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>ASTROPHYSICAL REFERENCE</div>
          <h1 className={styles.heading}>ASTRONOMICAL GLOSSARY</h1>
          <p className={styles.subheading}>
            Comprehensive dictionary of scientific definitions, telemetry metrics, and observational terminology ({totalTermsCount} terms across {glossaryData.length} disciplines)
          </p>
        </div>
        
        <div className={styles.controlsContainer}>
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              className={styles.searchInput} 
              placeholder="Search by keyword, mission, instrument, or formula (e.g. Exora, SDO, HiPS, Transit, Libration)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search glossary"
            />
            {searchQuery && (
              <button 
                type="button" 
                className={styles.clearBtn} 
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.filterChips}>
            {categories.map((cat, idx) => {
              const isActive = selectedCategory === cat;
              const shortLabel = cat === 'ALL' ? 'All Disciplines' : cat.split('(')[0].trim();
              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.chip} ${isActive ? styles.chipActive : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          <div className={styles.statusBar}>
            <span>Showing <strong className={styles.accentText}>{matchedTermsCount}</strong> of {totalTermsCount} terms</span>
            {(searchQuery || selectedCategory !== 'ALL') && (
              <button 
                type="button" 
                className={styles.resetFilterBtn}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
        
        <div className={styles.contentArea}>
          {filteredData.length > 0 ? (
            filteredData.map((categoryGroup, index) => (
              <div key={index} className={styles.categoryBlock}>
                <div className={styles.categoryHeader}>
                  <h2 className={styles.categoryTitle}>{categoryGroup.category}</h2>
                  <span className={styles.categoryCount}>({categoryGroup.terms.length})</span>
                </div>
                <div className={styles.strip}>
                  {categoryGroup.terms.map((term, idx) => (
                    <div key={idx} className={styles.termItem}>
                      <span className={styles.termName}>{term.name}</span>
                      <p className={styles.termDesc}>{term.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>No astronomical terms found matching &ldquo;{searchQuery}&rdquo;</p>
              <button 
                type="button"
                className={styles.resetFilterBtn}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

export default GlossaryPage;
