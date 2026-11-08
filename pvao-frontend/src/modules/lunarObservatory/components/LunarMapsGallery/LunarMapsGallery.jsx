import React, { useState, useEffect } from 'react';
import styles from './LunarMapsGallery.module.css';

const lunarMapsData = [
  {
    id: 'usgs-geologic',
    title: 'USGS Unified Geologic Map',
    badge: 'Geologic Stratigraphy',
    src: '/assets/maps/Geographic.jpg',
    description: 'Comprehensive global geologic synthesis mapping Apollo-era stratigraphy, basin ring structures, and volcanic mare units.'
  },
  {
    id: 'lola-terrain',
    title: 'LOLA Terrain & Hypsometric Map',
    badge: 'Topographic Elevation',
    src: '/assets/maps/Terrain.jpg',
    description: 'Laser altimetry elevation model (LOLA) depicting hypsometric elevation variations from deep impact basins to polar highlands.'
  },
  {
    id: 'shaded-relief',
    title: 'Topographic Shaded Relief',
    badge: 'Surface Morphology',
    src: '/assets/maps/Shade.jpg',
    description: 'Simulated low-sun hillshade illumination capturing complex impact crater rims, ejecta blankets, and volcanic rilles.'
  },
  {
    id: 'mineral-color',
    title: 'Mineral Composition Map',
    badge: 'Spectral Albedo',
    src: '/assets/lunar_color_map.jpg',
    description: 'Multispectral false-color ratio map highlighting iron (Fe) and titanium (Ti) abundances across basaltic maria.'
  },
  {
    id: 'digital-height',
    title: 'Digital Elevation Model (DEM)',
    badge: 'Heightmap Dataset',
    src: '/assets/lunar_height_map.jpg',
    description: 'High-resolution digital elevation dataset mapping global lunar terrain heights calibrated for planetary geodesy.'
  },
  {
    id: 'nearside-mosaic',
    title: 'Nearside Photographic Mosaic',
    badge: 'Optical Mosaic',
    src: '/assets/moon.jpg',
    description: 'Calibrated orbital optical reflectance mosaic displaying lunar maria (dark basaltic plains) and highland craters.'
  }
];

export const LunarMapsGallery = () => {
  const [selectedMap, setSelectedMap] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedMap(null);
    };
    if (selectedMap) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedMap]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>LUNAR MAPS & CARTOGRAPHY</h2>
        <p className={styles.sectionSubtitle}>
          Explore high-resolution global geological, elevation, and multi-spectral datasets captured by lunar orbiters and planetary surveys.
        </p>
      </div>

      <div className={styles.mapsGrid}>
        {lunarMapsData.map((map) => (
          <div 
            key={map.id} 
            className={styles.mapCard}
            onClick={() => setSelectedMap(map)}
          >
            <div className={styles.imageWrapper}>
              <img 
                src={map.src} 
                alt={map.title} 
                className={styles.mapImage}
                loading="lazy"
              />
              <span className={styles.badge}>{map.badge}</span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.mapTitle}>{map.title}</h3>
              <p className={styles.mapDescription}>{map.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.viewAction}>
                  Click to View Full Map
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedMap && (
        <div className={styles.modalOverlay} onClick={() => setSelectedMap(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedMap(null)} aria-label="Close">
              &times;
            </button>
            <div className={styles.modalImageWrapper}>
              <img 
                src={selectedMap.src} 
                alt={selectedMap.title} 
                className={styles.modalImage} 
              />
            </div>
            <div className={styles.modalDetails}>
              <div>
                <h3 className={styles.modalTitle}>{selectedMap.title}</h3>
                <p className={styles.modalDesc}>{selectedMap.description}</p>
              </div>
              <span className={styles.badge}>{selectedMap.badge}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LunarMapsGallery;
