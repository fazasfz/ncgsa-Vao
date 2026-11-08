/**
 * Renders upcoming lunar events like eclipses or supermoons based on live telemetry data.
 * Props: liveData (object), loading (boolean).
 */
import React from 'react';
import styles from './LunarEventsPanel.module.css';

export default function LunarEventsPanel({ liveData }) {
  // We'll generate a list of events based on liveData
  const events = [];

  if (liveData?.next_new_moon) {
    events.push({
      id: 'new_moon',
      type: 'PHASE',
      name: 'New Moon',
      date: new Date(liveData.next_new_moon),
      description: 'The Moon is between Earth and the Sun, making it invisible from Earth.'
    });
  }

  if (liveData?.next_full_moon) {
    events.push({
      id: 'full_moon',
      type: 'PHASE',
      name: 'Full Moon',
      date: new Date(liveData.next_full_moon),
      description: 'The Moon is fully illuminated as seen from Earth.'
    });
  }

  // Sort events by date
  events.sort((a, b) => a.date - b.date);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>UPCOMING EVENTS</h2>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.eventTable}>
          <thead>
            <tr>
              <th>DATE</th>
              <th>EVENT</th>
              <th>TYPE</th>
              <th>DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? events.map(event => (
              <tr key={event.id}>
                <td className={styles.eventDate}>
                  {event.date.toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric',
                    timeZone: 'Asia/Karachi'
                  })}
                </td>
                <td style={{ fontWeight: 500 }}>{event.name}</td>
                <td><span className={styles.eventType}>{event.type}</span></td>
                <td className={styles.eventDesc}>{event.description}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                  No upcoming events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
