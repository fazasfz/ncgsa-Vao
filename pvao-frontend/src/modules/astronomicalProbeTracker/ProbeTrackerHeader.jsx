import React from 'react';
import styles from './astronomicalProbeTracker.module.css';

export const ProbeTrackerHeader = ({
  activeBody = "earth",
  setActiveBody,
  searchQuery = "",
  setSearchQuery,
  activeCount = 0,
  lastUpdated = ""
}) => {
  const bodies = ['earth', 'moon', 'mars', 'sun'];

  return (
    <div className={styles.aptHeaderContainer}>
      <div className={styles.aptTitleGroup}>
        <h1 className={styles.aptMainTitle}>Astronomical Probes</h1>
      </div>

      <div className={styles.aptTopRightWrapper}>
        <div className={styles.aptKpiContainerInline}>
          <div className={styles.aptKpiCard}>
            <span className={styles.aptKpiLabel}>Target Center</span>
            <span className={styles.aptKpiVal}>{String(activeBody).toUpperCase()}</span>
          </div>
          <div className={styles.aptKpiCard}>
            <span className={styles.aptKpiLabel}>Tracked Probes</span>
            <span className={styles.aptKpiVal}>{activeCount}</span>
          </div>
          <div className={styles.aptKpiCard}>
            <span className={styles.aptKpiLabel}>Signal Status</span>
            <span className={styles.aptKpiStatus}>LIVE</span>
          </div>
          <div className={styles.aptKpiCard}>
            <span className={styles.aptKpiLabel}>Last Sync</span>
            <span className={styles.aptKpiValTime}>{lastUpdated || "--:--:--"}</span>
          </div>
        </div>

        <div className={styles.aptControlsGroup}>
          <input
            type="text"
            placeholder="Search probes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.aptSearchInput}
          />
          <div className={styles.aptButtonGroup}>
            {bodies.map((body) => (
              <button
                key={body}
                className={`${styles.aptBodyBtn} ${activeBody.toLowerCase() === body ? styles.aptActiveBodyBtn : ''}`}
                onClick={() => setActiveBody(body)}
              >
                {body}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbeTrackerHeader;