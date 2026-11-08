import React from 'react';
import styles from '../LunarObservatory.module.css';

export const LunarHeroTelemetry = ({ telemetry, loading }) => {
  const formatIllumination = () => {
    if (loading) return '...';
    if (telemetry?.illumination_percentage == null) return 'N/A';
    return `${Math.round(telemetry.illumination_percentage)}`;
  };

  const formatDistance = () => {
    if (loading) return '...';
    if (!telemetry?.distance_km) return 'N/A';
    return Math.round(telemetry.distance_km).toLocaleString();
  };

  const formatAngle = () => {
    if (loading) return '...';
    if (telemetry?.sun_moon_angle == null) return 'N/A';
    return Number(telemetry.sun_moon_angle).toFixed(1);
  };

  const formatNextFullMoon = () => {
    if (loading) return '...';
    if (!telemetry?.next_full_moon) return 'N/A';
    try {
      const d = new Date(telemetry.next_full_moon);
      return isNaN(d.getTime()) ? telemetry.next_full_moon : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return telemetry.next_full_moon;
    }
  };

  const formatCoordinates = () => {
    if (loading) return '...';
    if (!telemetry?.ra && !telemetry?.dec) return 'N/A';
    
    // Clean long coordinate strings into clean RA / Dec display
    let ra = telemetry?.ra || '--';
    let dec = telemetry?.dec || '--';
    
    // If format is like "19h 20m 19.41s", shorten to "19h 20m"
    const raMatch = ra.match(/(\d+h\s*\d+m)/);
    if (raMatch) ra = raMatch[1];
    
    // If format is like "-26deg 08' 24.8"", format to "-26° 08'"
    dec = dec.replace('deg', '°').replace(/(\.\d+)?["']?\s*$/, '');
    const decMatch = dec.match(/([+-]?\d+°\s*\d+['′]?)/);
    if (decMatch) dec = decMatch[1];

    return `${ra} / ${dec}`;
  };

  return (
    <aside className={styles.unifiedGlassSidebar}>
      <div className={styles.sidebarHeader}>Lunar Telemetry</div>

      <div className={styles.metricSection}>
        <div className={styles.metricValue}>
          {formatIllumination()}{' '}
          <span className={styles.metricUnit}>%</span>
        </div>
        <div className={styles.metricSubLabel}>Phase Illumination</div>

        <div className={styles.metricValueHighlight}>
          {loading ? '...' : (telemetry?.phase_name || 'N/A')}
        </div>
        <div className={styles.metricSubLabel}>Current Lunar Phase</div>
      </div>

      <div className={styles.metricSection}>
        <div className={styles.metricValue}>
          {formatDistance()}{' '}
          <span className={styles.metricUnit}>km</span>
        </div>
        <div className={styles.metricSubLabel}>Distance to Earth</div>

        <div className={styles.metricValue}>
          {formatAngle()}{' '}
          <span className={styles.metricUnit}>°</span>
        </div>
        <div className={styles.metricSubLabel}>Sun-Moon Phase Angle</div>
      </div>

      <div className={styles.metricSection}>
        <div className={styles.metricValueCoords}>
          {formatCoordinates()}
        </div>
        <div className={styles.metricSubLabel}>Equatorial (RA / Dec)</div>

        <div className={styles.metricValue}>
          {formatNextFullMoon()}
        </div>
        <div className={styles.metricSubLabel}>Next Full Moon</div>
      </div>
    </aside>
  );
};

export default LunarHeroTelemetry;
