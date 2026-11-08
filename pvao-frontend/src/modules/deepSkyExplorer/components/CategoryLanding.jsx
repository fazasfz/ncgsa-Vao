/**
 * Displays the landing page for the Deep Sky Explorer.
 * Renders selectable category cards (Nebulas, Star Clusters, Galaxies) for the user to explore.
 * Props: onSelectCategory (function).
 */
import React from 'react';
import nebulaImg from '../../../assets/images/modules/nebula.webp';
import starClusterImg from '../../../assets/images/modules/starCluster.jpeg';
import galaxyImg from '../../../assets/images/modules/galaxy.webp';
import styles from './CategoryLanding.module.css';

const categories = [
  {
    key: 'nebulas',
    tag: 'Stellar Nursery',
    title: 'Nebulas',
    description:
      'Giant clouds of gas and dust in space. Some are where new stars are being born; others are the remains of stars that have died.',
    image: nebulaImg,
  },
  {
    key: 'starClusters',
    tag: 'Gravitational Systems',
    title: 'Star Clusters',
    description:
      'Groups of hundreds to millions of stars, all born from the same cloud and held together by gravity.',
    image: starClusterImg,
  },
  {
    key: 'galaxies',
    tag: 'Island Universes',
    title: 'Galaxies',
    description:
      'Massive systems containing billions of stars, gas, dust, and dark matter. Our own home, the Milky Way, is one example.',
    image: galaxyImg,
  },
];

export default function CategoryLanding({ onSelectCategory }) {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.headerSection}>
        <div className={styles.badgeHeader}>
          <span className={styles.badgeDot} />
          DEEP SKY CATALOGS
        </div>
        <h1 className={styles.mainTitle}>
          Deep Sky Explorer
        </h1>
        <p className={styles.subTitle}>
          Select a category below to observe deep sky objects.
        </p>
      </div>

      <div className={styles.cardsGrid}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(cat.key)}
            className={styles.categoryCard}
            type="button"
            aria-label={`Explore ${cat.title}`}
          >
            <div className={styles.cardImageWrapper}>
              <div
                className={styles.cardImage}
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className={styles.cardImageOverlay} />
              <span className={styles.cardBadgePill}>{cat.tag}</span>
              <div className={styles.liveIndicator}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{cat.title}</h2>
                <p className={styles.cardDescription}>
                  {cat.description}
                </p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.exploreBtn}>
                  Explore <span className={styles.exploreArrow}>→</span>
                </span>
                <div className={styles.actionPill}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}