/**
 * Top hero section of the landing page featuring a background video and live coordinates.
 */
import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../../components/common/SectionWrapper/SectionWrapper';
import HUDLabel from '../../../components/common/HUDLabel/HUDLabel';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { getLocalCoordinates, getLiveTime } from '../../../utils/formatCoordinates';
import heroVideo from '../../../assets/14950-galaxies-flythrough-1080.mp4';

import styles from './HeroSection.module.css';

const HeroSection = () => {
  const [time, setTime] = useState(getLiveTime());
  const revealRef = useScrollReveal();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div ref={revealRef}>
      <SectionWrapper 
        id="hero" 
        className={styles.heroSection} 
        bgVideo={heroVideo}
        overlayClassName={styles.heroOverlay}
      >
        <div className={styles.hudTopLeft}>
          <HUDLabel text={getLocalCoordinates()} />
          <HUDLabel text={time} />
        </div>
        
        <div className={styles.centerContent}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>
              {"VIRTUAL\nASTRONOMY OBSERVATORY"}
            </h1>
          </div>
          <p className={styles.platformDescription}>
            A centralized platform to explore, visualize, and analyze live astronomical data and deep-space imagery from global observatories.
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default HeroSection;
