import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import styles from './TelemetryDashboardSection.module.css';

const TelemetryDashboardSection = () => {
  // Simple mocked state to simulate active data processing
  const [activeProbes, setActiveProbes] = useState(14);
  const [bandwidth, setBandwidth] = useState(480);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate bandwidth slightly for a live feel
      setBandwidth(prev => {
        const fluctuate = Math.floor(Math.random() * 20) - 10;
        return Math.max(300, Math.min(800, prev + fluctuate));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'SYSTEM STATUS', value: 'ONLINE', status: 'ok' },
    { label: 'ACTIVE PROBES TRACKED', value: activeProbes.toString(), status: 'neutral' },
    { label: 'SOLAR WEATHER', value: 'NOMINAL', status: 'ok' },
    { label: 'LUNAR PHASE', value: 'WANING CRESCENT', status: 'neutral' },
    { label: 'CURRENT DOWNLINK', value: `${bandwidth} Mbps`, status: 'warning' }
  ];

  return (
    <SectionWrapper id="telemetry-dashboard" className={styles.dashboardSection} overlay={false}>
      <div className={styles.container}>
        <div className={styles.strip}>
          <div className={styles.stripLabel}>LIVE TELEMETRY</div>
          <div className={styles.metricsContainer}>
            {metrics.map((m, idx) => (
              <div key={idx} className={styles.metricItem}>
                <span className={styles.metricLabel}>{m.label} //</span>
                <span className={`${styles.metricValue} ${styles[m.status]}`}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default TelemetryDashboardSection;
