import React from "react";
import styles from "./astronomicalProbeTracker.module.css";

export const ProbeKpiHeader = ({ activeCount, targetBody, lastUpdated }) => {
    return (
        <div className={styles.aptKpiContainer}>
            <div className={styles.aptKpiCard}>
                <span className={styles.aptKpiLabel}>Target Center</span>
                <span className={styles.aptKpiVal}>{targetBody.toUpperCase()}</span>
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
    );
};