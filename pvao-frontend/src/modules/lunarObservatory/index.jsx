/**
 * Root entry point for the Lunar Observatory module.
 * Composes the hero stage, telemetry HUD, 3D viewer, and lower analytical panels.
 */
import React, { useState, useEffect } from 'react';
import styles from './LunarObservatory.module.css';
import { useLunarData } from './hooks/useLunarData';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFeatureCatalogue } from './hooks/useFeatureCatalogue';

// Hero Components
import LunarHeroTelemetry from './components/LunarHeroTelemetry';
import LunarHeroFunFacts from './components/LunarHeroFunFacts';
import LunarSurfaceViewer from './components/LunarSurfaceViewer/LunarSurfaceViewer';

// Lower Analytical Panels
import TimeSliderView from './components/TimeSliderView/TimeSliderView';
import MoonPhaseSnapshot from './components/MoonPhaseSnapshot/MoonPhaseSnapshot';
import MoonPhaseCard from './components/MoonPhaseCard/MoonPhaseCard';
import LunarPhasePanel from './components/LunarPhasePanel/LunarPhasePanel';
import FeatureExploreSection from './components/FeatureExploreSection/FeatureExploreSection';
import LunarMapLeaflet from './components/LunarMapLeaflet/LunarMapLeaflet';
import FeatureDetailsSection from './components/FeatureDetailsSection/FeatureDetailsSection';
import LunarEventsPanel from './components/LunarEventsPanel/LunarEventsPanel';
import LunarMapsGallery from './components/LunarMapsGallery/LunarMapsGallery';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import { lunarFunFacts } from './components/LunarFunFacts/funFacts.data';

export const LunarObservatory = () => {
  const [targetDate, setTargetDate] = useState(null);
  const { liveData, loading: liveLoading, error } = useLunarData(targetDate);
  const { width } = useBreakpoint();
  const isMobile = width <= 1024;
  const [viewMode] = useState('3D');
  const [currentTime, setCurrentTime] = useState('');

  const {
    features,
    loading: catalogLoading,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    selectedFeature,
    setSelectedFeatureId,
    nearbyFeatures,
  } = useFeatureCatalogue(viewMode);

  const handleCloseFeature = React.useCallback(() => setSelectedFeatureId(null), [setSelectedFeatureId]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Karachi',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      setCurrentTime(now.toLocaleString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (liveLoading && !liveData && !catalogLoading) {
    return <LoadingOverlay funFacts={lunarFunFacts.map(fact => fact.answer)} themeColor="var(--lunar-blue, #38bdf8)" />;
  }
  if (catalogLoading) {
    return <LoadingOverlay funFacts={lunarFunFacts.map(fact => fact.answer)} themeColor="var(--lunar-blue, #38bdf8)" />;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>Error loading lunar telemetry data</div>}

      {/* Full-Screen Hero Layout matching Solar Observatory */}
      <div className={styles.fullScreenHero}>
        <div className={styles.denseStarsLayer1} />
        <div className={styles.denseStarsLayer2} />
        <div className={styles.nebulaGlow} />

        {/* Overlay Title */}
        <header className={styles.overlayHeader}>
          <h1 className={styles.overlayTitle}>LUNAR OBSERVATORY</h1>
        </header>

        {/* Top-Right Floating Lunar Fun Facts */}
        <div className={styles.topRightFacts}>
          <LunarHeroFunFacts />
        </div>

        {/* 3-Column Hero Content Grid */}
        <div className={styles.heroContentGrid}>
          {/* Left Column: Live Lunar Telemetry */}
          <div className={styles.leftColumn}>
            <LunarHeroTelemetry telemetry={liveData} loading={liveLoading} />
          </div>

          {/* Center Column: 3D Interactive Moon Stage */}
          <div className={styles.centerColumn}>
            <div className={styles.lunarStage}>
              <div className={styles.lunarGlowHalo} />
              <LunarSurfaceViewer 
                liveData={liveData} 
                features={features} 
                loading={liveLoading || catalogLoading} 
                onSelectFeature={setSelectedFeatureId}
              />
              <div className={styles.timestampBadge}>
                LIVE OBSERVED TIME (PKT): {currentTime}
              </div>
            </div>
          </div>

          {/* Right Column: Moon Physical Specs */}
          <div className={styles.rightColumn}>
            <div className={styles.moonStatsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>AGE</span>
                <span className={styles.statValue}>4.53 Billion Years</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>BODY TYPE</span>
                <span className={styles.statValue}>Natural Satellite</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>RADIUS</span>
                <span className={styles.statValue}>1,737.4 kilometers</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>TEMPERATURE</span>
                <span className={styles.statValue}>-130°C to +120°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Dashboard Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%', padding: '0 2rem', marginTop: '2rem' }}>
        {/* 1. Live Lunar Telemetry & Time Controls */}
        <section style={{ position: 'relative' }}>
          <h2 className={styles.dashboardSectionTitle}>LIVE LUNAR TELEMETRY</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <TimeSliderView targetDate={targetDate} setTargetDate={setTargetDate} />
              <div>
                <MoonPhaseSnapshot liveData={liveData} loading={liveLoading} />
              </div>
            </div>
            <div>
              <MoonPhaseCard data={liveData} loading={liveLoading} />
            </div>
          </div>
        </section>

        {/* 2. Lunar Phase Panel */}
        <section>
          <LunarPhasePanel liveData={liveData} loading={liveLoading} />
        </section>

        {/* 3. Lunar Surface Explorer */}
        <section>
          <h2 className={styles.dashboardSectionTitle}>LUNAR SURFACE EXPLORER</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Left Column: List & Filters */}
            <div>
              <FeatureExploreSection 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory}
                features={features}
                catalogLoading={catalogLoading}
                selectedFeatureId={selectedFeature?.id}
                onSelectFeature={setSelectedFeatureId}
              />
            </div>

            {/* Center Column: 2D Moon Map */}
            <div style={{ height: '600px', background: 'var(--obsidian-1, #0c0f17)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LunarMapLeaflet 
                features={features}
                selectedFeatureId={selectedFeature?.id}
                onSelectFeature={setSelectedFeatureId}
              />
            </div>

            {/* Right Column: Details & Minimap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FeatureDetailsSection 
                selectedFeature={selectedFeature}
                nearbyFeatures={nearbyFeatures}
                onCloseFeature={handleCloseFeature}
                onSelectFeature={setSelectedFeatureId}
                liveData={liveData}
                liveLoading={liveLoading}
              />
            </div>
          </div>
        </section>

        {/* 4. Lunar Events Panel */}
        <section>
          <LunarEventsPanel liveData={liveData} />
        </section>

        {/* 5. Lunar Maps & Cartography Section */}
        <section>
          <LunarMapsGallery />
        </section>
      </div>
    </div>
  );
};

export default LunarObservatory;
