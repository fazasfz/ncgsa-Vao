/**
 * Reusable carousel component to display a rotating list of educational facts.
 * Props: title (string), facts (array).
 */
import React, { useState, useEffect } from 'react';
import styles from './FactCarousel.module.css';
import SectionHeading from '../SectionHeading/SectionHeading';

const FactCarousel = ({ title, facts }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (!facts || facts.length === 0) return;

        const timer = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % facts.length);
                setFade(true);
            }, 300);
        }, 7000);

        return () => clearInterval(timer);
    }, [facts]);

    if (!facts || facts.length === 0) return null;

    const currentFact = facts[currentIndex];

    return (
        <div className={styles.factsWrapper}>
            <SectionHeading>{title}</SectionHeading>

            <div className={styles.tickerContainer}>
                <div className={styles.tickerHeader}>
                    <span className={styles.tickerBadge}>DID YOU KNOW?</span>
                    <span className={styles.tickerCategory}>{currentFact.category}</span>
                </div>

                <div className={`${styles.tickerBody} ${fade ? styles.fadeIn : styles.fadeOut}`}>
                    <p className={styles.factQuestion}>{currentFact.question}</p>
                    <p className={styles.factAnswer}>{currentFact.answer}</p>
                </div>

                <div className={styles.dotsContainer}>
                    {facts.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
                            onClick={() => {
                                setFade(false);
                                setTimeout(() => {
                                    setCurrentIndex(idx);
                                    setFade(true);
                                }, 300);
                            }}
                            aria-label={`Go to fact ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FactCarousel;
