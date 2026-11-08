import React from 'react';
import styles from '../SolarObservatory.module.css';

export const SolarWindTelemetry = ({ telemetry, loading }) => {
    // Helper to filter out raw wavelength strings like "0.1-0.8nm"
    const getXrayClass = () => {
        if (loading) return '...';
        const flux = telemetry?.xray_flux;
        if (!flux || flux === '0.1-0.8nm') return 'N/A';
        return flux;
    };

    return (
        <aside className={styles.unifiedGlassSidebar}>
            <div className={styles.sidebarHeader}>Space Weather Telemetry</div>

            <div className={styles.metricSection}>
                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.solar_wind_speed ?? 'N/A')}{' '}
                    <span className={styles.metricUnit}>km/s</span>
                </div>
                <div className={styles.metricSubLabel}>Solar Wind Velocity</div>

                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.proton_density ?? 'N/A')}{' '}
                    <span className={styles.metricUnit}>p/cm³</span>
                </div>
                <div className={styles.metricSubLabel}>Proton Density</div>
            </div>

            <div className={styles.metricSection}>
                <div className={styles.metricValue}>
                    {getXrayClass()}
                </div>
                <div className={styles.metricSubLabel}>X-Ray Flux Class</div>

                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.kp_index ?? 'N/A')}
                </div>
                <div className={styles.metricSubLabel}>Planetary Kp Index</div>
            </div>

            {/* SWPC RTSW & Magnetic Data */}
            <div className={styles.metricSection}>
                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.bz_gsm ?? 'N/A')}{' '}
                    <span className={styles.metricUnit}>nT</span>
                </div>
                <div className={styles.metricSubLabel}>IMF Bz Vector (GSM)</div>

                <div className={styles.metricValue}>
                    {loading ? '...' : (telemetry?.sunspot_count ?? 'N/A')}
                </div>
                <div className={styles.metricSubLabel}>Active Sunspots</div>
            </div>
        </aside>
    );
};

export default SolarWindTelemetry;