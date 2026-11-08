/**
 * UI card displaying numeric telemetry for the current moon phase (illumination, age).
 * Props: data (object), loading (boolean).
 */
import React from 'react';
import styles from './MoonPhaseCard.module.css';

const formatPKT = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' PKT';
  } catch (e) {
    return 'N/A';
  }
};

const MoonPhaseCard = ({ data, loading }) => {
  if (loading || !data) {
    return <div className={`${styles.card} ${styles.loading}`}>Loading telemetry...</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>LUNAR PHASE</h3>
        <span className={styles.liveIndicator}>LIVE (PKT)</span>
      </div>
      
      <div className={styles.primaryData}>
        <div className={styles.phaseName}>{data.phase_name}</div>
        <div className={styles.illumination}>
          <span className={styles.value}>{data.illumination_percentage}%</span>
          <span className={styles.label}>ILLUMINATED</span>
        </div>
      </div>

      <div className={styles.telemetryGrid}>
        <div className={styles.dataPoint}>
          <span className={styles.label}>MOONRISE (PKT)</span>
          <span className={styles.value}>{formatPKT(data.rise_time)}</span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>MOONSET (PKT)</span>
          <span className={styles.value}>{formatPKT(data.set_time)}</span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>NEXT NEW MOON</span>
          <span className={styles.value}>
            {data.next_new_moon ? new Date(data.next_new_moon).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Karachi' }) : 'N/A'}
          </span>
        </div>
        <div className={styles.dataPoint}>
          <span className={styles.label}>NEXT FULL MOON</span>
          <span className={styles.value}>
            {data.next_full_moon ? new Date(data.next_full_moon).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Karachi' }) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseCard;
