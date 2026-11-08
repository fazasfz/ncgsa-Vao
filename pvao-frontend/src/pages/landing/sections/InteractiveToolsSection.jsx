import React from 'react';
import { Row, Col } from 'antd';
import { NavLink } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { PATHS } from '../../../routes/routePaths';
import { useAstroCopilotContext } from '../../../context/AstroCopilotContext';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import styles from './InteractiveToolsSection.module.css';

const InteractiveToolsSection = () => {
  const { openCopilot } = useAstroCopilotContext();

  return (
    <SectionWrapper id="interactive-tools" className={styles.toolsSection} overlay={false}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>INTERACTIVE TOOLS</h2>
        </div>

        <Row gutter={[24, 24]} className={styles.toolsGrid}>
          {/* Solar System Simulator */}
          <Col xs={24} lg={12}>
            <a href="https://dynamix209.github.io/solar-system-orbital-simulator/" target="_blank" rel="noopener noreferrer" className={`${styles.toolCard} ${styles.simulatorCard}`}>
              <div className={styles.cardOverlay}></div>
              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <h3 className={styles.toolTitle}>SOLAR SYSTEM SIMULATOR</h3>
                  <div className={styles.arrowIcon}><ArrowRightOutlined /></div>
                </div>
                <HUDLabel text="INTERACTIVE | 3D" className={styles.toolBadge} />
                <p className={styles.toolDesc}>
                  Engage with a real-time, 3D interactive model of the solar system. Track planetary orbits, observe celestial mechanics, and visualize the scale of our cosmic neighborhood.
                </p>
              </div>
            </a>
          </Col>

          {/* Astro-Copilot */}
          <Col xs={24} lg={12}>
            <div className={`${styles.toolCard} ${styles.copilotCard}`} onClick={openCopilot} style={{ cursor: 'pointer' }}>
              <div className={styles.cardOverlayCopilot}></div>
              <div className={styles.cardContent}>
                <div className={styles.titleRow}>
                  <h3 className={styles.toolTitle}>ASTRO-COPILOT</h3>
                  <div className={styles.arrowIcon}><ArrowRightOutlined /></div>
                </div>
                <HUDLabel text="AI | ASSISTANT" className={styles.toolBadge} />
                <p className={styles.toolDesc}>
                  Your personal, AI-powered astronomical research assistant. Ask complex questions about the cosmos, query real-time data, and get instant explanations for phenomena.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </SectionWrapper>
  );
};

export default InteractiveToolsSection;
