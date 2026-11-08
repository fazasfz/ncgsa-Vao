// index.jsx
import React, { useState, useEffect } from 'react';
import styles from './SolarObservatory.module.css';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import { solarFunFacts } from './data/solarFunFacts';
import InteractiveSun from './components/InteractiveSun';
import SolarWindTelemetry from './components/SolarWindTelemetry';
import LiveSunGallery from './components/LiveSunGallery';
import SolarFlares from './components/SolarFlares';
import SolarFeatures from './components/SolarFeatures';
import SolarTimeline from './components/SolarTimeline';
import SunspotRegions from './components/SunspotRegions';
import { SolarCycleGraph } from './components/SolarCycleGraph';
import { SolarFunFacts } from './components/SolarFunFacts';
import CoronalEvents from './components/CoronalEvents';

import { useSolarTelemetry } from './hooks/useSolarTelemetry';

export const SolarObservatory = () => {
  const { telemetry, loading } = useSolarTelemetry();

  if (loading) {
    return <LoadingOverlay funFacts={solarFunFacts.map(fact => fact.answer)} />;
  }

  return (
    <div className={styles.mainWrapper}>
      {/* Hero Container with space canvas background */}
      <div className={styles.fullScreenHero}>
        <div className={styles.denseStarsLayer1} />
        <div className={styles.denseStarsLayer2} />
        <div className={styles.nebulaGlow} />

        {/* Overlay Title */}
        <header className={styles.overlayHeader}>
          <h1 className={styles.overlayTitle}>SOLAR OBSERVATORY</h1>
        </header>

        {/* Top Right Floating Fun Facts Box */}
        <div className={styles.topRightFacts}>
          <SolarFunFacts />
        </div>

        {/* 3-Column Hero Stage */}
        <div className={styles.heroContentGrid}>
          {/* Left Column: Live Telemetry */}
          <div className={styles.leftColumn}>
            <SolarWindTelemetry telemetry={telemetry} loading={loading} />
          </div>

          {/* Center Column: 3D Sun */}
          <div className={styles.centerColumn}>
            <InteractiveSun telemetry={telemetry} loading={loading} />
          </div>

          {/* Right Column: Sun Stats */}
          <div className={styles.rightColumn}>
            <div className={styles.sunStatsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>AGE</span>
                <span className={styles.statValue}>4.5 Billion Years</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>STAR TYPE</span>
                <span className={styles.statValue}>Yellow Dwarf</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>RADIUS</span>
                <span className={styles.statValue}>696,340 kilometers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>TEMPERATURE</span>
                <span className={styles.statValue}>5,500 degrees Celsius</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Sections */}
      <LiveSunGallery images={telemetry?.live_images} loading={loading} />
      <SolarFeatures solarImage={telemetry?.live_images?.hmi_continuum || telemetry?.live_images?.aia_171} />
      <SolarFlares flareImage={telemetry?.live_images?.aia_131} loading={loading} />
      <SolarTimeline />
      <SunspotRegions />
      <CoronalEvents />
      <SolarCycleGraph />
    </div>
  );
};

export default SolarObservatory;