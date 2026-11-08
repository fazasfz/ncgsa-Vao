/**
 * Slider control to offset the current time and preview future/past lunar phases.
 * Props: targetDate (Date), setTargetDate (function).
 */
import React, { useState, useEffect } from 'react';
import styles from './TimeSliderView.module.css';

export default function TimeSliderView({ targetDate, setTargetDate }) {
  // Slider range: -30 days to +30 days (in hours)
  const MIN_HOURS = -30 * 24;
  const MAX_HOURS = 30 * 24;
  
  const [offsetHours, setOffsetHours] = useState(0);

  // Sync internal state if targetDate changes externally (e.g. reset)
  useEffect(() => {
    if (!targetDate) {
      setOffsetHours(0);
    } else {
      const diff = targetDate.getTime() - new Date().getTime();
      setOffsetHours(Math.round(diff / (1000 * 60 * 60)));
    }
  }, [targetDate]);

  const handleChange = (e) => {
    const hours = parseInt(e.target.value, 10);
    setOffsetHours(hours);
    const newDate = new Date(new Date().getTime() + hours * 60 * 60 * 1000);
    setTargetDate(newDate);
  };

  const handleReset = () => {
    setOffsetHours(0);
    setTargetDate(null);
  };

  const displayDate = targetDate || new Date();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>TIME TRAVEL</h3>
        <span className={styles.currentDate}>
          {displayDate.toLocaleString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
            timeZone: 'Asia/Karachi'
          })} PKT
        </span>
      </div>
      <div className={styles.sliderWrapper}>
        <input 
          type="range" 
          min={MIN_HOURS} 
          max={MAX_HOURS} 
          step="1" 
          value={offsetHours}
          onChange={handleChange}
          className={styles.slider}
        />
        <button className={styles.resetBtn} onClick={handleReset}>NOW</button>
      </div>
    </div>
  );
}
