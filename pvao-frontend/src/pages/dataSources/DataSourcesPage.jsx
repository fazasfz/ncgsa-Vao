/**
 * Data Sources page for the Virtual Astronomical Observatory.
 * Lists all active telemetry integrations and data endpoints.
 */
import React from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../components/common/SectionWrapper/SectionWrapper';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './DataSourcesPage.module.css';

const DataSourcesPage = () => {
  const revealRef = useScrollReveal();

  const sources = [
    { name: 'NASA & NASA Archives', desc: 'Homepage Hero Video, Imagery Catalogs, Module Assets, & Astronomy Picture of the Day (APOD)' },
    { name: 'ESA Archives', desc: 'European Space Agency Mission Archives, Space Science Datasets, & Observational Telemetry' },
    { name: 'NASA Exoplanet Archive', desc: 'Exoplanet Data Catalog & Habitable Zone Parameters (Exora)' },
    { name: 'Satellite Tracker 3D', desc: '3D Orbit Visualization Engine & Real-Time Coordinate Mapping' },
    { name: 'Google Gemini AI', desc: 'Large Language Model API (Astro-Copilot)' },
    { name: 'NASA / USGS', desc: '3D Lunar Topography Models & Geological Survey Data (Lunar Observatory)' },
    { name: 'NASA Solar System Treks', desc: 'LRO WAC 2D Map & High-Resolution Surface Cartography (Lunar Observatory)' },
    { name: 'NOAA SWPC', desc: 'Space Weather Data, Solar Wind, & X-Ray Flux Telemetry (Solar Observatory)' },
    { name: 'NASA SDO & SOHO', desc: 'Live Solar Imagery Feeds & Real-Time Coronal Observation (Solar Observatory)' },
    { name: 'NASA GIBS & EPIC', desc: 'Global Imagery Browse Services & Earth Polychromatic Imaging Camera (Earth View)' },
    { name: 'JWST MAST', desc: 'Mikulski Archive for Space Telescopes (Deep Sky Explorer)' },
    { name: 'NASA JPL Horizons', desc: 'Ephemeris Engine & Solar System Dynamics (Astronomical Probes)' },
    { name: 'Stellarium Web', desc: 'Embedded Interactive Planetarium & Sky Portal (Zenith)' },
    { name: 'Slider Revolution', desc: 'Interactive Astronomical Visual Displays & Presentation Framework' }
  ];

  return (
    <div ref={revealRef}>
      <SectionWrapper id="data-sources" className={styles.dataSection} overlay={false}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.heading}>TELEMETRY SOURCES</h2>
          </div>
          
          <Row justify="center" className={styles.contentRow}>
            <Col xs={24} lg={16} className={styles.listCol}>
              <div className={styles.strip}>
                {sources.map((src, idx) => (
                  <div key={idx} className={styles.sourceItem}>
                    <span className={styles.sourceName}>{src.name}</span>
                    <span className={styles.sourceDesc}>{src.desc}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default DataSourcesPage;
