import React, { useState, useEffect } from 'react';
import { lunarFunFacts } from './LunarFunFacts/funFacts.data';
import styles from '../LunarObservatory.module.css';

export const LunarHeroFunFacts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % lunarFunFacts.length);
        setIsVisible(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const currentFact = lunarFunFacts[currentIndex];

  return (
    <div className={styles.popFactCard}>
      <div className={styles.factBadge}>LUNAR FACTS</div>
      <div className={`${styles.factContent} ${isVisible ? styles.popIn : styles.popOut}`}>
        <p className={styles.factAnswer}>{currentFact?.answer || currentFact?.question}</p>
      </div>
    </div>
  );
};

export default LunarHeroFunFacts;
