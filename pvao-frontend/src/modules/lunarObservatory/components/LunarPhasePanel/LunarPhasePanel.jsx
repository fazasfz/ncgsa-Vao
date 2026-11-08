/**
 * Displays an interactive lunar phase graphic based on current time or telemetry.
 * Computes precise phase illumination and whether it is waxing or waning.
 * Props: liveData (object).
 */
import React from 'react';
import styles from './LunarPhasePanel.module.css';
import MoonPhaseIcon from './MoonPhaseIcon';

const synodicMonth = 29.530588 * 24 * 60 * 60 * 1000;

// Simple extrapolator from next new moon
const getPhaseForDate = (date, nextNewMoonStr) => {
  if (!nextNewMoonStr) return 0;
  const newMoonDate = new Date(nextNewMoonStr);
  const diff = date.getTime() - newMoonDate.getTime();
  let phase = (diff % synodicMonth) / synodicMonth;
  if (phase < 0) phase += 1;
  return phase;
};


export default function LunarPhasePanel({ liveData, loading }) {
  if (loading || !liveData) {
    return (
      <div className={`${styles.container} ${styles.loading}`}>
        Loading Lunar Phase Calendar...
      </div>
    );
  }

  const { phase_name, next_full_moon, next_new_moon } = liveData;
  const isWaning = phase_name.toLowerCase().includes('waning') || phase_name.toLowerCase().includes('third');
  const waxingWaningState = isWaning ? 'Waning' : 'Waxing';

  // Generate upcoming 14 days for timeline
  const today = new Date();
  const upcomingDays = Array.from({length: 14}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.phaseTitle}>LUNAR PHASE CALENDAR</h2>
        </div>
      </div>

      <div className={styles.timelineWrapper}>
        <div className={styles.timelineScroll}>
          {upcomingDays.map((date, index) => {
            const isToday = index === 0;
            const phase = getPhaseForDate(date, next_new_moon);
            
            return (
              <div key={index} className={`${styles.timelineItem} ${isToday ? styles.todayItem : ''}`}>
                <span className={styles.dayLabel}>
                  {isToday ? 'TODAY' : date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                </span>
                <MoonPhaseIcon phase={phase} />
                <span className={styles.dateLabelBottom}>{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
