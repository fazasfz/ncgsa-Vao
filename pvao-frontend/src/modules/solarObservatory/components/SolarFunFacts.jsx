// SolarFunFacts.jsx
import React, { useState, useEffect } from 'react';
import { solarFunFacts } from '../data/solarFunFacts';
import styles from '../SolarObservatory.module.css';

export const SolarFunFacts = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Trigger exit transition
            setIsVisible(false);

            // Swap fact and trigger enter transition after fade-out completes
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % solarFunFacts.length);
                setIsVisible(true);
            }, 500); // 500ms matches CSS transition time
        }, 7000); // 7s total cycle (6.5s display + 0.5s transition)

        return () => clearInterval(interval);
    }, []);

    const currentFact = solarFunFacts[currentIndex];

    return (
        <div className={styles.popFactCard}>
            <div className={styles.factBadge}>SOLAR FACTS</div>
            <div className={`${styles.factContent} ${isVisible ? styles.popIn : styles.popOut}`}>
                <p className={styles.factAnswer}>{currentFact?.answer || currentFact?.fact}</p>
            </div>
        </div>
    );
};

export default SolarFunFacts;